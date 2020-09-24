var mongoose = require('mongoose');
var fieldSchema = mongoose.Schema(
    { name: String, type: String, key: Boolean }
)

var contractSchema = mongoose.Schema({
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
var Contract = module.exports = mongoose.model('contracts', contractSchema);
module.exports.get = function (callback, limit) {
    Contract.find(callback).limit(limit);
}