var express = require('express');
var router = express.Router();

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
  var messageSchema = require('../models/message').textmessage;
  var chat= new messageSchema({
        id : req.body.message_id,
        chat_id : req.body.chat_id,
        parse_mode : req.body.parse_mode,
        reply_to : req.body.reply_to,
        message : req.body.text,
    });
    chat.save(function (err) {
        if(err)
            console.log('error...');
        else
            console.log('ok......');
    });
});

module.exports = router;
