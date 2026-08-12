import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phnNo: { type: String, required: true, unique: true },
    email: { type: String },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    isSeller: { type: Boolean, required: true },
    verifiedID: { type: Boolean, required: true, default: false, },
    seller: {
      shopName: String,
      ownerName: String,
      ownerAddress: String,
      nidorPassport: String,
      orderInfoContactNo: String, //order er jonno jei number a contact kora hobe
      smsToNumber: String,
      mobileBankingTransaction: String,
      bankAccName: String,
      bankAccNo: String,

      logo: String,
      description: String,
      rating: { type: Number, default: 0 },
      numReviews: { type: Number, default: 0},
      nid: String,
      shopAddress: String,
      marketName: String, //example: Bashundhara City
      block: String,//Block: D
      floorNo: String,
      shopNumber: String,
      shopType: String,
      sellerbannerimg:String,//image string of seller banner
      pre10percent: Boolean, 
      sellerHomeCat1: String,
      sellerHomeCat1Img: String,
      sellerHomeCat2:  String,
      sellerHomeCat2Img: String,
      sellerHomeCat3: String,
      sellerHomeCat3Img: String,

      voucher_name1: String,
      voucher_for_money1: String,
      vouchar_discount1: String,

      voucher_name2: String,
      voucher_for_money2: String,
      vouchar_discount2: String,

      voucher_name3: String,
      voucher_for_money3: String,
      vouchar_discount3: String,

      voucher_name4: String,
      voucher_for_money4: String,
      vouchar_discount4: String,

      voucher_name5: String,
      voucher_for_money5: String,
      vouchar_discount5: String,

      facebookLink: String,
      youtubeLink: String, 
      tiktokLink: String,
     
      liveLink : {
        link: [String],
        name: [String],
      },
        
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model('User', userSchema);
//module.exports = User;
export default User;

