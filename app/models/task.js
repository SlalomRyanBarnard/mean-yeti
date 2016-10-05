var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var taskSchema = new Schema({
    name            :String,
    isComplete      :Boolean,
    project         :{ type: String, ref: 'Project' },
    hourEstimate    :Number,
    hoursBurned     :Number,
    startDate       :Date,
    endDate         :Date,
    note            :String
});

module.exports = mongoose.model('Task', taskSchema);