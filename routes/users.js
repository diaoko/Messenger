var express = require('express');
var router = express.Router();
const { getAudioDurationInSeconds } = require('get-audio-duration');
/* GET users listing. */
router.get('/', function(req, res, next) {
    getAudioDurationInSeconds('./public/upfiles/voice/music.mp3').then((duration) => {
        console.log(duration)
    })
  res.send('respond with a resource');
});

module.exports = router;
