import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import crypto from 'crypto';
import Order from '../model/orderModel.js';
import { isAdmin, isAuth, isSellerOrAdmin, optionalAuth } from '../utils.js';

const orderRouter = express.Router();

orderRouter.get(
  '/',
  isAuth,
  isSellerOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const seller = req.query.seller || '';
    const sellerFilter = seller ? { seller } : {};

    /*const orders = await Order.find({ ...sellerFilter }).populate(
      'user',
      'name'
    );*/

    const orders = await Order.find().populate(
      'user',
      'name'
    );
    res.send(orders);
  })
);

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

orderRouter.post(
  '/',
  optionalAuth,
  expressAsyncHandler(async (req, res) => {
    if (req.body.orderItems.length === 0) {
      res.status(400).send({ message: 'Cart is empty' });
    } else {
   
      const guestAccessKey = req.user
        ? undefined
        : crypto.randomBytes(24).toString('hex');
      const order = new Order({
        seller: req.body.orderItems[0].seller,
        orderItems: req.body.orderItems,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user?._id,
        guestAccessKey,
      });
      const createdOrder = await order.save();
      res
        .status(201)
        .send({ message: 'New Order Created', order: createdOrder, guestAccessKey });
    }
  })
);

orderRouter.get(
    '/:id',
    optionalAuth,
    expressAsyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id).select('+guestAccessKey');
      if (order) {
        const isGuestOrder = !order.user;
        const hasGuestAccess =
          isGuestOrder &&
          req.query.guestAccessKey &&
          req.query.guestAccessKey === order.guestAccessKey;

        if (!req.user && !hasGuestAccess) {
          res.status(401).send({ message: 'Order access link is missing or invalid' });
          return;
        }

        const safeOrder = order.toObject();
        delete safeOrder.guestAccessKey;
        res.send(safeOrder);
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    })
  );

  orderRouter.put(
    '/:id/pay',
    isAuth,
    expressAsyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id);
      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_time,
          email_address: req.body.email_address,
        };
        const updatedOrder = await order.save();
        res.send({ message: 'Order Paid', order: updatedOrder });
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    })
  );

  orderRouter.delete(
    '/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id);
      if (order) {
        const deleteOrder = await order.remove();
        res.send({ message: 'Order Deleted', order: deleteOrder });
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    })
  );

  orderRouter.put(
    '/:id/deliver',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id);
      if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
  
        const updatedOrder = await order.save();
        res.send({ message: 'Order Delivered', order: updatedOrder });
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    })
  );
export default orderRouter;
