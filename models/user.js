const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    id : String,
    type : String,
    first_name : String,
    last_name : String,
    username : String,
    token : String,
    refresh : String,
    expireTime: String,
    push_token : String,
    avatars : [{type : Schema.Types.ObjectId,ref : "File"}],
});

module.exports = mongoose.model('User',userSchema,'Users');