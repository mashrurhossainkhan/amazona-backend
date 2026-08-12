import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { PaymentSession } from 'ssl-commerz-node';

import Order from '../model/orderModel.js';

import Payment from '../model/payment';
import { generateToken, isAdmin, isAuth } from '../utils.js';

const paymentRouter = express.Router();

paymentRouter.get(
    '/',
    //isAuth,
    expressAsyncHandler(async (req, res) => {
        const userID = req.body._id;
        const orderItems = await Order.find({user: userID})
        
        const tran_id = '_' + Math.random().toString(36).substring(2,9) + (new Date()).getTime();

        const STORE_ID= 'dokan622c47fcdd5c0';
        const STORE_PASSWORD = 'dokan622c47fcdd5c0@ssl';
    
        const payment= new PaymentSession(true, STORE_ID, STORE_PASSWORD);
    
        payment.setUrls({
            success: '/orderhistory',
            fail: '/orderhistory',
            cancel: '/orderhistory',
            ipn: '/orderhistory'
        });
    
        payment.setOrderInfo({
            total_amount: "500",
            currency: "BDT",
            tran_id: tran_id,
            emi_option: 0,
        });
    
        payment.setCusInfo({
            name: "Mashrur",
            email: "Mashrur",
            add1:"Mashrur",
            add2: "Mashrur",
            country: "Bangladesh",
            postcode:"1214",
            state: "dhaka",
            fax: "123",
            city: "Mashrur",
            phone: "Mashrur",
        });
    
        payment.setShippingInfo({
            method: 'Courier',
            num_item: 5,
            name: "Mashrur",
            add1:"Mashrur",
            add2: "Mashrur",
            city: "Mashrur",
            phone: "Mashrur",
            postcode: "1215",
            state: "dhaka",
            country:"Bangladesh"
        });
    
        payment.setProductInfo({
            product_name: 'Dokanbhai',
            product_category: 'General',
            product_profile: 'general'
        });
    
        const response = await payment.paymentInit();
        return res.status(200).send(response);
    })
  );

  paymentRouter.post('/ipn', 
        expressAsyncHandler(async (req, res) => {
            const payment =new Payment(req.body);
            const tran_id = payment['tran_id'];

            if(payment['status'] === 'VALID'){
                const order = await Order.updateOne({transaction_id: tran_id});
            } else{
                await Order.deleteOne({transaction_id: tran_id});
            }
            await payment.save();
            return res.status(200).send("IPN");
        }
  ))


export default paymentRouter;