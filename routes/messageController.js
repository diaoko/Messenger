var express = require('express');
var router = express.Router();
var Message = require('../models/message');
var Chat = require('../models/chat');
var File = require('../models/file');
var User = require('../models/user');
const auth = require('../middleware/auth');
let mapper = require('../utils/mapper');
let pushManager = require('../library/PushManager');
let voiceMessageViewMapper = require('../utils/viewMapper/SendVoiceMessageResponseMapper');
const shortid = require('shortid');
const fs = require('fs');
const readChunk = require('read-chunk');
const fileType = require('file-type');
let messageMapper = require('../utils/messagesMapper');
let textMessageViewMapper = require('../utils/viewMapper/SendTextMessageResponseMapper');
const { check, validationResult } = require('express-validator');
const { getAudioDurationInSeconds } = require('get-audio-duration');
const moment = require('moment');
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
                                    duration: file_duration,
                                    file_waveform:req.body.file_waveform
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
                                                        let msg = voiceMessageViewMapper.success(chat,message,req,file,'response');
                                                        let push = voiceMessageViewMapper.success(chat,message,req,file,'push');
                                                        pushManager.sendPushToSpecificTopic(chat._id,push,message._id);
                                                        res.json(msg);

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
                                            duration: file_duration,
                                            file_waveform:req.body.file_waveform
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
                                                                let msg = voiceMessageViewMapper.success(chat,message,req,file,'response');
                                                                let push = voiceMessageViewMapper.success(chat,message,req,file,'push');
                                                                pushManager.sendPushToSpecificTopic(chat._id,push,message._id);
                                                                res.json(msg);

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
                                    let arr = [req.user.push_token,user.push_token];
                                    pushManager.addTopic(newchat._id,arr,['chat'],'s');
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
                                                        duration: file_duration,
                                                        file_waveform:req.body.file_waveform
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
                                                                    let msg = voiceMessageViewMapper.success(newchat,message,req,file,'response');
                                                                    let push = voiceMessageViewMapper.success(newchat,message,req,file,'push');
                                                                    pushManager.sendPushToSpecificTopic(newchat._id,push,message._id);
                                                                    res.json(msg);
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

/**
 * End Point = /v1/getAllChats
 * Method = POST
 *
 * Response :
 *
 * {
    "chats": [
        {
            "id": "5d6b6d118446212a783d6392",
            "type": "private",
            "first_name": "diaoko",
            "last_name": "mahmoodi",
            "unread_messages": 12,
            "chat_photo": {
                "small_avatar_id": 1,
                "large_avatar_id": 2
            },
            "conversations": [
                {
                    "message_id": "5d6b6d118446212a783d6394",
                    "type": "voice",
                    "time": "2019-09-01T07:02:41.209Z",
                    "sender": {
                        "id": "1dc4d7rf5vv5fvs",
                        "type": "user",
                        "username": "diaoko89",
                        "first_name": "diaoko",
                        "last_name": "mahmoodi"
                    },
                    "voice_message": {
                        "file_id": "5d6b6d118446212a783d6393",
                        "type": "voice",
                        "duration": "380",
                        "size": "6126555"
                    }
                }
            ]
        }
    ]
}
 */
router.post('/v1/getAllChats',auth, function(req, res, next) {

    /*Chat.find({},function (err,chats) {
        console.log(err);
        res.json({hasserror:false,code:100,chats:chats.messages});
    });*/
    Chat
        .find({users : {$in :[req.user._id]}}) // all
        .populate([{path: 'messages',options : {
                limit : 1,
                sort: { 'createdAt': Number(-1) }
            },
            populate: [{ path : 'file' , model : 'File'},{ path : 'sender_id' , model : 'User'}],

        },{path: 'users',model:'User', match: {_id : {$ne : req.user._id}},}])
        .exec(function (err, chats) {
            if(chats!=null)
                res.json({chats : chats.map(mapper.chatviewmodel)});
            else
                res.json({haserror:true,code:11,msg:'chats not found'});
            // Stores with items
        });
    //res.render('index', { title: 'Express',chats:chat });
});



/* Post Send messages. */
/**
 * End Point = /v1/sendTextMessage
 * Method = POST
 * Parameters :
 *             receiver_id(required)
 *             sender_id(required)
 *             parse_mode(optional)
 *             reply_to(optional)
 *             text(required)
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
router.post('/v1/sendTextMessage',[
    auth,
    check('receiver_id').isLength({min:3}).isAlphanumeric().withMessage('Must be string and not empty'),
    check('text').isLength({min:1}).withMessage('text field should not empty'),
], function(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({haserror:true,code:0,errors: errors.array() })
    }
    else
    {
        var receiverId = `${req.body.receiver_id}`;
        if(receiverId.match(/^[0-9a-fA-F]{24}$/))
        {
            Chat.findOne({ _id:  receiverId },function (err,chat) {
                if(err)
                {
                    res.json({haserror:true,code:0,msg:'id not valid'})
                }
                else if(chat)
                {
                    if(chat.users.includes(req.user._id))
                    {
                        let message= new Message({
                            type : "text_message",
                            parse_mode : req.body.parse_mode,
                            reply_to : req.body.reply_to,
                            sender_id : req.user._id,
                            text_message : {
                                text: req.body.text
                            },
                        });
                        message.save(function (err) {
                            if(err)
                            {
                                console.log('error1');
                                res.json({haserror:true,code:0});
                            }
                            else {
                                let message_id = [message._id];
                                Chat.findOneAndUpdate(
                                    { _id: chat._id },
                                    { $push: { messages: message_id  } },
                                    function (error, success) {
                                        if (error) {
                                            console.log('error.........');
                                            res.json({haserror:true,code:1});

                                        } else {
                                            console.log('saved........exist');
                                            let msg = textMessageViewMapper.success(chat,message,req,'response');
                                            let push = textMessageViewMapper.success(chat,message,req,'push');
                                            pushManager.sendPushToSpecificTopic(chat._id,push,message._id);
                                            res.json(msg);

                                        }
                                    });
                            }

                        });

                    }
                    else
                    {
                        res.json({haserror:true,code:3,msg:'receiver person not found'});
                    }
                }
                else
                {
                    res.json({haserror:true,code:3,msg:'chat not found'});
                }
            });
        }
        else
        {
            User.findOne({id:receiverId},function(err,user){
                if(err)
                {

                }
                else if(user)
                {
                    receiverId = user._id;
                    Chat.findOne({type : 'private' ,
                        $and :
                            [
                                {
                                    users : {$in :[receiverId]}
                                },
                                {
                                    users : {$in :[req.user._id]}
                                }
                            ]
                    } , function (err,chat) {
                        console.log(chat);

                        if(chat!==null)
                        {

                            let message= new Message({
                                type : "text_message",
                                parse_mode : req.body.parse_mode,
                                reply_to : req.body.reply_to,
                                sender_id : req.user._id,
                                text_message : {
                                    text: req.body.text
                                },
                            });
                            message.save(function (err) {
                                if(err)
                                {
                                    console.log('error1');
                                    res.json({haserror:true,code:0});
                                }
                                else {
                                    let message_id = [message._id];
                                    Chat.findOneAndUpdate(
                                        { _id: chat._id },
                                        { $push: { messages: message_id  } },
                                        function (error, success) {
                                            if (error) {
                                                console.log('error.........');
                                                res.json({haserror:true,code:1});

                                            } else {
                                                console.log('saved........exist');

                                                let msg = textMessageViewMapper.success(chat,message,req,'response');
                                                let push = textMessageViewMapper.success(chat,message,req,'push');
                                                pushManager.sendPushToSpecificTopic(chat._id,push,message._id);
                                                res.json(msg);
                                            }
                                        });
                                }

                            });
                        }
                        else
                        {
                            let newchat = new Chat({
                                channel_id : "lvndfv34343jn43kn433333333333333333333",
                                type : "private",
                                messages : [],
                                users : [req.user._id,receiverId]
                            });

                            newchat.save(function (err) {
                                if(err)
                                {
                                    console.log("error 2")
                                }
                                else
                                {
                                    let arr = [req.user.push_token,user.push_token];
                                    //console.log(arr);
                                    pushManager.addTopic(newchat._id,arr,['chat'],'s');
                                    let message= new Message({
                                        type : "text_message",
                                        parse_mode : req.body.parse_mode,
                                        reply_to : req.body.reply_to,
                                        sender_id : req.user._id,
                                        text_message : {
                                            text: req.body.text
                                        },
                                    });
                                    message.save(function (err) {
                                        if(err)
                                        {
                                            console.log('error2');
                                            res.json({haserror:true,code:0});
                                        }
                                        else
                                        {

                                            newchat.messages.push(message._id);
                                            newchat.save();
                                            console.log('saved......2');
                                            let msg = textMessageViewMapper.success(newchat,message,req,'response');
                                            let push = textMessageViewMapper.success(newchat,message,req,'push');
                                            pushManager.sendPushToSpecificTopic(newchat._id,push,message._id);
                                            res.json(msg);
                                        }
                                    });
                                }
                            })
                        }
                    });
                }
                else {
                    res.json({haserror:true,code:3,msg:'receiver not found'});
                }

            });
        }
    }




});

/**
 * End Point = /v1/getMessages
 * Method = POST
 * Parameters :
 *             chat_id
 * Response :
 * {
    "conversations": [
        {
            "message_id": "5d6b6d118446212a783d6394",
            "type": "voice",
            "time": "2019-09-01T07:02:41.209Z",
            "sender": {
                "id": "1dc4d7rf5vv5fvs",
                "type": "user",
                "username": "diaoko89",
                "first_name": "diaoko",
                "last_name": "mahmoodi"
            },
            "voice_message": {
                "file_id": "5d6b6d118446212a783d6393",
                "type": "voice",
                "duration": "380",
                "size": "6126555"
            }
        }
    ]
}
 *
 */
router.post('/v1/getMessages',[
    auth,
    check('chat_id').isAlphanumeric().withMessage('Must be string and not empty'),
],function (req,res,next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({haserror:true,code:0,errors: errors.array() })
    }
    else
    {
        let query_string = {};
        let count= 10;
        if(check('direction').isNumeric() && check('date').isNumeric())
        {

            let date= new moment.unix(req.body.date/1000).format();
            if(req.body.direction==='1')
                query_string = {'createdAt': {$gt:date}};
            else if(req.body.direction==='-1')
                query_string = {'createdAt': {$lt:date}};
        }
        if(check('count').isNumeric())
        {
            count = req.body.count;
        }
        Chat
            .findOne({_id : req.body.chat_id})
            .populate({
                    path: 'messages',
                    match : query_string,
                    options : {
                        limit :count,
                        sort: { 'createdAt': -1 }
                    },
                    populate : {
                        path : 'file',
                        model : 'File'
                    }
                },
            )
            .exec(function (err, chat) {
                console.log(chat);
                if(chat!=null)
                    res.json({conversations:chat.messages.map(messageMapper.messageViewModel)});
                else
                    res.json({hasserror:true,code:11,msg: 'chat not found...'})
                // Stores with items
            });
    }

});

module.exports = router;
