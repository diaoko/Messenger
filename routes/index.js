var express = require('express');
var router = express.Router();
var messageSchema = require('../models/message').textmessage;
var chatSchema = require('../models/chat');
/* GET home page. */
router.get('/v1/getAllChats', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* get Send messages. */
router.get('/v1/sendTextMessage', function(req, res, next) {
  res.render('sendmessage', { title: 'Express' });
});

/* Post Send messages. */
router.post('/v1/sendTextMessage', function(req, res, next) {

  var message= new messageSchema({
        id : req.body.message_id,
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
            console.log('error...');
        }
        else
        {
            let chat = new chatSchema({
                channel_id : "lvndfv34343jn43kn43",
                type : "private",
                messages : message._id,
                users : [1,req.body.receiver_id]
            });

            chat.save(function (err) {
                if(err)
                {
                    console.log("error 2")
                }
                else
                {
                    console.log('ok......');
                    res.json({haserror:false,code:100});
                }
            })

        }
    });
});

module.exports = router;
