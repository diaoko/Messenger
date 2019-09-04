var express = require('express');
var router = express.Router();
let request = require('request');
let User = require('../models/user');
let File = require('../models/file');
const readChunk = require('read-chunk');
const fileType = require('file-type');
const shortid = require('shortid');
const auth = require('../middleware/auth');
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
                User.findOneAndUpdate({'id': body.gate },{token : body.token,refresh : body.refresh,expireTime: body.expire_at},{ upsert: true, new: true, setDefaultsOnInsert: true },function (error,user) {
                    if(error)
                    {

                    }
                    else
                    {
                        console.log("****"+user);
                        res.json({
                            haserror: false,
                            code:100,
                            user:{
                                id : user._id,
                                first_name: user.first_name,
                                last_name: user.last_name,
                                username: user.username,
                                token: user.token,
                                refresh: user.refresh,
                                expireTime: user.expireTime,
                                avatars: user.avatars,
                            }
                        });
                    }
                });

            }
            else {
                res.json({haserror:true,code:body.code,msg: 'error'})
            }

            console.log(body);
        }
        else {
            res.send({haserror:true,code:0,msg : 'error'});
            console.log(error);
        }
    }

    request(options, callback);
});
router.post('/v1/user/updateProfile',auth,function (req,res) {
   //console.log(req.headers.token);
    let file_id;

    if(req.files)
    {
        let avatar = req.files.avatar;
        let filename = (Math.floor(new Date() / 1000)) + '_' + shortid.generate() + '_' + avatar.name;
        const path = './public/upfiles/users/avatar/';
        avatar.mv(path + filename, function (err) {
            if (err)
                return res.status(500).send(err);
            else {
                const buffer = readChunk.sync(path+filename, 0, fileType.minimumBytes);
                let mimeType = fileType(buffer);
                file = new File({
                    type: 'avatar',
                    ext : mimeType.ext,
                    mime_type : mimeType.mime,
                    path: path + filename,
                    size: avatar.size,
                });
                file.save(function (err, file) {
                    if (err) {

                    }
                    else {
                        file_id=file._id
                    }
                })
            }
        });

    }

        if(file_id)
        {
            User.findOneAndUpdate({token : req.Authorization}, {$push:{avatars:file_id},$set:{first_name :req.body.first_name,last_name: req.body.last_name}}, (err, doc) => {
                if (err) {
                    console.log("Something wrong when updating data!");
                    res.json({haserror:true,code:0,msg: 'profile not updated'})
                }
                else {
                    res.json({haserror:false,code:100,msg:'profile updated'});
                    console.log(doc);
                }

            });
        }
        else
        {
            User.findOneAndUpdate({token : req.Authorization}, {$set:{first_name :req.body.first_name,last_name: req.body.last_name}}, (err, doc) => {
                if (err) {
                    console.log("Something wrong when updating data!");
                    res.json({haserror:true,code:0,msg: 'profile not updated'})
                }
                else {

                    res.json({haserror:false,code:100,msg:'profile updated'});
                    console.log(doc);
                }

            });
        }


});
module.exports = router;
