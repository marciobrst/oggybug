// agentModel.js
var mongoose = require('mongoose');
// Setup schema
var agentSchema = mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: String,
    config: {
        workspace: String,    
        server: String,
        username: String,
        password: String,
        apikey: String
    },    
    status: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});
// Export Agent model
var Agent = module.exports = mongoose.model('agents', agentSchema);
module.exports.get = function (callback, limit) {
    Agent.find(callback).limit(limit);
}