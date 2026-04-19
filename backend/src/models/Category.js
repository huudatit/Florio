import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Category", categorySchema);
