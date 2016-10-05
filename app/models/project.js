var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var projectSchema = new Schema({
    name            :String,
    description     :String,
    startDate       :Date,
    endDate         :Date,
    externalTasks   :[{type: String, ref: 'Task' }],
    tags            :[String],
    team            :{ type: String, ref: 'Team' },
    deliverables    :[String],
    systems         :[String],
    priority        :[String],
    deliveryLead    :{ type: String, ref: 'Resource' }
});

/**
 * Project Complexity
 */
projectSchema.virtual('quadrant.complexity').get(function () {
    return 50;
});

/**
 * Project Tasks
 */
projectSchema.virtual('quadrant.tasks').get(function () {
    return 70;
});

/**
 * Project Dependencies
 */
projectSchema.virtual('quadrant.dependencies').get(function () {
    return 25;
});

/**
 * Project Timeline
 */
projectSchema.virtual('quadrant.timeline').get(function () {

    var today = new Date();
    var totalDays   = Math.round((this.endDate - this.startDate) / (1000*60*60*24));
    var daysPassed  = Math.round((today - this.startDate) / (1000*60*60*24));

    return this.endDate - this.startDate;
});

/**
 * Allow Virtuals in JSON Return
 */
projectSchema.set('toJSON', { getters: true, virtuals: true });


module.exports = mongoose.model('Project', projectSchema);
