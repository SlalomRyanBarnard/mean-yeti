var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
    name        :String,
    pictureUrl  :String,
    projects    :[String]
});

module.exports = mongoose.model('User', userSchema);