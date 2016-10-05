var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var teamSchema = new Schema({
    name        :String,
    resources   :[{ type: String, ref: 'Resource' }]
});

module.exports = mongoose.model('Team', teamSchema);