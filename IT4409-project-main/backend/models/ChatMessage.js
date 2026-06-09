import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    isReadByAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", ChatMessageSchema);
