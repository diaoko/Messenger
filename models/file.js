const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let fileSchema = new Schema({
    type : String,
    path : String,
    size : String,
    duration: String,
});

module.exports = mongoose.model('File',fileSchema,'Files');