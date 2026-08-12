import express from "express";
import expressAsyncHandler from "express-async-handler";
import Category from "../model/categoryModel.js";

const categoryRouter = express.Router();

categoryRouter.post (
    '/',
    expressAsyncHandler(async(req, res) => {
      const category = new Category({
        name: req.body.name,
        subCategory: req.body.subCategory,
        subCategory1: req.body.subCategory1
      });
  
      const createdCategory = await category.save();
      res.send({
        name: createdCategory.name,
        subCategory: createdCategory.subCategory,
        subCategory1: createdCategory.subCategory1
      })
    })
  );

  //getting category
  categoryRouter.get(
    '/',
    expressAsyncHandler(async (req, res) => {
      const category = await Category.distinct('name');
      res.send(category);
    })
  );

  //getting sub category
  categoryRouter.get(
    '/subcat/:category',
    expressAsyncHandler(async (req, res) => {
      const SubCategory = await Category.find({name: req.params.category}).distinct('subCategory');
      res.send(SubCategory);
    })
  );

  //getting sub category 1
  categoryRouter.get(
    '/subcat1/:subcategory',
    expressAsyncHandler(async (req, res) => {
      const SubCategory = await Category.find({subCategory: req.params.subcategory}).distinct('subCategory1');
      res.send(SubCategory);
    })
  );

  export default categoryRouter;