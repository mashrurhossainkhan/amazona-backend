//const express = require("express");
import express from 'express';
//const expressAsyncHandler = require("express-async-handler");
//const multer = require('multer');
import multer from 'multer';
//const multerS3 = require('multer-s3');
import multerS3 from 'multer-s3';
//const aws = require('aws-sdk');
import aws from 'aws-sdk';
//const config = require('../config.js');
//import config from '../config.js';
//const sharp = require('sharp');
import sharp from 'sharp';

const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

const upload = multer({ storage });
var mainItem;

uploadRouter.post('/', upload.array('image', 30), (req, res) => {
  console.log('I am here1');
  for (let item of req.files) {
    mainItem += `/${item.path},`;
    mainItem = mainItem.replace('public_html/', '');
  }
  res.send(`${mainItem}`);
  mainItem = '';
});

//console.log(config.accessKeyId)
/*
aws.config.update({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
});*/
const s3 = new aws.S3();
const storageS3 = multerS3({
  s3,
  bucket: 'dokanbhai-bucket',
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key(req, file, cb) {
    cb(null, `${Date.now()}` + file.originalname);
  },
});
const uploadS3 = multer({ storage: storageS3 });

const cpUpload = upload.fields([
  { name: 'image', maxCount: 30 },
  { name: 'sellerbannerimg', maxCount: 7 },
  { name: 'sellerLogo', maxCount: 1 },

  { name: 'sellerHomeCat1Img', maxCount: 1 },
  { name: 'sellerHomeCat2Img', maxCount: 1 },
  { name: 'sellerHomeCat3Img', maxCount: 1 },
]);

uploadRouter.post('/s3', cpUpload, (req, res) => {
  if (req.files.image) {
    for (let item of req.files.image) {
      console.log('req.files.image[0].filename' + item.filename);
      mainItem += `/${item.path},`;
      mainItem = mainItem.replace('public_html/', '');
    }
  }
  res.send(`${mainItem}`);
  mainItem = '';
});

export default uploadRouter;
