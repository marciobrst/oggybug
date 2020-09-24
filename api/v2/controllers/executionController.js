// ScenarioController.js
// Import Execution model
Execution = require('../models/executionModel');
IDMDriver = require('../drivers/ibm');
RasaDriver = require('../drivers/rasa');
// Handle index actions
exports.index = function (req, res) {
    Execution.find({'user': req.userId}, null, {sort: {'control.started_at': -1}}, function (err, executions) {
        if (err)
            res.status(500).json({
                status: "error",
                message: err,
            });
        else 
            res.status(200).json(executions);
    });
};

// Handle view execution info
exports.view = function (req, res) {
    Execution.findById(req.params.model_id, function (err, execution) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else if(req.userId != execution.user) {
            res.json({
                status: "error",
                message: "Permission denied",
            });
        } else 
            res.json({
                message: 'Execution details loading..',
                data: execution
            });
    });
};
// Handle delete execution
exports.delete = function (req, res) {
    Execution.deleteOne({
        _id: req.params.model_id
    }, function (err, execution) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else if(req.userId != execution.user) {
            res.json({
                status: "error",
                message: "Permission denied",
            });
        } else 
            res.json({
                status: "success",
                message: 'Execution deleted'
            });
    });
};

exports.count = function (req, res) {
    Execution.count({user: req.userId}, function (err, result) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else 
            res.json({
                status: "success",
                message: "Executions retrieved successfully",
                data: result
            });
    });
};

