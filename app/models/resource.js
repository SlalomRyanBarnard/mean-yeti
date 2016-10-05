var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var resourceSchema = new Schema({
    name    :String,
    role    :String,
    pictureUrl :String,
    tasks   :[{ type: String, ref: 'Task' }],
    skills  :[String]
});

module.exports = mongoose.model('Resource', resourceSchema);