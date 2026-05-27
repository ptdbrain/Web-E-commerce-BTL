import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import { sanitizeRequest } from "./middleware/sanitize.js";

import { connectRedis } from "./config/redis.js";

import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import productsRoutes from "./routes/productsRoutes.js";
import categoriesRoutes from "./routes/categoriesRoutes.js";
import ordersRoutes from "./routes/ordersRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reviewsRoutes from "./routes/reviewsRoutes.js";
import voucherRoutes from "./routes/voucherRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });
const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter((o) => o.length > 0);

const corsOptions = {
  origin: allowedOrigins.length ? allowedOrigins : "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: [
            "'self'",
            ...(allowedOrigins.length ? allowedOrigins : ["*"]),
          ],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  app.use(
    helmet.hsts({
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    })
  );
} else {
  app.use(helmet());
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(sanitizeRequest);

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

if (!process.env.MONGO_URI || !process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  console.error(
    "Missing required environment variables: MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET"
  );
  process.exit(1);
}

mongoose.connection.on("connected", async () => {
  console.log("MongoDB connected");
});

mongoose.connection.on("error", (err) =>
  console.error("MongoDB connection error:", err)
);
mongoose.connection.on("disconnected", () =>
  console.warn("MongoDB disconnected")
);

app.get("/", (req, res) => {
  res.send("Backend API running");
});

app.use("/api", authRoutes);
app.use("/api", cartRoutes);
app.use("/api", productsRoutes);
app.use("/api", categoriesRoutes);
app.use("/api", ordersRoutes);
app.use("/api", paymentRoutes);
app.use("/api", chatRoutes);
app.use("/api", userRoutes);
app.use("/api/reviews", reviewsRoutes);
const PORT = process.env.PORT || 5000;

app.use("/api", voucherRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});

app.use((err, req, res, next) => {
  if (err?.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ message: "Image file is too large. Max size is 5MB." });
  }
  if (err?.code === "UNSUPPORTED_IMAGE_TYPE") {
    return res.status(400).json({ message: err.message });
  }

  console.error("Unhandled API error:", err);
  return res.status(500).json({ message: "Server error" });
});

const startServer = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    if (process.env.REDIS_URL && process.env.REDIS_URL.trim()) {
      await connectRedis();
    } else {
      console.log("Redis disabled (REDIS_URL not set)");
    }

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
