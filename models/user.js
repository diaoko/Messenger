const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    id : String,
    first_name : String,
    last_name : String,
    username : String,
    token : String,
    refresh : String,
    expireTime: String,
    push_token : String
});

module.exports = mongoose.model('User',userSchema,'Users');