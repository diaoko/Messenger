var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TextMessageSchema = new Schema({
    reply_to: String,
    type: String,
    sender_id: { type: Schema.Types.ObjectId, ref: 'User' },
    parse_mode: String,
    file: { type: Schema.Types.ObjectId, ref: 'File' },
    text_message:
    {
        text: String
    }

}, {
    timestamps: true
});

var voiceMessageSchema = new Schema({
    reply_to: String,
    type: String,
    sender_id: String,
    parse_mode: String,
    voice:
    {
        file_id: String
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('Message', TextMessageSchema, 'messages');
//var voice = mongoose.model('VoiceMessage', voiceMessageSchema,'messages');
/*
module.exports = {
    textmessage: text,
    voicemessage : voice
};
*/
