const mongoose = require('mongoose');
let Schema = mongoose.Schema;

var fileSchema = new Schema({
    type : String,
    path : String,
    size : String,
    duration: String,
});

module.exports.file = mongoose.model('File',fileSchema,'Files');