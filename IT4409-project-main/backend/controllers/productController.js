import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";
import { redisClient } from "../config/redis.js";
import { normalizeMenuProductPayload } from "../utils/menuDomain.js";
import { buildProductFilter } from "../utils/productQuery.js";

const PRODUCT_CACHE_KEY = "products:all";
const BESTSELLER_CACHE_KEY = "products:bestsellers";

const uploadBufferToCloudinary = async (fileBuffer, mimetype) => {
  const dataUri = `data:${mimetype};base64,${fileBuffer.toString("base64")}`;
  const res = await cloudinary.uploader.upload(dataUri, {
    folder: "shop_products",
  });
  return res.secure_url;
};

const clearProductsCache = async () => {
  if (!redisClient || !redisClient.isOpen) return;
  await redisClient.del(PRODUCT_CACHE_KEY);
  if (typeof redisClient.keys === "function") {
    const bestSellerKeys = await redisClient.keys(`${BESTSELLER_CACHE_KEY}:*`);
    if (Array.isArray(bestSellerKeys) && bestSellerKeys.length > 0) {
      await redisClient.del(bestSellerKeys);
    }
  }
};

const resolveCategoryId = async (category) => {
  if (!category) return undefined;
  if (mongoose.Types.ObjectId.isValid(category)) return category;

  const found = await Category.findOne({
    $or: [
      { name: { $regex: `^${category}$`, $options: "i" } },
      { slug: { $regex: `^${category}$`, $options: "i" } },
    ],
  });

  return found?._id;
};

const uploadImages = async (files = []) => {
  const images = [];

  for (const file of files) {
    try {
      const url = await uploadBufferToCloudinary(file.buffer, file.mimetype);
      images.push(url);
    } catch (error) {
      console.error(
        "Upload to Cloudinary failed",
        file.originalname,
        error?.message || error
      );
    }
  }

  return images;
};

export const createProduct = async (req, res) => {
  try {
    const normalized = normalizeMenuProductPayload(req.body);
    const images = await uploadImages(req.files || []);
    const category = await resolveCategoryId(req.body.category);

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const product = await Product.create({
      storeId: req.body.storeId || undefined,
      name: normalized.name,
      slug: normalized.slug,
      description: normalized.description,
      price: normalized.price,
      discountPrice: normalized.discountPrice,
      stock: normalized.stock,
      soldCount: normalized.soldCount,
      itemType: normalized.itemType,
      preparationTime: normalized.preparationTime,
      spiceLevel: normalized.spiceLevel,
      category,
      images,
      sizes: normalized.sizes,
      addons: normalized.addons,
      comboItems: normalized.comboItems,
      badges: normalized.badges,
      specifications: normalized.specifications,
      highlights: normalized.highlights,
      isActive: normalized.isActive,
      isAvailable: normalized.isAvailable,
      isBestSeller: normalized.isBestSeller,
      isNew: normalized.isNew,
    });

    await clearProductsCache();
    await product.populate("category", "name slug");
    return res.status(201).json(product);
  } catch (err) {
    console.error("createProduct error", err);
    return res
      .status(500)
      .json({ message: "Error creating product", error: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { limit } = req.query;
    const parsedFilter = buildProductFilter(req.query);
    const filter = {};

    if (parsedFilter.categorySlug) {
      const category = await Category.findOne({
        slug: { $regex: `^${parsedFilter.categorySlug}$`, $options: "i" },
      }).select("_id");

      if (!category) {
        return res.json([]);
      }

      filter.category = category._id;
    }

    if (parsedFilter.itemType) {
      filter.itemType = parsedFilter.itemType;
    }

    if (parsedFilter.spiceLevel) {
      filter.spiceLevel = parsedFilter.spiceLevel;
    }

    if (parsedFilter.isAvailable !== undefined) {
      filter.isAvailable = parsedFilter.isAvailable;
    }

    if (parsedFilter.isFeatured === true) {
      filter.$and = [{ $or: [{ isBestSeller: true }, { isNew: true }] }];
    }

    if (parsedFilter.searchRegex) {
      const matchingCategories = await Category.find({
        $or: [
          { name: parsedFilter.searchRegex },
          { slug: parsedFilter.searchRegex },
        ],
      }).select("_id");

      filter.$or = [
        { name: parsedFilter.searchRegex },
        { slug: parsedFilter.searchRegex },
        { description: parsedFilter.searchRegex },
        { highlights: parsedFilter.searchRegex },
        { badges: parsedFilter.searchRegex },
        { comboItems: parsedFilter.searchRegex },
      ];

      if (matchingCategories.length) {
        filter.$or.push({
          category: { $in: matchingCategories.map((item) => item._id) },
        });
      }
    }

    if (Object.keys(filter).length) {
      const query = Product.find(filter)
        .sort({ createdAt: -1 })
        .populate("category", "name slug");

      if (limit) {
        query.limit(Number(limit));
      }

      return res.json(await query.exec());
    }

    if (redisClient && redisClient.isOpen) {
      const cachedProducts = await redisClient.get(PRODUCT_CACHE_KEY);
      if (cachedProducts) {
        const products = JSON.parse(cachedProducts);
        if (limit) {
          return res.json(products.slice(0, Number(limit)));
        }
        return res.json(products);
      }
    }

    const query = Product.find()
      .sort({ createdAt: -1 })
      .populate("category", "name slug");

    if (limit) {
      query.limit(Number(limit));
    }

    const products = await query.exec();

    if (redisClient && redisClient.isOpen) {
      await redisClient.setEx(
        PRODUCT_CACHE_KEY,
        3600,
        JSON.stringify(products)
      );
    }

    return res.json(products);
  } catch (err) {
    console.error("getProducts error", err);
    return res.status(500).json({ message: "Error fetching products" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = await Product.findById(id)
      .populate("category", "name slug")
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json(product);
  } catch (err) {
    console.error("getProductById error", err);
    return res.status(500).json({ message: "Error fetching product" });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const ids = String(req.query.ids || "")
      .split(",")
      .filter(Boolean);
    const products = await Product.find({ _id: { $in: ids } })
      .populate("category", "name slug")
      .lean();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getBestSellerProducts = async (req, res) => {
  try {
    const { limit = 15 } = req.query;
    const cacheKey = `${BESTSELLER_CACHE_KEY}:${limit}`;

    if (redisClient && redisClient.isOpen) {
      const cached = await redisClient.get(cacheKey);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
    }

    const products = await Product.aggregate([
      {
        $match: {
          $and: [
            { $or: [{ isActive: true }, { isActive: { $exists: false } }] },
            {
              $or: [{ isAvailable: true }, { isAvailable: { $exists: false } }],
            },
          ],
        },
      },
      {
        $addFields: {
          sortPriority: { $cond: [{ $eq: ["$isBestSeller", true] }, 0, 1] },
        },
      },
      { $sort: { sortPriority: 1, soldCount: -1, createdAt: -1 } },
      { $limit: Number(limit) },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $addFields: {
          category: { $arrayElemAt: ["$category", 0] },
        },
      },
      {
        $project: {
          name: 1,
          slug: 1,
          price: 1,
          discountPrice: 1,
          images: { $slice: ["$images", 1] },
          itemType: 1,
          preparationTime: 1,
          spiceLevel: 1,
          badges: 1,
          isBestSeller: 1,
          isNew: 1,
          stock: 1,
          soldCount: 1,
          sizes: 1,
          addons: 1,
          "category.name": 1,
          "category.slug": 1,
        },
      },
    ]);

    if (redisClient && redisClient.isOpen) {
      await redisClient.setEx(cacheKey, 300, JSON.stringify(products));
    }

    res.json(products);
  } catch (err) {
    console.error("getBestSellerProducts error", err);
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const normalized = normalizeMenuProductPayload({
      ...product.toObject(),
      ...req.body,
    });
    const category = await resolveCategoryId(req.body.category);

    product.name = normalized.name;
    product.slug = normalized.slug;
    product.description = normalized.description;
    product.price = normalized.price;
    product.discountPrice = normalized.discountPrice;
    product.stock = normalized.stock;
    product.soldCount = normalized.soldCount;
    product.itemType = normalized.itemType;
    product.preparationTime = normalized.preparationTime;
    product.spiceLevel = normalized.spiceLevel;
    product.sizes = normalized.sizes;
    product.addons = normalized.addons;
    product.comboItems = normalized.comboItems;
    product.badges = normalized.badges;
    product.specifications = normalized.specifications;
    product.highlights = normalized.highlights;
    product.isActive = normalized.isActive;
    product.isAvailable = normalized.isAvailable;
    product.isBestSeller = normalized.isBestSeller;
    product.isNew = normalized.isNew;
    product.storeId = req.body.storeId || product.storeId;

    if (category !== undefined) product.category = category;
    if (req.body.category === "") product.category = undefined;

    const images = await uploadImages(req.files || []);
    if (images.length) {
      product.images = images;
    }

    await product.save();
    await clearProductsCache();

    await product.populate("category", "name slug");
    return res.json(product);
  } catch (err) {
    console.error("updateProduct error", err);
    return res
      .status(500)
      .json({ message: "Error updating product", error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    await clearProductsCache();
    return res.json({ message: "Product deleted", id: deleted._id });
  } catch (err) {
    console.error("deleteProduct error", err);
    return res.status(500).json({ message: "Error deleting product" });
  }
};
