//entry point of our backend application
//create a basic express server
//express: easy and powerful server
import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import productRouter from './routers/productRouter.js';
import userRouter from './routers/userRouter.js';
import dotenv from 'dotenv';
import path from 'path';
import orderRouter from './routers/orderRouter.js';
import uploadRouter from './routers/uploadRouter.js';
import shopRouter from './routers/shopRouter.js';
import categoryRouter from './routers/categoryRouter.js';
//import paymentRouter from "./routers/paymentRouter.js";
import smsGateWayRouter from './routers/SmsGateWay.js';
import verificationRouter from './routers/verificationRouter.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());

const httpsServer = http.createServer(app);

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb' }));
app.use(express.static('public'));

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: 'true',
});

/*app.get('/', (req, res) => {
    res.send("server is ready");
});*/

export default {
  accessKeyId: process.env.accessKeyId || 'accessKeyId',
  secretAccessKey: process.env.secretAccessKey || 'secretAccessKey',
};

app.use('/api/uploads', uploadRouter);
app.use('/api/users', userRouter);
app.use('/api/newshop', shopRouter);
app.use('/api/add/category', categoryRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
//app.use('/api/payment', paymentRouter);
app.use('/api/verification', verificationRouter);
app.use('/api/smsgateway', smsGateWayRouter);
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

httpsServer.listen(port, () => {
  console.log(`serve at http://localhost:${port}`);
});
