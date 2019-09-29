const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let fileSchema = new Schema({
    type : String,
    mime_type : String,
    ext : String,
    path : String,
    size : String,
    duration: String,
    file_waveform:String
});

module.exports = mongoose.model('File',fileSchema,'Files');