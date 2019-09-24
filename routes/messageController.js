var express = require('express');
var router = express.Router();
var Message = require('../models/message');
var Chat = require('../models/chat');
var File = require('../models/file');
var User = require('../models/user');
const auth = require('../middleware/auth');
let mapper = require('../utils/mapper');
let messageViewMapper = require('../utils/viewMapper/SendVoiceMessageResponseMapper');
const shortid = require('shortid');
const fs = require('fs');
const readChunk = require('read-chunk');
const fileType = require('file-type');


const { getAudioDurationInSeconds } = require('get-audio-duration');
/* Post Send messages. */
/**
 * End Point = /v1/sendVoiceMessage
 * Method = POST
 * Parameters :
 *             receiver_id(required)
 *             sender_id(required|)
 *             parse_mode(optional|string)
 *             reply_to(optional|string)
 *             voice(required|file)
 *
 * Response :
 * {
    "haserror": false,
    "code": 100,
    "conversation": {
        "message_id": "5d6bc1d17a036243b00592a2",
        "type": "text_message",
        "sender": {
            "id": "1dc4d7rf5vv5fvs",
            "type": "user",
            "username": "diaoko89",
            "first_name": "diaoko",
            "last_name": "mahmoodi"
        },
        "text_message": {
            "text": "hello"
        }
    }
}
 *
 */
router.post('/v1/sendVoiceMessage',auth,function (req,res,next) {
    if(req.body.receiver_id==null || req.body.reply_to==null)
    {


    }
    let receiverId = `${req.body.receiver_id}`;
    let senderId = `${req.user._id}`;
    if(receiverId.match(/^[0-9a-fA-F]{24}$/))
    {
        Chat.findOne({ _id:  receiverId },function (err,chat) {
            if(err)
            {
                console.log(err);
            }
            else if(chat)
            {
                let voice = req.files.voice;
                let filename = (Math.floor(new Date() / 1000)) + '_' + shortid.generate() + '_' + voice.name;
                const path = './public/upfiles/voice/';

                fs.access(path + filename, fs.F_OK, (err) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('file exist');
                    }
                    // file exists
                    voice.mv(path + filename, function (err) {
                        if (err)
                            return res.status(500).send(err);
                        else {
                            var file_duration = 0;
                            getAudioDurationInSeconds(path + filename).then((duration) => {
                                const buffer = readChunk.sync(path+filename, 0, fileType.minimumBytes);

                                let mimeType = fileType(buffer);
                                file_duration = Math.round(duration);
                                let file = new File({
                                    type: 'voice',
                                    ext : mimeType.ext,
                                    mime_type : mimeType.mime,
                                    path: path + filename,
                                    size: req.files.voice.size,
                                    duration: file_duration
                                });
                                file.save(function (err, file) {
                                    let message = new Message({
                                        receiver_id: req.body.receiver_id,
                                        type: "voice_message",
                                        parse_mode: req.body.parse_mode,
                                        reply_to: req.body.reply_to,
                                        sender_id: req.user._id,
                                        file: file._id

                                    });
                                    message.save(function (err) {
                                        if (err) {
                                            console.log('error1');
                                            res.json({haserror: true, code: 0});
                                        }
                                        else {
                                            let message_id = [message._id];
                                            Chat.findOneAndUpdate(
                                                {_id: chat._id},
                                                {$push: {messages: message_id}},
                                                function (error, success) {
                                                    if (error) {
                                                        console.log('error.........');
                                                        res.json({haserror: true, code: 1});

                                                    } else {
                                                        console.log('saved........exist');
                                                        res.json(messageViewMapper.success(message,req,file));

                                                    }
                                                });
                                        }

                                    });

                                });
                            });

                        }

                    });

                });
            }
            else
            {
                res.json({haserror:true,code:4,msg:'chat not found'});
            }
        });
    }
    else
    {
        User.findOne({id:receiverId},function(err,user) {
            if (err) {

            }
            if(user)
            {
                receiverId = user._id;
                Chat.findOne({
                    type: 'private',
                    $and:
                        [
                            {
                                users: {$in: [receiverId]}
                            },
                            {
                                users: {$in: [senderId]}
                            }
                        ]
                }, function (err, chat) {
                    console.log(chat);
                    console.log(err);
                    if (chat !== null) {

                        let voice = req.files.voice;
                        let filename = (Math.floor(new Date() / 1000)) + '_' + shortid.generate() + '_' + voice.name;
                        const path = './public/upfiles/voice/';

                        fs.access(path + filename, fs.F_OK, (err) => {
                            if (err) {

                            }
                            else {
                                console.log('file exist');
                            }
                            // file exists
                            voice.mv(path + filename, function (err) {
                                if (err)
                                    return res.status(500).send(err);
                                else {
                                    var file_duration = 0;
                                    getAudioDurationInSeconds(path + filename).then((duration) => {
                                        const buffer = readChunk.sync(path+filename, 0, fileType.minimumBytes);

                                        let mimeType = fileType(buffer);
                                        file_duration = Math.round(duration);
                                        let file = new File({
                                            type: 'voice',
                                            ext : mimeType.ext,
                                            mime_type : mimeType.mime,
                                            path: path + filename,
                                            size: req.files.voice.size,
                                            duration: file_duration
                                        });
                                        file.save(function (err, file) {
                                            let message = new Message({
                                                receiver_id: req.body.receiver_id,
                                                type: "voice_message",
                                                parse_mode: req.body.parse_mode,
                                                reply_to: req.body.reply_to,
                                                sender_id: req.user._id,
                                                file: file._id

                                            });
                                            message.save(function (err) {
                                                if (err) {
                                                    console.log('error1');
                                                    res.json({haserror: true, code: 0});
                                                }
                                                else {
                                                    let message_id = [message._id];
                                                    Chat.findOneAndUpdate(
                                                        {_id: chat._id},
                                                        {$push: {messages: message_id}},
                                                        function (error, success) {
                                                            if (error) {
                                                                console.log('error.........');
                                                                res.json({haserror: true, code: 1});

                                                            } else {
                                                                console.log('saved........exist');
                                                                res.json(messageViewMapper.success(message,req,file));

                                                            }
                                                        });
                                                }

                                                //chat.messages.push(message._id);
                                                //chat.save();
                                            });
                                            //res.status(400).send({haserror: false, code: 100});
                                        });
                                    });

                                }

                            });

                        });

                    }
                    else {
                        let newchat = new Chat({
                            channel_id: "lvndfv34343jn43kn43",
                            type: "private",
                            messages: [],
                            users: [senderId, receiverId]
                        });

                        newchat.save(function (err) {
                                if (err) {
                                    console.log("error 2")
                                }
                                else {
                                    let voice = req.files.voice;
                                    let filename = (Math.floor(new Date() / 1000)) + '_' + shortid.generate() + '_' + voice.name;
                                    const path = './public/upfiles/voice/';

                                    fs.access(path + filename, fs.F_OK, (err) => {
                                        if (err) {

                                        }
                                        else {
                                            console.log('file exist');
                                        }
                                        // file exists
                                        voice.mv(path + filename, function (err) {
                                            if (err)
                                                return res.status(500).send(err);
                                            else {
                                                let file_duration = 0;
                                                getAudioDurationInSeconds(path + filename).then((duration) => {
                                                    file_duration = Math.round(duration);

                                                    let file = new File({
                                                        type: 'voice',
                                                        path: path + filename,
                                                        size: req.files.voice.size,
                                                        duration: file_duration
                                                    });
                                                    file.save(function (err, file) {
                                                        if (err) {

                                                        }
                                                        else {
                                                            let message = new Message({
                                                                receiver_id: req.body.receiver_id,
                                                                type: "voice_message",
                                                                parse_mode: req.body.parse_mode,
                                                                reply_to: req.body.reply_to,
                                                                sender_id: req.user._id,
                                                                file: file._id

                                                            });
                                                            message.save(function (err) {
                                                                if (err) {
                                                                    console.log('error1');
                                                                    res.json({haserror: true, code: 0});
                                                                }
                                                                else {

                                                                    newchat.messages.push(message._id);
                                                                    newchat.save();
                                                                    console.log('saved......2');
                                                                    res.json(messageViewMapper.success(message,req,file));
                                                                }
                                                            });
                                                        }
                                                    });
                                                });
                                            }
                                        });
                                    });
                                }
                            }
                        );
                    }
                });
            }
            else
            {
                res.json({haserror:true,code:4,msg:'receiver not found'});
            }
        });
    }




});

module.exports = router;
