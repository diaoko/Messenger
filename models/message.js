var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TextMessageSchema = new Schema({
    reply_to : String,
    type : String,
    sender_id : String,
    parse_mode : String,
    text_message:
        {
            text: String
        }
},{
    timestamps : true
});
var text = mongoose.model('Message', TextMessageSchema,'messages');
var voice = mongoose.model('Message', TextMessageSchema,'messages');
module.exports = {
    textmessage: text,
    voicemessage : voice
};
