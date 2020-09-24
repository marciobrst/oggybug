// executionModel.js
var mongoose = require('mongoose');
// Setup schema

var executionStepSchema = mongoose.Schema({ 
    type: String, 
    text: String, 
    name: String, 
    value: String, 
    valid: String, 
    result: Boolean,
    data: mongoose.Schema.Types.Mixed 
});

var executionSchema = mongoose.Schema({
    user: String,
    session: String,
    agent: String,
    scenario: String,
    type: String,
    name: String,
    description: String,
    status: Boolean,
    result: Boolean,
    created_at: {
        type: Date,
        default: Date.now
    },
    steps: [executionStepSchema]
});
// Export Execution model
var Execution = module.exports = mongoose.model('executions', executionSchema);
module.exports.get = function (callback, limit) {
    Execution.find(callback).limit(limit);
}