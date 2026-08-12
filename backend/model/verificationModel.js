import mongoose from "mongoose";
const verificationSchema = new mongoose.Schema(
  {
    phnNo: { type: String, required: true, unique: true },
    OTP: {type: Number},
  },
  {
    timestamps: true,
  }
);
const Verification = mongoose.model('Verification', verificationSchema);
//module.exports = Verification;
export default Verification;
