var express = require('express');
var router = express.Router();
var Message = require('../models/message').voicemessage;
var Chat = require('../models/chat').Chat;
var File = require('../models/file');
let mapper = require('../utils/mapper');
let messageMapper = require('../utils/messagesMapper');
const shortid = require('shortid');
const fs = require('fs');
const { getAudioDurationInSeconds } = require('get-audio-duration');
/* Post Send messages. */

router.post('/v1/sendVoiceMessage',function (req,res,next) {
    let receiverId = `${req.body.receiver_id}`;
    Chat.findOne({
        type: 'private',
        $and:
            [
                {
                    users: {$in: [receiverId]}
                },
                {
                    users: {$in: ["1"]}
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
                            file_duration = duration;
                            console.log(file_duration);
                        });
                        var file = new File({
                            type: 'voice',
                            path: path + filename,
                            size: req.files.voice.size,
                            duration: file_duration
                        });
                        file.save(function (err, file) {
                            var message = new Message({
                                receiver_id: req.body.receiver_id,
                                type: "voice",
                                parse_mode: req.body.parse_mode,
                                reply_to: req.body.reply_to,
                                sender_id: req.body.sender_id,
                                voice: {
                                    file_id: file._id
                                },
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
                                                res.json({
                                                    haserror: false, code: 100, conversation: {
                                                        message_id: message.id,
                                                        type: message.type,
                                                        sender: {
                                                            id: '1dc4d7rf5vv5fvs',
                                                            type: 'user',
                                                            username: 'diaoko89',
                                                            first_name: 'diaoko',
                                                            last_name: 'mahmoodi'
                                                        },
                                                        'voice': {
                                                            file_id: file._id
                                                        }
                                                    }
                                                });
                                            }
                                        });
                                }

                                //chat.messages.push(message._id);
                                //chat.save();
                            });
                            res.status(400).send({haserror: false, code: 100});
                        });

                    }

                });

            });

        }
        else {
            var newchat = new Chat({
                channel_id: "lvndfv34343jn43kn43",
                type: "private",
                messages: [],
                users: ["1", req.body.receiver_id]
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
                                    var file_duration = 0;
                                    getAudioDurationInSeconds(path + filename).then((duration) => {
                                        file_duration = duration;
                                    });
                                    var file = new File({
                                        type: 'voice',
                                        path: path + filename,
                                        size: req.files.voice.size,
                                        duration: file_duration
                                    });
                                    file.save(function (err, file) {
                                        if(err)
                                        {

                                        }
                                        else {
                                            var message = new Message({
                                                receiver_id: req.body.receiver_id,
                                                type: "voice",
                                                parse_mode: req.body.parse_mode,
                                                reply_to: req.body.reply_to,
                                                sender_id: req.body.sender_id,
                                                voice: {
                                                    file_id: file._id
                                                }
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
                                                    res.json({
                                                        haserror: true, code: 100, conversation: {
                                                            message_id: message.id,
                                                            type: message.type,
                                                            sender: {
                                                                id: '1dc4d7rf5vv5fvs',
                                                                type: 'user',
                                                                username: 'diaoko89',
                                                                first_name: 'diaoko',
                                                                last_name: 'mahmoodi'
                                                            },
                                                            'voice': {
                                                                file_id: file._id
                                                            }
                                                        }
                                                    });

                                                }

                                            });
                                        }


                                    });


                                }


                            });

                        });
                    }
                }
            );
        }
    });
});

router.get('/v1/fiesize',function (req,res,next) {
    getAudioDurationInSeconds('./public/upfiles/voice/music.mp3').then((duration) => {
        console.log(Math.round(duration));
    })
});
module.exports = router;
