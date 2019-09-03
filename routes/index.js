var express = require('express');
var router = express.Router();
var Message = require('../models/message');
var Chat = require('../models/chat');

let mapper = require('../utils/mapper');
let messageMapper = require('../utils/messagesMapper');
const shortid = require('shortid');
const { check, validationResult } = require('express-validator');
/* GET home page. */
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
router.post('/v1/getAllChats', function(req, res, next) {

    /*Chat.find({},function (err,chats) {
        console.log(err);
        res.json({hasserror:false,code:100,chats:chats.messages});
    });*/
    Chat
        .find({}) // all
        .populate({path: 'messages',options : {
            limit : 1,
            sort: { 'createdAt': Number(-1) }
            },
            populate: { path : 'file' , model : 'File'}
        })
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
router.post('/v1/sendTextMessage',[check('sender_id').isLength({min : 1})], function(req, res, next) {

    let errors = validationResult(req);
    if(!errors.isEmpty())
        res.json({haserror:true,code:0,msg: ['sender id not found'],error : errors});

    else{
        let receiverId = `${req.body.receiver_id}`;
        let senderId = `${req.body.sender_id}`;

        Chat.findOne({type : 'private' ,
            $and :
                [
                    {
                        users : {$in :[receiverId]}
                    },
                    {
                        users :{$in :[senderId]}
                    }
                ]
        } , function (err,chat) {
            console.log(chat);
            console.log(err);
            if(chat!==null)
            {

                var message= new Message({
                    receiver_id : req.body.receiver_id,
                    type : "text_message",
                    parse_mode : req.body.parse_mode,
                    reply_to : req.body.reply_to,
                    sender_id : req.body.sender_id,
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
                                    res.json({haserror:false,code:100,conversation :{    message_id: message.id,
                                            type : message.type,
                                            sender : {
                                                id : '1dc4d7rf5vv5fvs',
                                                type : 'user',
                                                username: 'diaoko89',
                                                first_name : 'diaoko',
                                                last_name : 'mahmoodi'
                                            },
                                            'text_message' : {
                                                text: message.text_message.text
                                            }}});
                                }
                            });
                    }

                });
            }
            else
            {
                var newchat = new Chat({
                    channel_id : "lvndfv34343jn43kn43",
                    type : "private",
                    messages : [],
                    users : [req.body.sender_id,req.body.receiver_id]
                });

                newchat.save(function (err) {
                    if(err)
                    {
                        console.log("error 2")
                    }
                    else
                    {
                        var message= new Message({
                            receiver_id : req.body.receiver_id,
                            type : "text_message",
                            parse_mode : req.body.parse_mode,
                            reply_to : req.body.reply_to,
                            sender_id : req.body.sender_id,
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
                                res.json({haserror:true,code:100,conversation : {    message_id: message.id,
                                        type : message.type,
                                        sender : {
                                            id : '1dc4d7rf5vv5fvs',
                                            type : 'user',
                                            username: 'diaoko89',
                                            first_name : 'diaoko',
                                            last_name : 'mahmoodi'
                                        },
                                        'text_message' : {
                                            text: message.text_message.text
                                        }}});
                            }

                        });

                    }
                })

            }


        });
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
router.post('/v1/getMessages',function (req,res,next) {

    Chat
        .findOne({_id : req.body.chat_id}) // all
        .populate({
                path: 'messages',
                options : {
                sort: { 'createdAt': 1 }
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
});

module.exports = router;
