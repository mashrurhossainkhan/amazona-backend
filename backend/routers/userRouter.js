import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import User from '../model/userModel.js';
import bcrypt from 'bcryptjs';
import { generateToken, isAdmin, isAuth } from '../utils.js';

const userRouter = express.Router();

userRouter.get(
  '/top-sellers',
  expressAsyncHandler(async (req, res) => {
    const topSellers = await User.find({ isSeller: true })
      .sort({ 'seller.rating': -1 })
      .limit(5);
    res.send(topSellers);
  })
);

/*find all hello mall shop starts*/
userRouter.get(
  '/all-hellomall',
  expressAsyncHandler(async (req, res) => {
    const allSellers = await User.find({
      'seller.shopType': 'Hello Mall Agent',
    }).sort({ 'seller.rating': -1 });
    res.send(allSellers);
  })
);
/*find all hello shop ends*/

/*find exist user with phnno starts*/
userRouter.get(
  '/exist_user_with_phn_num/:phnNo',
  expressAsyncHandler(async (req, res) => {
    const phnNo = req.params.phnNo;
    const existUserWithPhnNo = await User.findOne({ phnNo: phnNo });
    res.send({ id: existUserWithPhnNo._id, phnNo: existUserWithPhnNo.phnNo });
  })
);
/*find exist user with phnno ends*/

userRouter.get(
  '/all-sellers',
  expressAsyncHandler(async (req, res) => {
    const allSellers = await User.find(
      { isSeller: true },
      { seller: 1, _id: 1 }
    ).sort({ 'seller.rating': -1 });
    res.send(allSellers);
  })
);

/*find all wholesale shop starts*/
userRouter.get(
  '/all-wholesale',
  expressAsyncHandler(async (req, res) => {
    const allSellers = await User.find({
      'seller.shopType': 'WholeSale Shop Owner',
    }).sort({ 'seller.rating': -1 });
    res.send(allSellers);
  })
);
/*find all wholesale shop ends*/

userRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    //await User.remove({});
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const credential = String(req.body.credential || req.body.phnNo || '').trim();
    const escapedCredential = credential.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const user = credential.includes('@')
      ? await User.findOne({
          email: { $regex: `^${escapedCredential}$`, $options: 'i' },
        })
      : await User.findOne({ phnNo: credential.replace(/\s+/g, '') });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          phnNo: user.phnNo,
          isAdmin: user.isAdmin,
          isSeller: user.isSeller,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email/phone number or password' });
  })
);

userRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phnNo: req.body.phnNo,
      isSeller: req.body.isSeller,
      verified: false,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    const createdUser = await user.save();
    res.send({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      phnNo: createdUser.phnNo,
      isAdmin: createdUser.isAdmin,
      isSeller: createdUser.isSeller,
      verified: false,
      token: generateToken(createdUser),
    });
  })
);

userRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/verifyuser',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.verifiedID = true || user.verifiedID;
      const updatedUserVerification = await user.save();
      res.send({
        _id: updatedUserVerification._id,
        verifiedID: updatedUserVerification.verifiedID,
      });
    }
  })
);

userRouter.put(
  '/newpassword/:phnNo',
  expressAsyncHandler(async (req, res) => {
    // console.log("req.params.phnNo"+ req.params.phnNo);
    const user = await User.findOneAndUpdate(
      { phnNo: req.params.phnNo },
      { password: bcrypt.hashSync(req.body.password, 8) }
    );

    if (user) {
      res.send({ message: 'User Updated' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phnNo = req.body.phnNo || user.phnNo;
      user.verified = req.body.verified || user.verified;
      if (user.isSeller) {
        //console.log(req.body.categoryLink)
        //console.log(req.body.pre10percent)

        if (req.body.pre10percent == false) {
          //console.log(req.body.pre10percent)

          user.seller.pre10percent = false || user.seller.pre10percent;
        } else {
          user.seller.pre10percent = true || user.seller.pre10percent;
        }

        user.seller.ownerName = req.body.ownerName || user.seller.ownerName; //added
        user.seller.nidorPassport =
          req.body.nidorPassport || user.seller.nidorPassport;
        user.seller.ownerAddress =
          req.body.ownerAddress || user.seller.ownerAddress;
        user.seller.orderInfoContactNo =
          req.body.orderInfoContactNo || user.seller.orderInfoContactNo;
        user.seller.smsToNumber =
          req.body.smsToNumber || user.seller.smsToNumber;
        user.seller.mobileBankingTransaction =
          req.body.mobileBankingTransaction ||
          user.seller.mobileBankingTransaction;
        user.seller.bankAccName =
          req.body.bankAccName || user.seller.bankAccName;
        user.seller.bankAccNo = req.body.bankAccNo || user.seller.bankAccNo;

        user.seller.facebookLink =
          req.body.facebookLink || user.seller.facebookLink;
        user.seller.youtubeLink =
          req.body.youtubeLink || user.seller.youtubeLink;
        user.seller.tiktokLink = req.body.tiktokLink || user.seller.tiktokLink;

        user.seller.shopName = req.body.shopName || user.seller.shopName;
        user.seller.logo = req.body.sellerLogo || user.seller.logo;
        user.seller.description =
          req.body.sellerDescription || user.seller.description;
        user.seller.shopAddress =
          req.body.shopAddress || user.seller.shopAddress;
        user.seller.marketName = req.body.marketName || user.seller.marketName;
        user.seller.nid = req.body.nid || user.seller.nid;
        user.seller.block = req.body.block || user.seller.block;
        user.seller.floorNo = req.body.floorNo || user.seller.floorNo;
        user.seller.shopNumber = req.body.shopNumber || user.seller.shopNumber;
        user.seller.shopType = req.body.shopType || user.seller.shopType;

        if (req.body.sellerbannerimg && user.seller.sellerbannerimg) {
          user.seller.sellerbannerimg =
            req.body.sellerbannerimg.concat(user.seller.sellerbannerimg) ||
            user.seller.sellerbannerimg; //seller banner image location insertion in amazon S3
        } else {
          user.seller.sellerbannerimg =
            req.body.sellerbannerimg || user.seller.sellerbannerimg; //seller banner image location insertion in amazon S3
        }
        //
        user.seller.logo = req.body.sellerLogo || user.seller.logo;

        user.seller.sellerHomeCat1 =
          req.body.sellerHomeCat1 || user.seller.sellerHomeCat1;
        user.seller.sellerHomeCat2 =
          req.body.sellerHomeCat2 || user.seller.sellerHomeCat2;
        user.seller.sellerHomeCat3 =
          req.body.sellerHomeCat3 || user.seller.sellerHomeCat3;

        user.seller.sellerHomeCat1Img =
          req.body.sellerHomeCat1Img || user.seller.sellerHomeCat1Img;
        user.seller.sellerHomeCat2Img =
          req.body.sellerHomeCat2Img || user.seller.sellerHomeCat2Img;
        user.seller.sellerHomeCat3Img =
          req.body.sellerHomeCat3Img || user.seller.sellerHomeCat3Img;

        user.seller.voucher_name1 =
          req.body.voucher_name1 || user.seller.voucher_name1;
        user.seller.voucher_for_money1 =
          req.body.voucher_for_money1 || user.seller.voucher_for_money1;
        user.seller.vouchar_discount1 =
          req.body.vouchar_discount1 || user.seller.vouchar_discount1;

        user.seller.voucher_name2 =
          req.body.voucher_name2 || user.seller.voucher_name2;
        user.seller.voucher_for_money2 =
          req.body.voucher_for_money2 || user.seller.voucher_for_money2;
        user.seller.vouchar_discount2 =
          req.body.vouchar_discount2 || user.seller.vouchar_discount2;

        user.seller.voucher_name3 =
          req.body.voucher_name3 || user.seller.voucher_name3;
        user.seller.voucher_for_money3 =
          req.body.voucher_for_money3 || user.seller.voucher_for_money3;
        user.seller.vouchar_discount3 =
          req.body.vouchar_discount3 || user.seller.vouchar_discount3;

        user.seller.voucher_name4 =
          req.body.voucher_name4 || user.seller.voucher_name4;
        user.seller.voucher_for_money4 =
          req.body.voucher_for_money4 || user.seller.voucher_for_money4;
        user.seller.vouchar_discount4 =
          req.body.vouchar_discount4 || user.seller.vouchar_discount4;

        user.seller.voucher_name5 =
          req.body.voucher_name5 || user.seller.voucher_name5;
        user.seller.voucher_for_money5 =
          req.body.voucher_for_money5 || user.seller.voucher_for_money5;
        user.seller.vouchar_discount5 =
          req.body.vouchar_discount5 || user.seller.vouchar_discount5;

        if (req.body.link != null) {
          //check if concating is jhamela
          user.seller.liveLink.link =
            user.seller.liveLink.link.concat(req.body.link) ||
            user.seller.liveLink.link;
          user.seller.liveLink.name =
            user.seller.liveLink.name.concat(req.body.liveName) ||
            user.seller.liveLink.name;
        }
      }
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        isSeller: user.isSeller,
        token: generateToken(updatedUser),
      });
    }
  })
);

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' });
        return;
      }
      const deleteUser = await user.remove();
      res.send({ message: 'User Deleted', user: deleteUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isSeller = Boolean(req.body.isSeller);
      user.isAdmin = Boolean(req.body.isAdmin);
      // user.isAdmin = req.body.isAdmin || user.isAdmin;
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

export default userRouter;
