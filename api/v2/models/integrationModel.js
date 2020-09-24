var mongoose = require('mongoose');
var fieldSchema = mongoose.Schema(
    { name: String, type: String, key: Boolean }
)
var integrationSchema = mongoose.Schema({
    name: String,
    description: String,
    user: String,
    status: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    key: fieldSchema,
    fields: [fieldSchema]
});
var Integration = module.exports = mongoose.model('integrations_v2', integrationSchema);
module.exports.get = function (callback, limit) {
    Integration.find(callback).limit(limit);
}