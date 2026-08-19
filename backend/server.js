//entry point of our backend application
//create a basic express server
//express: easy and powerful server
import express from 'express';
import mongoose from 'mongoose';
import productRouter from './routers/productRouter.js';
import userRouter from './routers/userRouter.js';
import dotenv from 'dotenv';
import path from 'path';
import orderRouter from './routers/orderRouter.js';
import shopRouter from './routers/shopRouter.js';
import categoryRouter from './routers/categoryRouter.js';
//import paymentRouter from "./routers/paymentRouter.js";
import smsGateWayRouter from './routers/SmsGateWay.js';
import verificationRouter from './routers/verificationRouter.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json({ limit: '4mb' }));
app.use(express.urlencoded({ extended: true, limit: '4mb' }));
app.use(express.static('public'));

if (!process.env.MONGODB_URL) {
  console.error('MONGODB_URL is not configured');
} else {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection failed:', error.message));
}

/*app.get('/', (req, res) => {
    res.send("server is ready");
});*/

app.use('/api/uploads', async (req, res, next) => {
  try {
    const { default: uploadRouter } = await import('./routers/uploadRouter.js');
    uploadRouter(req, res, next);
  } catch (error) {
    next(error);
  }
});
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
  console.error(err);
  if (res.headersSent) {
    next(err);
    return;
  }
  res.status(err.status || 500).send({ message: err.message || 'Server error' });
});

const port = process.env.PORT || 5001;

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`serve at http://localhost:${port}`);
  });
}

export default app;
