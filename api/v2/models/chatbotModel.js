var mongoose = require('mongoose');
var chatbotSchema = mongoose.Schema({
    user: { type: String, required: true },
    type: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    config: mongoose.Schema.Types.Mixed,    
    status: { type: String, default: 'Enabled' },
    created_at: { type: Date, default: Date.now }
});
var Chatbot = module.exports = mongoose.model('chatbots_v2', chatbotSchema);
module.exports.get = function (callback, limit) {
    Chatbot.find(callback).limit(limit);
}