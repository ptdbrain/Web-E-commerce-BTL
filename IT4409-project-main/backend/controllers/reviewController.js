// Controller xử lý đánh giá sản phẩm
// - getReviewsByProduct: lấy danh sách review kèm thống kê (avg, phân phối sao)
// - createReview: tạo review mới, tự cập nhật rating sản phẩm sau khi lưu
import mongoose from "mongoose";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import User from "../models/user.js";

const SORT_MAP = {
  newest:  { createdAt: -1 },
  oldest:  { createdAt:  1 },
  highest: { rating: -1, createdAt: -1 },
  lowest:  { rating:  1, createdAt: -1 },
};

export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const sort   = SORT_MAP[req.query.sort] ?? SORT_MAP.newest;
    const page   = Math.max(1, parseInt(req.query.page)  || 1);
    const limit  = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip   = (page - 1) * limit;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: "productId không hợp lệ" });
    }

    const pid = new mongoose.Types.ObjectId(productId);

    const [aggResult] = await Review.aggregate([
      { $match: { product_id: pid } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avg:   { $avg: "$rating" },
          s5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
          s4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
          s3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          s2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
          s1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
        },
      },
    ]);

    const stats = aggResult
      ? {
          avg: parseFloat(aggResult.avg.toFixed(1)),
          total: aggResult.total,
          distribution: { 5: aggResult.s5, 4: aggResult.s4, 3: aggResult.s3, 2: aggResult.s2, 1: aggResult.s1 },
        }
      : { avg: 0, total: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };

    const reviews = await Review.find({ product_id: pid })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      reviews,
      stats,
      page,
      totalPages: Math.ceil(stats.total / limit),
      total: stats.total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tính lại rating trung bình và tổng số review sau mỗi lần tạo mới
const recalculateProductRating = async (productId) => {
  const [result] = await Review.aggregate([
    { $match: { product_id: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: null, avg: { $avg: "$rating" }, total: { $sum: 1 } } },
  ]);
  await Product.findByIdAndUpdate(productId, {
    rating: result ? Number(result.avg.toFixed(1)) : 0,
    numReviews: result?.total ?? 0,
  });
};

export const createReview = async (req, res) => {
  try {
    const { rating, comment, userName } = req.body;
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: "productId không hợp lệ" });
    }

    const productExists = await Product.findById(productId).select("_id").lean();
    if (!productExists) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Số sao không hợp lệ (1-5)" });
    }

    const reviewData = {
      product_id: productId,
      rating: Number(rating),
      comment,
      isVerified: false,
    };

    if (req.user) {
      // User đã đăng nhập — JWT payload chỉ có { id, role }
      const existed = await Review.findOne({
        product_id: productId,
        user_id: req.user.id,
      });
      if (existed) {
        return res.status(400).json({ message: "Bạn đã đánh giá sản phẩm này rồi" });
      }

      const user = await User.findById(req.user.id).select("username fullname avatarPicture").lean();
      reviewData.user_id = req.user.id;
      reviewData.userName = user?.fullname || user?.username || "Người dùng";
      reviewData.userAvatar = user?.avatarPicture || null;
      reviewData.isVerified = true;
    } else {
      reviewData.userName = (userName || "").trim() || "Khách";
    }

    await Review.create(reviewData);
    await recalculateProductRating(productId);

    res.status(201).json({ message: "Đánh giá thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
