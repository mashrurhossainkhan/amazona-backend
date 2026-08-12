//is not using

const  PaymentSession = require('ssl-commerz-node').PaymentSession;
const {Order} = require('../model/orderModel');

module.exports.initPayment = async(req, res) => {
    const userID = req.body._id;
    const orderItems = await Order.find({user: userID})
    
    const tran_id = '_' + Math.random().toString(36).substring(2,9) + (new Date()).getTime();

    const payment= new PaymentSession(true, process.env.STORE_ID, process.env.STORE_PASSWORD);

    payment.setUrls({
        success: '/orderhistory',
        fail: '/orderhistory',
        cancel: '/orderhistory',
        ipn: '/orderhistory'
    });

    payment.setOrderInfo({
        total_amount: orderItems.totalPrice,
        currency: "BDT",
        tran_id: tran_id,
        emi_option: 0,
    });

    payment.setCusInfo({
        name: orderItems.user.name,
        email: orderItems.user.email,
        add1: orderItems.shippingAddress.address,
        add2: orderItems.shippingAddress.address,
        city: orderItems.shippingAddress.city,
        phone: orderItems.shippingAddress.phnNo
    });

    payment.setShippingInfo({
        method: 'Courier',
        num_item: orderItems.orderItems.length(),
        name: orderItems.shippingAddress.fullName,
        add1: orderItems.shippingAddress.address,
        add2: orderItems.shippingAddress.address,
        city: orderItems.shippingAddress.city,
        phone: orderItems.shippingAddress.phnNo
    });

    payment.setProductInfo({
        product_name: 'Dokanbhai',
        product_category: 'General',
        product_profile: 'general'
    });

    response = await payment.paymentInit();
    return res.status(200).send(response);
}