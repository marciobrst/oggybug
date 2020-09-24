// scenarioModel.js
var mongoose = require('mongoose');
// Setup schema

var valueSchema = mongoose.Schema({ name: String, value: String });

var dataSchema = mongoose.Schema({    
    user: String,
    execution: String,
    session: String,
    contract: String,    
    key: String,    
    values: [valueSchema]
});
// Export Scenario model
var Data = module.exports = mongoose.model('data', dataSchema);
module.exports.get = function (callback, limit) {
    Data.find(callback).limit(limit);
}