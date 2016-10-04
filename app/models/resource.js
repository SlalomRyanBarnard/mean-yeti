var mongoose = require('mongoose');

module.exports = mongoose.model('Resource', {
    name    :String,
    role    :String,
    tasks   :[String],
    skills  :[String]
});