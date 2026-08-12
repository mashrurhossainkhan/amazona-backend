import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      comment: { type: String, required: true },
      rating: { type: Number, required: true },
    },
    {
      timestamps: true,
    }
  );

const productSchema = new mongoose.Schema(
    {
        name: {type: String},
        seqNo: {type: Number},
        seller: { type: mongoose.Schema.Types.ObjectID, ref: 'User' },
        image: {type: String},
        category: {type: String},
        brand: {type: String},
        description: {type: String},
        price: {type: Number},

        productIdMain: {type: String},        
        warenteeDays: {type: String},
        returnDays: {type: String},
        preTenPercent: {type: Boolean},

        sub_category: {type: String},
        sub_category1: {type: String},
        flash_sale: {type: Boolean},
        discounted_price: {type: String},
        material: {type: String},
        size: {type: String},
        weight: {type: String},
        color: {type: String},
        fabric: {type: String},
        product_length: {type: String},
        width: {type: String},
        published: {type: Boolean},

        countInStock: {type: Number},
        rating: {type: Number, required: true},
        numReviews: {type: Number, required: true},
        reviews: [reviewSchema],
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
