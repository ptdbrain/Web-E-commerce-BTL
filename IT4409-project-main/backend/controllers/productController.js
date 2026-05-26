// Controller sản phẩm: CRUD + tìm kiếm + lọc + sắp xếp
// Tìm kiếm dùng regex (luôn chạy) kết hợp $text index, sort theo relevance
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

// Xóa toàn bộ cache sản phẩm sau mỗi thao tác tạo/sửa/xóa để dữ liệu luôn mới nhất
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

const SORT_MAP = {
  newest:     { createdAt: -1 },
  price_asc:  { discountPrice: 1 },
  price_desc: { discountPrice: -1 },
  rating:     { rating: -1 },
  bestseller: { soldCount: -1 },
};

export const getProducts = async (req, res) => {
  try {
    const {
      search, searchRegex, categorySlug, itemTypes, spiceLevels,
      isAvailable, isFeatured, minPrice, maxPrice, sortBy, page, limit,
    } = buildProductFilter(req.query);

    const skip = (page - 1) * limit;
    const sortOrder = SORT_MAP[sortBy] ?? SORT_MAP.newest;

    // Build base filter (common to all query branches)
    const baseFilter = {};

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
    if (isAvailable !== undefined) baseFilter.isAvailable = isAvailable;
    if (isFeatured) baseFilter.$or = [{ isBestSeller: true }, { isNew: true }];

    if (minPrice !== undefined || maxPrice !== undefined) {
      baseFilter.discountPrice = {};
      if (minPrice !== undefined) baseFilter.discountPrice.$gte = minPrice;
      if (maxPrice !== undefined) baseFilter.discountPrice.$lte = maxPrice;
    }

    // Tìm kiếm: regex luôn chạy để không bỏ sót, $text bổ sung nếu có index
    if (search) {
      const regexSearch = (filter) =>
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

      // Regex luôn chạy để đảm bảo không bỏ sót sản phẩm chứa ký tự tìm kiếm
      const regexResults = await regexSearch(baseFilter);

      let textResults = regexResults;
      try {
        const tmp = await Product.find({ ...baseFilter, $text: { $search: search } })
          .sort({ score: { $meta: "textScore" } })
          .populate("category", "name slug")
          .lean();
        if (tmp.length > 0) {
          // $text trả kết quả: merge, text lên đầu (relevance tốt hơn), regex bổ sung phần còn thiếu
          const textIds = new Set(tmp.map((p) => String(p._id)));
          textResults = [...tmp, ...regexResults.filter((p) => !textIds.has(String(p._id)))];
        }
      } catch {
        // $text lỗi (index chưa tồn tại, ký tự đặc biệt...): chỉ dùng regex
      }

      // Sắp xếp theo độ liên quan: tên bắt đầu bằng search → tên chứa search → còn lại
      const q = search.toLowerCase();
      textResults.sort((a, b) => {
        const aName = (a.name || "").toLowerCase();
        const bName = (b.name || "").toLowerCase();
        const rank = (name) => (name.startsWith(q) ? 0 : name.includes(q) ? 1 : 2);
        return rank(aName) - rank(bName);
      });

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

      const total = merged.length;
      return res.json({
        data: merged.slice(skip, skip + limit),
        total,
        page,
        totalPages: Math.ceil(total / limit) || 0,
      });
    }

    // Không có search → query thuần với filter + sort + pagination
    const isFiltered = Object.keys(baseFilter).length > 0;

    if (!isFiltered) {
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

      const all = await Product.find().sort(sortOrder).populate("category", "name slug").lean();

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

    // Query có filter: dùng countDocuments + find song song
    const [total, data] = await Promise.all([
      Product.countDocuments(baseFilter),
      Product.find(baseFilter)
        .sort(sortOrder)
        .skip(skip)
        .limit(limit)
        .populate("category", "name slug")
        .lean(),
    ]);

    return res.json({ data, total, page, totalPages: Math.ceil(total / limit) });
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
