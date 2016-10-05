var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var projectSchema = new Schema({
    name            :String,
    startDate       :Date,
    endDate         :Date,
    tasks           :[String],
    tags            :[String],
    team            :String,
    deliverables    :[String],
    systems         :[String]
});

module.exports = mongoose.model('Project', projectSchema);
