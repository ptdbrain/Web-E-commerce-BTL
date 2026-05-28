import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
import ChatMessage from "../models/ChatMessage.js";
import ChatSupport from "../models/ChatSupport.js";
import Order, { EFulfillmentType, EOrderStatus, EPaymentMethod, EPaymentStatus } from "../models/Order.js";
import Review from "../models/Review.js";
import User from "../models/user.js";
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
  await Promise.all([
    Cart.deleteMany({}),
    ChatMessage.deleteMany({}),
    ChatSupport.deleteMany({}),
    Review.deleteMany({}),
    Order.deleteMany({}),
    User.deleteMany({}),
  ]);
};

const upsertDemoUser = async ({
  username,
  fullname,
  email,
  password,
  role,
  phoneNumber,
  addresses,
}) => {
  const hashed = await bcrypt.hash(password, 10);
  const update = {
    username,
    fullname,
    email,
    role,
    phoneNumber,
    addresses,
    isEmailVerified: true,
    authProvider: "local",
  };

  const user = await User.findOne({ username });
  if (user) {
    Object.assign(user, update);
    user.password = hashed;
    user.refreshToken = undefined;
    await user.save();
    return user;
  }

  return User.create({
    ...update,
    password: hashed,
  });
};

const createDemoUsers = async () => {
  const [admin, customer, customerTwo] = await Promise.all([
    upsertDemoUser({
      username: "admin",
      fullname: "FireBite Admin",
      email: "admin@firebite.local",
      password: "Admin@123",
      role: "admin",
      phoneNumber: "0900000001",
      addresses: ["FireBite HQ, Ha Noi"],
    }),
    upsertDemoUser({
      username: "khachhang",
      fullname: "Nguyen Minh Anh",
      email: "minhanh@firebite.local",
      password: "Customer@123",
      role: "customer",
      phoneNumber: "0900000002",
      addresses: ["12 Nguyen Trai, Thanh Xuan, Ha Noi"],
    }),
    upsertDemoUser({
      username: "linhpham",
      fullname: "Pham Gia Linh",
      email: "linhpham@firebite.local",
      password: "Customer@123",
      role: "customer",
      phoneNumber: "0900000003",
      addresses: ["88 Tran Duy Hung, Cau Giay, Ha Noi"],
    }),
  ]);

  return { admin, customer, customerTwo };
};

const toOrderItem = (product, quantity = 1) => {
  const unitPrice = product.discountPrice ?? product.price;
  return {
    productId: product._id,
    productName: product.name,
    productImage: product.images?.[0] || "",
    quantity,
    price: product.price,
    unitPrice,
    lineTotal: unitPrice * quantity,
    shippingPrice: 0,
    selectedSize: product.sizes?.find((size) => size.isDefault) || product.sizes?.[0] || undefined,
    selectedAddons: [],
    itemNote: "",
  };
};

const createDemoCart = async ({ customer, productDocs }) => {
  const items = [toOrderItem(productDocs[0], 1), toOrderItem(productDocs[6], 2)].map(
    (item) => ({
      cartKey: `${item.productId}:default`,
      productId: item.productId,
      productName: item.productName,
      productImage: item.productImage,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedAddons: item.selectedAddons,
      itemNote: item.itemNote,
      basePrice: item.price,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
    })
  );

  await Cart.findOneAndUpdate(
    { userId: customer._id },
    { userId: customer._id, items },
    { upsert: true, new: true }
  );
};

const createDemoOrders = async ({ customer, customerTwo, productDocs, voucherDocs }) => {
  const firebiteVoucher = voucherDocs.find((voucher) => voucher.code === "FIREBITE15");
  const orderSpecs = [
    {
      customer: customer,
      status: EOrderStatus.Pending,
      paymentStatus: EPaymentStatus.Unpaid,
      fulfillmentType: EFulfillmentType.Delivery,
      products: [[productDocs[0], 1], [productDocs[3], 1]],
      deliveryFee: 30000,
      note: "Khong cay, giao sau 18h.",
    },
    {
      customer: customerTwo,
      status: EOrderStatus.Preparing,
      paymentStatus: EPaymentStatus.Unpaid,
      fulfillmentType: EFulfillmentType.Pickup,
      products: [[productDocs[8], 1], [productDocs[14], 2]],
      deliveryFee: 0,
      pickupTime: "18:30",
      note: "Khach den lay tai quay.",
    },
    {
      customer: customer,
      status: EOrderStatus.Shipping,
      paymentStatus: EPaymentStatus.Paid,
      fulfillmentType: EFulfillmentType.Delivery,
      products: [[productDocs[20], 1], [productDocs[22], 1]],
      deliveryFee: 25000,
      voucher: firebiteVoucher,
      note: "Da thanh toan ZaloPay demo.",
    },
    {
      customer: customerTwo,
      status: EOrderStatus.Confirmed,
      paymentStatus: EPaymentStatus.Paid,
      fulfillmentType: EFulfillmentType.DineIn,
      products: [[productDocs[30], 1], [productDocs[31], 1]],
      deliveryFee: 0,
      tableBooking: {
        guestCount: 2,
        bookingTime: "19:00",
        contactNote: "Ban gan cua so neu con.",
      },
      note: "Don demo da hoan tat.",
    },
  ];

  const orders = [];
  for (const spec of orderSpecs) {
    const items = spec.products.map(([product, quantity]) => toOrderItem(product, quantity));
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const originalTotalPrice = subtotal + spec.deliveryFee;
    const discountAmount = spec.voucher ? Math.min(Math.round(originalTotalPrice * 0.15), 40000) : 0;
    const totalPrice = originalTotalPrice - discountAmount;

    orders.push(
      await Order.create({
        customerId: spec.customer._id,
        customerName: spec.customer.fullname,
        customerPhone: spec.customer.phoneNumber,
        customerEmail: spec.customer.email,
        items,
        orderStatus: spec.status,
        paymentStatus: spec.paymentStatus,
        paymentMethod:
          spec.paymentStatus === EPaymentStatus.Paid ? EPaymentMethod.Zalopay : EPaymentMethod.Cash,
        fulfillmentType: spec.fulfillmentType,
        shippingAddress:
          spec.fulfillmentType === EFulfillmentType.Delivery ? spec.customer.addresses[0] : "",
        pickupTime: spec.pickupTime,
        tableBooking: spec.tableBooking,
        note: spec.note,
        deliveryFee: spec.deliveryFee,
        totalPrice,
        originalTotalPrice,
        discountAmount,
        voucherCode: spec.voucher?.code,
        voucherId: spec.voucher?._id,
        voucherUsageCounted: Boolean(spec.voucher),
        stockReserved: true,
        stockReleased: false,
      })
    );
  }

  if (firebiteVoucher) {
    await Voucher.findByIdAndUpdate(firebiteVoucher._id, { usedCount: 1 });
  }

  return orders;
};

const createDemoReviews = async ({ customer, customerTwo, productDocs }) => {
  await Review.insertMany([
    {
      user_id: customer._id,
      product_id: productDocs[0]._id,
      userName: customer.fullname,
      rating: 5,
      comment: "Burger nong, sot vua mieng, giao nhanh.",
      isVerified: true,
    },
    {
      user_id: customerTwo._id,
      product_id: productDocs[30]._id,
      userName: customerTwo.fullname,
      rating: 4,
      comment: "Combo hop ly cho hai nguoi, can them lua chon it cay.",
      isVerified: true,
    },
  ]);
};

const createDemoChat = async ({ admin, customer, orders }) => {
  await ChatSupport.findOneAndUpdate(
    { user: customer._id },
    { user: customer._id, currentAdmin: admin._id, lastAdmin: admin._id },
    { upsert: true, new: true }
  );

  await ChatMessage.insertMany([
    {
      user: customer._id,
      order: orders[0]._id,
      role: "user",
      content: "Don nay co the giao sau 18h khong?",
      isReadByAdmin: true,
    },
    {
      user: customer._id,
      order: orders[0]._id,
      role: "assistant",
      content: "Duoc, FireBite se ghi chu giao sau 18h cho don cua ban.",
      isReadByAdmin: true,
    },
  ]);
};

const createDemoOperationalData = async ({ productDocs, voucherDocs }) => {
  const users = await createDemoUsers();
  await createDemoCart({ customer: users.customer, productDocs });
  const orders = await createDemoOrders({
    customer: users.customer,
    customerTwo: users.customerTwo,
    productDocs,
    voucherDocs,
  });
  await createDemoReviews({
    customer: users.customer,
    customerTwo: users.customerTwo,
    productDocs,
  });
  await createDemoChat({ admin: users.admin, customer: users.customer, orders });

  return { users, orders };
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
    const insertedVouchers = await Voucher.insertMany(voucherDocs, { ordered: true });
    const demo = await createDemoOperationalData({
      productDocs: insertedProducts,
      voucherDocs: insertedVouchers,
    });
    await clearRedisProductCache();

    console.log(
      `Seed completed: ${categoryMap.size} categories, ${productDocs.length} products, ${voucherDocs.length} vouchers, 3 users, ${demo.orders.length} orders`
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
    console.log("---------------------------------------------------------");
    console.log("DATABASE READY! You can now switch your frontend to use the DB.");
    console.log("In frontend/.env, set: VITE_USE_DATABASE_ONLY=true");
    console.log("---------------------------------------------------------");
    console.log(
      "Use `npm run seed:food -- --clean-related` to clear carts, reviews, and orders for a clean demo."
    );
    console.log("Demo login: admin / Admin@123, khachhang / Customer@123");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Food catalog seed failed:", error?.message || error);
    process.exit(1);
  });
