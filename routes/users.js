var express = require('express');
var router = express.Router();
let request = require('request');
let User = require('../models/user');
/* GET users listing. */
router.post('/v1/User/RequestOTP', function(req, res, next) {


    let options = {
        url: 'https://auth.kubakbank.com/v1/RequestOTP',
        method: 'POST',
        json : true,
        form: {
            mobile: req.body.mobile,
        }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log("---------------->"+body.code);
            res.send(body);
            console.log(body);
        }
        else {
            res.send({haserror:true,code:0,msg : 'error'});
            console.log(error);
        }
    }

    request(options, callback);
});
router.post('/v1/User/Login',function (req,res,next) {
    let options = {
        url: 'https://auth.kubakbank.com/v1/Login',
        method: 'POST',
        json : true,
        form: {
            mobile: req.body.mobile,
            otp: req.body.otp
        }
    };

    function callback(error, response, body) {
        if (!error && response.statusCode === 200) {
            if(body.code===100)
            {
                let user =new User({
                    id : body.gate,
                    first_name : '',
                    last_name : '',
                    username : '',
                    token : body.token,
                    refresh : body.refresh,
                    expireTime: body.expire_at,
                    push_token : ''
                });
                user.save();
            }
            res.send(body);
            console.log(body);
        }
        else {
            res.send({haserror:true,code:0,msg : 'error'});
            console.log(error);
        }
    }

    request(options, callback);
});
router.post('/v1/user/updateProfile',function (req,res) {
   //console.log(req.headers.token);
    User.findOneAndUpdate({token : req.headers.token}, {first_name :req.body.first_name,last_name: req.body.last_name}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
            res.json({haserror:true,code:0,msg: 'profile not updated'})
        }
        else {
            res.json({haserror:false,code:100,msg:'profile updated'});
            console.log(doc);
        }

    });
});
module.exports = router;
