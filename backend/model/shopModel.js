import mongoose from "mongoose";
const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    floorNum: {type: String}
  },
  {
    timestamps: true,
  }
);
const Shop = mongoose.model('ShopName', shopSchema);
//module.exports = Shop;
export default Shop;
