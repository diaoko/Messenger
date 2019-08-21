var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TextMessageSchema = new Schema({
    id : Number,
    reply_to : Number,
    type : String,
    sender_id : Number,
    text_message:
        {
            text: String
        }
},{
    timestamps : true
});
var text = mongoose.model('TextMessage', TextMessageSchema,'messages');
var voice = mongoose.model('TextMessage', TextMessageSchema,'messages');
module.exports = {
    textmessage: text,
    voicemessage : voice
};
