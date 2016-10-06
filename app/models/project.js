var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var projectSchema = new Schema({
    name            :String,
    description     :String,
    jiraTicketId    :String,
    startDate       :Date,
    endDate         :Date,
    externalTasks   :[{type: String, ref: 'Task' }],
    tags            :[String],
    team            :{ type: String, ref: 'Team' },
    deliverables    :[String],
    systems         :[String],
    priority        :String,
    deliveryLead    :{ type: String, ref: 'Resource' }
});

module.exports = mongoose.model('Project', projectSchema);
