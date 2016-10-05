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
    return 100;
});

/**
 * Allow Virtuals in JSON Return
 */
projectSchema.set('toJSON', { getters: true, virtuals: true });


module.exports = mongoose.model('Project', projectSchema);
