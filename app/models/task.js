var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var taskSchema = new Schema({
    name            :String,
    isComplete      :Boolean,
    project         :String,
    hourEstimate    :Number,
    hoursBurned     :Number,
    startDate       :Date,
    endDate         :Date
});

module.exports = mongoose.model('Task', taskSchema);