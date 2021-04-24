const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let pushSchema = new Schema({
    push: Object
});

module.exports = mongoose.model('Push', pushSchema, 'Push');
