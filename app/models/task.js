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

taskSchema.virtual('timeline').get(function() {
    var today = new Date();
    if (!this.startDate || !this.endDate || today < this.startDate) {
        return 0;
    }

    var totalDays   = Math.round((this.endDate - this.startDate) / (1000*60*60*24));
    var daysPassed  = Math.round((today - this.startDate) / (1000*60*60*24));

    if (totalDays === 0) {
        return 100;
    }

    var percent = (daysPassed / totalDays) * 100;

    if (percent > 100) {
        return 100;
    }
    return percent;
});

taskSchema.virtual('isLate').get(function() {

    if (!this.endDate) {
        return false;
    }
    var today = new Date();

    return ((today - this.endDate) > 0) && !this.isComplete;

});

taskSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Task', taskSchema);