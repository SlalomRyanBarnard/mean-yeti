var mongoose = require('mongoose');

module.exports = mongoose.model('Project', {
    name            :String,
    startDate       :Date,
    endDate         :Date,
    tasks           :[String],
    tags            :[String],
    team            :String,
    deliverables    :[String],
    systems         :[String]
});