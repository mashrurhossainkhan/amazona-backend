import express from "express";
import expressAsyncHandler from "express-async-handler";
import Shop from "../model/shopModel.js";

const shopRouter = express.Router();

shopRouter.post (
    '/',
    expressAsyncHandler(async(req, res) => {
      const shop = new Shop({
        name: req.body.name,
        floorNum: req.body.floorNum,
      });
  
      const createdShop = await shop.save();
      res.send({
        name: createdShop.name,
        floorNum: createdShop.floorNum,     
      })
    })
  );

  shopRouter.get(
    '/',
    expressAsyncHandler(async (req, res) => {
      const shops = await Shop.find();
      res.send(shops);
    })
  );

  export default shopRouter;