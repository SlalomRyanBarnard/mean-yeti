var mongoose = require('mongoose');

module.exports = mongoose.model('Task', {
    name            :String,
    isComplete      :Boolean,
    project         :String,
    hourEstimate    :Number,
    hoursBurned     :Number,
    startDate       :Date,
    endDate         :Date
});