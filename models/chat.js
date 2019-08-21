var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var privateChatSchema = new Schema({
    id : Number,
    type : String,
    username : String,
    first_name : String,
    last_name : String,
    photo : {
        small_photo_id : Number,
        large_photo_id : Number
    },
    description : String,
    messages : Array,
});

var ChatSchema = new Schema({
    id : Number,
    type : String,
    title : String,
    username : String,
    first_name : String,
    last_name : String,
    photo : {
        small_photo_id : Number,
        large_photo_id : Number
    },
    description : String,
    invite_link : String,
    messages : Array,
});

module.exports =mongoose.model('privateChat',privateChatSchema,'chats');