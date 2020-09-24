// hostModel.js
var mongoose = require('mongoose');
// Setup schema
var hostSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    mac: {
        type: String,
        required: true
    },
    status: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});
// Export Host model
var Host = module.exports = mongoose.model('hosts', hostSchema);
module.exports.get = function (callback, limit) {
    Host.find(callback).limit(limit);
}