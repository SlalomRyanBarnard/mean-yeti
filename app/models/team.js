var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var teamSchema = new Schema({
    name        :String,
    resources   :[String]
});

module.exports = mongoose.model('Team', teamSchema);