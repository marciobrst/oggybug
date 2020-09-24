var mongoose = require('mongoose');
var stepSchema = mongoose.Schema({
    type: String,
    data: mongoose.Schema.Types.Mixed
});
var scenarioSchema = mongoose.Schema({
    user: String,
    agent: String,
    type: String,
    name: String,
    description: String,
    status: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    steps: [stepSchema]
});
// Export Scenario model
var Scenario = module.exports = mongoose.model('scenarios_v2', scenarioSchema);
module.exports.get = function (callback, limit) {
    Scenario.find(callback).limit(limit);
}