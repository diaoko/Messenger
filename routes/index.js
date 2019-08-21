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
  res.render('index', { title: 'Express' });
});

module.exports = router;
