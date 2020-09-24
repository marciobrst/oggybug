// userModel.js
var mongoose = require('mongoose');
// Setup schema
var userSchema = mongoose.Schema({
    user: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});
// Export User model
var User = module.exports = mongoose.model('users', userSchema);
module.exports.get = function (callback, limit) {
    User.find(callback).limit(limit);
}