var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    name        :String,
    pictureUrl  :String,
    projects    :[String]
});
