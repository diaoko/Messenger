var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TextMessageSchema = new Schema({
    reply_to : String,
    type : String,
    sender_id : String,
    parse_mode : String,
    voice:
        {
            file_id: String
        },
    text_message :
        {
            text:String
        }

},{
    timestamps : true
});

var voiceMessageSchema = new Schema({
    reply_to : String,
    type : String,
    sender_id : String,
    parse_mode : String,
    voice:
        {
            file_id: String
        }
},{
    timestamps : true
});
var text = mongoose.model('Message', TextMessageSchema,'messages');
var voice = mongoose.model('VoiceMessage', voiceMessageSchema,'messages');
module.exports = {
    textmessage: text,
    voicemessage : voice
};
