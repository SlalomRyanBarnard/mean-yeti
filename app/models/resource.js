var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var resourceSchema = new Schema({
    name    :String,
    role    :String,
    tasks   :[String],
    skills  :[String]
});

module.exports = mongoose.model('Resource', resourceSchema);