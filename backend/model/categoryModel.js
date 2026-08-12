import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    subCategory: {type: String},
    subCategory1: {type: String}
  },
  {
    timestamps: true,
  }
);
const Category = mongoose.model('CategoryName', categorySchema);
export default Category;