import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: { type: Number, required: true },
    tags: [String],
    imageUrl: {
      type: String,
      default: "https://placehold.co/600x400?text=Florio+Flower",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
