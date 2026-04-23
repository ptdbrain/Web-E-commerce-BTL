import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    storeId: {
      type: String,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      trim: true,
      index: true,
    },

    description: {
      type: String,
    },

    price: {
      type: Number,
      required: true,
    },

    discountPrice: {
      type: Number,
    },

    stock: {
      type: Number,
      required: true,
    },

    soldCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    itemType: {
      type: String,
      enum: ["single", "combo", "drink", "side", "dessert"],
      default: "single",
    },

    preparationTime: {
      type: Number,
      default: 15,
    },

    spiceLevel: {
      type: String,
      default: "",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    images: [
      {
        type: String,
      },
    ],

    sizes: [
      {
        label: { type: String, required: true },
        priceModifier: { type: Number, default: 0 },
        isDefault: { type: Boolean, default: false },
      },
    ],

    addons: [
      {
        label: { type: String, required: true },
        price: { type: Number, default: 0 },
        maxQuantity: { type: Number, default: 1 },
        isAvailable: { type: Boolean, default: true },
      },
    ],

    comboItems: [
      {
        type: String,
      },
    ],

    badges: [
      {
        type: String,
      },
    ],

    highlights: [
      {
        type: String,
      },
    ],

    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    isNew: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ name: "text", description: "text" });
ProductSchema.index({ slug: "text" });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ soldCount: -1 });

export default mongoose.model("Product", ProductSchema);
