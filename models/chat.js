var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var privateChatSchema = new Schema({
    channel_id : String,
    type : String,
    messages : Array,
    users : Array
},{
    timestamps : true
});

var ChatSchema = new Schema({
    channel_id : String,
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