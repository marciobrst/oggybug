// logModel.js
var mongoose = require('mongoose');
// Setup schema
var logSchema = mongoose.Schema({
    user: String,
    session: String,
    title: String,
    description: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});
// Export Agent model
var Log = module.exports = mongoose.model('logs', logSchema);
module.exports.get = function (callback, limit) {
    Log.find(callback).limit(limit);
}