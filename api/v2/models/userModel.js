// userModel.js
var mongoose = require('mongoose');
// Setup schema
var userSchema = mongoose.Schema({
    name: {type: String, required: true},
    login: {type: String, required: true},
    password: {type: String, required: true},
    status: {type: String, default: 'Enabled'},
    created_at: {type: Date, default: Date.now}
});
// Export User model
var User = module.exports = mongoose.model('users_v2', userSchema);
module.exports.get = function (callback, limit) {
    User.find(callback).limit(limit);
}