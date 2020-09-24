// executionModel.js
var mongoose = require('mongoose');
// Setup schema

var executionStepSchema = mongoose.Schema({ 
    type: String,    
    data: mongoose.Schema.Types.Mixed 
});

var executionSchema = mongoose.Schema({
    user: String,
    chatbot: mongoose.Schema.Types.Mixed,
    scenario: mongoose.Schema.Types.Mixed,
    session: String,
    name: String,
    control: {
        started_at: { type: Date, default: Date.now },
        fineshed_at: { type: Date, default: Date.now },
        status: {type: String, default: 'Created' }
    },    
    steps: [executionStepSchema]
});
// Export Execution model
var Execution = module.exports = mongoose.model('executions_v2', executionSchema);
module.exports.get = function (callback, limit) {
    Execution.find(callback).limit(limit);
}