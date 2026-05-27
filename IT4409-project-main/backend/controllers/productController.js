import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";
import { redisClient } from "../config/redis.js";
import { normalizeMenuProductPayload } from "../utils/menuDomain.js";
import { normalizeProductImageUrls } from "../utils/productImages.js";
import {
  buildProductFilter,
  buildProductVisibilityFilter,
} from "../utils/productQuery.js";

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
  if (typeof redisClient.keys === "function") {
    const [productKeys, bestSellerKeys] = await Promise.all([
      redisClient.keys(`${PRODUCT_CACHE_KEY}:*`),
      redisClient.keys(`${BESTSELLER_CACHE_KEY}:*`),
    ]);
    const toDelete = [...productKeys, ...bestSellerKeys].filter(Boolean);
    if (toDelete.length > 0) await redisClient.del(toDelete);
  }
};

const escapeRegExp = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const resolveCategoryId = async (category) => {
  if (!category) return undefined;
  if (mongoose.Types.ObjectId.isValid(category)) return category;

  const categoryPattern = escapeRegExp(category);
  const found = await Category.findOne({
    $or: [
      { name: { $regex: `^${categoryPattern}$`, $options: "i" } },
      { slug: { $regex: `^${categoryPattern}$`, $options: "i" } },
    ],
    isActive: { $ne: false },
  });

  return found?._id;
};

const validateProductPayload = (payload = {}) => {
  if (!payload.name) return "Product name is required";
  if (!payload.slug) return "Product slug is required";
  if (!Number.isFinite(payload.price) || payload.price <= 0) {
    return "Product price must be greater than 0";
  }
  if (!Number.isFinite(payload.stock) || payload.stock < 0) {
    return "Product stock cannot be negative";
  }
  return null;
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
    const validationError = validateProductPayload(normalized);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const uploadedImages = await uploadImages(req.files || []);
    const imageUrls = normalizeProductImageUrls(
      req.body.imageUrls ?? req.body.images
    );
    const images = [...imageUrls, ...uploadedImages].slice(0, 6);
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

const SORT_MAP = {
  newest:     { createdAt: -1 },
  price_asc:  { price: 1 },
  price_desc: { price: -1 },
  rating:     { rating: -1 },
  bestseller: { soldCount: -1 },
};

const getEffectivePrice = (product = {}) => {
  const discountPrice = Number(product.discountPrice);
  if (Number.isFinite(discountPrice) && discountPrice >= 0) return discountPrice;
  const price = Number(product.price);
  return Number.isFinite(price) ? price : 0;
};

const sortProductsForResponse = (products = [], sortBy = "newest") => {
  if (sortBy === "price_asc") {
    return [...products].sort((left, right) => getEffectivePrice(left) - getEffectivePrice(right));
  }

  if (sortBy === "price_desc") {
    return [...products].sort((left, right) => getEffectivePrice(right) - getEffectivePrice(left));
  }

  return products;
};

export const getProducts = async (req, res) => {
  try {
    const {
      search, searchRegex, categorySlug, itemTypes, spiceLevels,
      isAvailable, isFeatured, minPrice, maxPrice, sortBy, page, limit,
    } = buildProductFilter(req.query);

    const skip = (page - 1) * limit;
    const sortOrder = SORT_MAP[sortBy] ?? SORT_MAP.newest;
    const includeInactive =
      req.includeInactiveProducts === true ||
      (req.query.includeInactive === "true" && req.user?.role === "admin");

    // Build base filter (common to all query branches)
    const baseFilter = {
      ...buildProductVisibilityFilter({ includeInactive, isAvailable }),
    };

    if (categorySlug) {
      const cat = await Category.findOne({
        slug: { $regex: `^${categorySlug}$`, $options: "i" },
      }).select("_id");
      if (!cat) return res.json({ data: [], total: 0, page, totalPages: 0 });
      baseFilter.category = cat._id;
    }

    if (itemTypes.length === 1)   baseFilter.itemType   = itemTypes[0];
    else if (itemTypes.length > 1) baseFilter.itemType  = { $in: itemTypes };

    if (spiceLevels.length === 1)   baseFilter.spiceLevel  = spiceLevels[0];
    else if (spiceLevels.length > 1) baseFilter.spiceLevel = { $in: spiceLevels };
    if (isFeatured) baseFilter.$or = [{ isBestSeller: true }, { isNew: true }];

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceClauses = [];
      const effectivePrice = { $ifNull: ["$discountPrice", "$price"] };
      if (minPrice !== undefined) priceClauses.push({ $gte: [effectivePrice, minPrice] });
      if (maxPrice !== undefined) priceClauses.push({ $lte: [effectivePrice, maxPrice] });
      baseFilter.$expr = priceClauses.length === 1 ? priceClauses[0] : { $and: priceClauses };
    }

    // Search path: $text (với index) + fallback regex + merge category-name matches
    if (search) {
      const regexFallback = async (filter) =>
        Product.find({
          ...filter,
          $or: [
            { name: searchRegex },
            { description: searchRegex },
            { highlights: searchRegex },
            { badges: searchRegex },
          ],
        })
          .sort(sortOrder)
          .populate("category", "name slug")
          .lean();

      let textResults;
      try {
        const tmp = await Product.find({ ...baseFilter, $text: { $search: search } })
          .sort({ score: { $meta: "textScore" } })
          .populate("category", "name slug")
          .lean();
        // $text trả 0: từ quá ngắn/không có trong index → dùng regex
        textResults = tmp.length > 0 ? tmp : await regexFallback(baseFilter);
      } catch {
        // $text ném lỗi (index chưa có, ký tự đặc biệt...) → dùng regex
        textResults = await regexFallback(baseFilter);
      }

      // Thêm sản phẩm thuộc category có tên/slug khớp search (không trùng textResults)
      let merged = textResults;
      if (!baseFilter.category) {
        const catIds = await Category.find({
          $or: [{ name: searchRegex }, { slug: searchRegex }],
        }).distinct("_id");

        if (catIds.length > 0) {
          const textIds = new Set(textResults.map((p) => String(p._id)));
          const catResults = await Product.find({ ...baseFilter, category: { $in: catIds } })
            .sort(sortOrder)
            .populate("category", "name slug")
            .lean();
          merged = [...textResults, ...catResults.filter((p) => !textIds.has(String(p._id)))];
        }
      }

      const sorted = sortProductsForResponse(merged, sortBy);
      const total = sorted.length;
      return res.json({
        data: sorted.slice(skip, skip + limit),
        total,
        page,
        totalPages: Math.ceil(total / limit) || 0,
      });
    }

    // Không có search → query thuần với filter + sort + pagination
    const isFiltered = Object.keys(baseFilter).length > 0;

    if (!isFiltered && !includeInactive) {
      // Cache theo từng sort order (key khác nhau tránh trả sai thứ tự)
      const cacheKey = `${PRODUCT_CACHE_KEY}:${sortBy}`;
      if (redisClient && redisClient.isOpen) {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          const all = JSON.parse(cached);
          return res.json({
            data: all.slice(skip, skip + limit),
            total: all.length,
            page,
            totalPages: Math.ceil(all.length / limit),
          });
        }
      }

      const all = sortProductsForResponse(
        await Product.find(baseFilter)
          .sort(sortOrder)
          .populate("category", "name slug")
          .lean(),
        sortBy
      );

      if (redisClient && redisClient.isOpen) {
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(all));
      }

      return res.json({
        data: all.slice(skip, skip + limit),
        total: all.length,
        page,
        totalPages: Math.ceil(all.length / limit),
      });
    }

    if (!isFiltered) {
      const all = sortProductsForResponse(
        await Product.find(baseFilter)
          .sort(sortOrder)
          .populate("category", "name slug")
          .lean(),
        sortBy
      );

      return res.json({
        data: all.slice(skip, skip + limit),
        total: all.length,
        page,
        totalPages: Math.ceil(all.length / limit),
      });
    }

    // Query có filter: dùng countDocuments + find song song
    const filtered = sortProductsForResponse(
      await Product.find(baseFilter)
        .sort(sortOrder)
        .populate("category", "name slug")
        .lean(),
      sortBy
    );
    const total = filtered.length;
    const data = filtered.slice(skip, skip + limit);

    return res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error("getProducts error", err);
    return res.status(500).json({ message: "Error fetching products" });
  }
};

export const getAdminProducts = async (req, res) => {
  req.includeInactiveProducts = true;
  return getProducts(req, res);
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = await Product.findOne({
      _id: id,
      isActive: { $ne: false },
      isAvailable: { $ne: false },
    })
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
    const products = await Product.find({
      _id: { $in: ids },
      isActive: { $ne: false },
      isAvailable: { $ne: false },
    })
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
    const validationError = validateProductPayload(normalized);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const category = await resolveCategoryId(req.body.category);
    if (Object.prototype.hasOwnProperty.call(req.body, "category") && !category) {
      return res.status(400).json({ message: "Category is required" });
    }

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

    const uploadedImages = await uploadImages(req.files || []);
    const hasImageUrlPayload = Object.prototype.hasOwnProperty.call(
      req.body,
      "imageUrls"
    );
    const imageUrls = normalizeProductImageUrls(
      req.body.imageUrls ?? req.body.images
    );
    const nextImages = [...imageUrls, ...uploadedImages].slice(0, 6);
    if (hasImageUrlPayload || uploadedImages.length) {
      product.images = nextImages;
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
    const deleted = await Product.findByIdAndUpdate(
      id,
      { isActive: false, isAvailable: false },
      { new: true }
    );
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    await clearProductsCache();
    return res.json({ message: "Product hidden", id: deleted._id, product: deleted });
  } catch (err) {
    console.error("deleteProduct error", err);
    return res.status(500).json({ message: "Error deleting product" });
  }
};
