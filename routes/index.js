var express = require('express');
var router = express.Router();
var messageSchema = require('../models/message').textmessage;
var Chat = require('../models/chat').Chat;
/* GET home page. */
router.get('/v1/getAllChats', function(req, res, next) {

    /*Chat.find({},function (err,chats) {
        console.log(err);
        res.json({hasserror:false,code:100,chats:chats.messages});
    });*/
    Chat
        .find({}) // all
        .populate({path: 'messages',options : {
            limit : 20,
            sort: { 'message.created_at': Number(-1) }
            }})
        .exec(function (err, stores) {
            if (err) return handleError(err);
            res.json(stores);
            // Stores with items
        });
    //res.render('index', { title: 'Express',chats:chat });
});

/* get Send messages. */
router.get('/v1/sendTextMessage', function(req, res, next) {
  res.render('sendmessage', { title: 'Express' });
});

/* Post Send messages. */
router.post('/v1/sendTextMessage', function(req, res, next) {

    Chat.findOne({'type' : 'private' ,'users' : {$all :[1,req.body.reciever_id]}} ,'_id', function (err,chat) {
        if(chat)
        {
            var message= new messageSchema({
                receiver_id : req.body.reciever_id,
                type : "text_message",
                parse_mode : req.body.parse_mode,
                reply_to : req.body.reply_to,
                sender_id : 1,
                text_message : {
                    text: req.body.text
                },
            });
            message.save(function (err) {
                if(err)
                {
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
                                console.log('saved........');
                                res.json({haserror:false,code:100,msg_id:message._id});
                            }
                        });
                }

                //chat.messages.push(message._id);
                //chat.save();
            });
        }
        if(!chat)
        {
            var newchat = new Chat({
                channel_id : "lvndfv34343jn43kn43",
                type : "private",
                messages : [],
                users : [1,req.body.receiver_id]
            });

            newchat.save(function (err) {
                if(err)
                {
                    console.log("error 2")
                }
                else
                {
                    var message= new messageSchema({
                        receiver_id : req.body.reciever_id,
                        type : "text_message",
                        parse_mode : req.body.parse_mode,
                        reply_to : req.body.reply_to,
                        sender_id : 1,
                        text_message : {
                            text: req.body.text
                        },
                    });
                    message.save(function (err) {
                        if(err)
                        {
                            res.json({haserror:true,code:0});
                        }
                        else
                        {
                            //let saved = Chat.findById(newchat._id);
                            chat.messages.push(message._id);
                            chat.save();
                            res.json({haserror:true,code:100,msgg_id:message._id});
                        }

                    });

                }
            })

        }


    });

});

module.exports = router;
