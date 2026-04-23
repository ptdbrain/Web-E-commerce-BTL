import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";
import Voucher, { EVoucherDiscountType } from "../models/Voucher.js";
import { connectRedis, redisClient } from "../config/redis.js";
import { categories as FOOD_CATEGORIES } from "../../frontend/src/data/categories.js";
import { menuProducts } from "../../frontend/src/data/menuData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const cleanRelated = process.argv.includes("--clean-related");

const ensureMongoConnection = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("Missing MONGO_URI in backend/.env");
  }

  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });
};

const clearRedisProductCache = async () => {
  if (!process.env.REDIS_URL || !process.env.REDIS_URL.trim()) {
    return;
  }

  try {
    await connectRedis();
    if (!redisClient?.isOpen) return;

    await redisClient.del("products:all");

    if (typeof redisClient.keys === "function") {
      const bestsellerKeys = await redisClient.keys("products:bestsellers*");
      if (Array.isArray(bestsellerKeys) && bestsellerKeys.length > 0) {
        await redisClient.del(bestsellerKeys);
      }
    }
  } catch (error) {
    console.warn("Could not clear Redis product cache:", error?.message || error);
  }
};

const resetCatalogCollections = async () => {
  await Product.deleteMany({});
  await Category.deleteMany({});
  await Voucher.deleteMany({});

  if (cleanRelated) {
    await Promise.all([
      Cart.deleteMany({}),
      Review.deleteMany({}),
      Order.deleteMany({}),
    ]);
  }
};

const createCategories = async () => {
  const docs = await Category.insertMany(
    FOOD_CATEGORIES.map((category) => ({
      name: category.name,
      slug: category.slug,
      icon: category.image,
      isActive: true,
    }))
  );

  return new Map(docs.map((doc) => [doc.slug, doc]));
};

const buildProductDocs = (categoryMap) =>
  menuProducts.map((product) => {
    const categorySlug = product.category?.slug;
    const categoryDoc = categoryMap.get(categorySlug);

    if (!categoryDoc) {
      throw new Error(`Missing category for slug "${categorySlug}"`);
    }

    return {
      _id: product._id,
      storeId: "default_store",
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice,
      stock: product.stock,
      soldCount: product.soldCount || 0,
      itemType: product.itemType,
      preparationTime: product.preparationTime,
      spiceLevel: product.spiceLevel || "",
      category: categoryDoc._id,
      images: Array.isArray(product.images) ? product.images : [],
      sizes: Array.isArray(product.sizes) ? product.sizes : [],
      addons: Array.isArray(product.addons) ? product.addons : [],
      comboItems: Array.isArray(product.comboItems) ? product.comboItems : [],
      badges: Array.isArray(product.badges) ? product.badges : [],
      highlights: Array.isArray(product.highlights) ? product.highlights : [],
      specifications: product.specifications || {},
      rating: product.rating || 0,
      numReviews: product.numReviews || 0,
      isActive: product.isActive !== false,
      isAvailable: product.isAvailable !== false,
      isBestSeller: Boolean(product.isBestSeller),
      isNew: Boolean(product.isNew),
    };
  });

const buildVoucherDocs = ({ categoryMap, productDocs }) => {
  const productsBySlug = new Map(productDocs.map((product) => [product.slug, product]));

  const getCategoryId = (slug) => {
    const category = categoryMap.get(slug);
    if (!category) {
      throw new Error(`Missing voucher category for slug "${slug}"`);
    }
    return category._id;
  };

  const getProductId = (slug) => {
    const product = productsBySlug.get(slug);
    if (!product) {
      throw new Error(`Missing voucher product for slug "${slug}"`);
    }
    return product._id;
  };

  return [
    {
      code: "FIREBITE15",
      description: "Giam 15% toi da 40.000d cho don tu 149.000d.",
      discountType: EVoucherDiscountType.Percent,
      discountValue: 15,
      maxDiscountAmount: 40000,
      minOrderValue: 149000,
      maxUsage: 500,
      usedCount: 0,
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2027-12-31T23:59:59.000Z"),
      isActive: true,
      appliesToAllUsers: true,
      appliesToAllProducts: true,
      users: [],
      products: [],
      categories: [],
    },
    {
      code: "LUNCH30K",
      description: "Giam 30.000d cho cac mon lunch-deals tu 119.000d.",
      discountType: EVoucherDiscountType.Amount,
      discountValue: 30000,
      maxDiscountAmount: 0,
      minOrderValue: 119000,
      maxUsage: 250,
      usedCount: 0,
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2027-12-31T23:59:59.000Z"),
      isActive: true,
      appliesToAllUsers: true,
      appliesToAllProducts: false,
      users: [],
      products: [],
      categories: [getCategoryId("lunch-deals")],
    },
    {
      code: "FREESHIP99",
      description: "Mien phi giao hang cho don delivery tu 99.000d.",
      discountType: EVoucherDiscountType.FreeShipping,
      discountValue: 0,
      maxDiscountAmount: 0,
      minOrderValue: 99000,
      maxUsage: 0,
      usedCount: 0,
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2027-12-31T23:59:59.000Z"),
      isActive: true,
      appliesToAllUsers: true,
      appliesToAllProducts: true,
      users: [],
      products: [],
      categories: [],
    },
    {
      code: "SWEET10",
      description: "Giam 10% toi da 25.000d cho desserts va drinks.",
      discountType: EVoucherDiscountType.Percent,
      discountValue: 10,
      maxDiscountAmount: 25000,
      minOrderValue: 59000,
      maxUsage: 300,
      usedCount: 0,
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2027-12-31T23:59:59.000Z"),
      isActive: true,
      appliesToAllUsers: true,
      appliesToAllProducts: false,
      users: [],
      products: [],
      categories: [getCategoryId("desserts"), getCategoryId("drinks")],
    },
    {
      code: "COMBO25",
      description: "Giam 25.000d cho cac combo FireBite tu 179.000d.",
      discountType: EVoucherDiscountType.Amount,
      discountValue: 25000,
      maxDiscountAmount: 0,
      minOrderValue: 179000,
      maxUsage: 180,
      usedCount: 0,
      startDate: new Date("2026-01-01T00:00:00.000Z"),
      endDate: new Date("2027-12-31T23:59:59.000Z"),
      isActive: true,
      appliesToAllUsers: true,
      appliesToAllProducts: false,
      users: [],
      products: [
        getProductId("combo-firebite-2-nguoi"),
        getProductId("combo-mi-y-ga-gion"),
        getProductId("combo-ga-ran-ca-doi"),
      ],
      categories: [],
    },
  ];
};

const main = async () => {
  console.log("Starting food catalog seed...");
  if (cleanRelated) {
    console.log(
      "Related collections will also be cleared: carts, reviews, orders"
    );
  }

  try {
    await ensureMongoConnection();
    await resetCatalogCollections();

    const categoryMap = await createCategories();
    const productDocs = buildProductDocs(categoryMap);
    const insertedProducts = await Product.insertMany(productDocs, { ordered: true });
    const voucherDocs = buildVoucherDocs({
      categoryMap,
      productDocs: insertedProducts,
    });
    await Voucher.insertMany(voucherDocs, { ordered: true });
    await clearRedisProductCache();

    console.log(
      `Seed completed: ${categoryMap.size} categories, ${productDocs.length} products, ${voucherDocs.length} vouchers`
    );
  } finally {
    try {
      if (redisClient?.isOpen) {
        await redisClient.disconnect();
      }
    } catch {}

    await mongoose.disconnect();
  }
};

main()
  .then(() => {
    console.log("Seeded FireBite categories, menu items, and demo vouchers.");
    console.log(
      "Use `npm run seed:food -- --clean-related` to clear carts, reviews, and orders for a clean demo."
    );
    process.exit(0);
  })
  .catch((error) => {
    console.error("Food catalog seed failed:", error?.message || error);
    process.exit(1);
  });
