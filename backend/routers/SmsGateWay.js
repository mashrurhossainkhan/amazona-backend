import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import request from 'request';

const smsGateWayRouter = express.Router();

smsGateWayRouter.post(
  '/forgetpassword/:phnNo',
  expressAsyncHandler(async (req, res) => {
    var verification_id = Math.floor(1000 + Math.random() * 9000);
    //console.log('req.params.phnNo' + req.params.phnNo);
    var options = {
      method: 'POST',
      url: 'https://api.sms.net.bd/sendsms',
      formData: {
        api_key: '5Cwe9ip6BR62FvawH0a7J3hOA6qFnQ1PDFHFbJPB',
        msg: 'Verification code of Amazona: ' + verification_id,
        to: req.params.phnNo,
      },
    };

    request(options, function (error, response) {
      if (error) throw new Error(error);
      console.log(response.body);
      res.send({
        theVerificationCode: verification_id,
      });
    });
  })
);

export default smsGateWayRouter;
