//require('dotenv/config');
const app = require('./app');
//express: easy and powerful server
var http = require('http');
var fs = require('fs');

//import https from "https";
//import fs from "fs";
//import express from "express";
//import mongoose from 'mongoose'
const express = require('express');
var productRouter = require('./routers/productRouter.js');
//import productRouter from "./routers/productRouter.js";
var userRouter = require('./routers/userRouter.js');
//import userRouter from "./routers/userRouter.js";
var dotenv = require('dotenv');
//import dotenv from 'dotenv';
var path = require('path');
//import path from 'path';
var orderRouter = require('./routers/orderRouter.js');
//import orderRouter from "./routers/orderRouter.js";
var uploadRouter = require('./routers/uploadRouter.js');
//import uploadRouter from './routers/uploadRouter.js';
//import shopRouter from "./routers/shopRouter.js";
var shopRouter = require('./routers/shopRouter.js');
//import categoryRouter from "./routers/categoryRouter.js";
var categoryRouter = require('./routers/categoryRouter.js');
//import paymentRouter from "./routers/paymentRouter.js";
//import smsGateWayRouter from "./routers/SmsGateWay.js";
var verificationRouter = require('./routers/verificationRouter.js');
//import verificationRouter from "./routers/verificationRouter.js"

const mongoose = require('mongoose');

const DB = 'mongodb://127.0.0.1:27017/dokanbhai';

/*
const options = {
  cert: fs.readFileSync('./Certs/backend_dokanbhai_dokanbhai_com.crt', 'utf8'),
  ca: fs.readFileSync(
    './Certs/backend_dokanbhai_dokanbhai_com.ca-bundle',
    'utf8'
  ),
  key: fs.readFileSync('./Certs/dokanbhai_com.key', 'utf8'),
};
*/
const httpsServer = http.createServer(app);

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb' }));
app.use(express.static('public'));
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('connected'))
  .catch((err) => console.log(err));

app.use('/api/uploads', uploadRouter);
app.use('/api/users', userRouter);
app.use('/api/newshop', shopRouter);
app.use('/api/add/category', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
//app.use('/api/payment', paymentRouter);
app.use('/api/verification', verificationRouter);
//app.use('/api/smsgateway', smsGateWayRouter);
app.get('/api/config/paypal', (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.get('/', (req, res) => {
  res.send('Server is ready');
});

app.use((err, req, res, next) => {
  if (req.protocol == 'http') {
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
  res.status(500).send({ message: err.message });
});

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`listening to post ${port}`);
});
