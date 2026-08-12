import Verification from '../model/verificationModel.js';
import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import request from 'request';
const verificationRouter = express.Router();

verificationRouter.post (
    '/',
    expressAsyncHandler(async(req, res) => {
      //console.log("otp"+ req.body.OTP)
      const verification = new Verification({
        phnNo: req.body.phnNo,
        OTP: req.body.OTP,
      });
  
      const createdVerification = await verification.save();
      //console.log(req.body.phnNo);
      var options = {
        'method': 'POST',
        'url': 'https://api.sms.net.bd/sendsms',
        formData: {
          'api_key': 'Xn82IbU2jgtMoX5E30OQJUFP40G01XcU59Y5wkyN',
          'msg': 'Your OTP for dokanbhai account is '+ req.body.OTP,
          'to': "+88"+req.body.phnNo
        }
      };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    })
      res.send({
        phnNo: createdVerification.phnNo,
        OTP: createdVerification.OTP,
      })
    })
  );

//getting verification code 
verificationRouter.get(
  '/:phnNo',
  expressAsyncHandler(async (req, res) => {
    const verifications = await Verification.find({phnNo: req.params.phnNo});
    res.send(verifications);
  })
);

export default verificationRouter;