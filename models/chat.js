const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let privateChatSchema = new Schema({
    channel_id: String,
    type: String,
    messages: [{ type: Schema.Types.ObjectId, ref: "Message" }],
    users: [Schema.Types.String]
}, {
    timestamps: true
});

let ChatSchema = new Schema({
    channel_id: String,
    type: String,
    title: String,
    username: String,
    first_name: String,
    last_name: String,
    photo: {
        small_photo_id: Number,
        large_photo_id: Number
    },
    description: String,
    invite_link: String,
    messages: Array,
});

module.exports = mongoose.model('Chat', privateChatSchema, 'chats');