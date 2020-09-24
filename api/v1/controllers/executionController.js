// ScenarioController.js
// Import Execution model
Execution = require('../models/executionModel');
Izzy = require('../services/izzy');
Rasa = require('../services/rasa');
// Handle index actions
exports.index = function (req, res) {
    Execution.find({user: req.userId}, null, {sort: {created_at: -1}}, function (err, executions) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else 
            res.json({
                status: "success",
                message: "Executions retrieved successfully",
                data: executions
            });
    });
};
// Handle create Execution actions
exports.new = function (req, res) {
    var execution = new Execution();
    execution.user = req.userId;
    execution.session = req.body.session;
    execution.agent = req.body.agent;
    execution.scenario = req.body.scenario;
    execution.name = req.body.name;
    execution.description = req.body.description;
    execution.status = req.body.status;
    execution.steps = req.body.steps;
    // save the execution and check for errors
    execution.save(function (err) {
        execution.id = execution._id;
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else
            res.json({
                message: 'New execution created!',
                data: execution
            });
    });
};
// Handle view execution info
exports.view = function (req, res) {
    Execution.findById(req.params.execution_id, function (err, execution) {
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
// Handle update execution info
exports.update = function (req, res) {
    Execution.findById(req.params.execution_id, function (err, execution) {
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
        } else {
            execution.type = req.body.type;
            execution.name = req.body.name;
            execution.description = req.body.description;
            execution.status = req.body.status;
            execution.steps = req.body.steps;
            // save the Execution and check for errors
            execution.save(function (err) {
                if (err)
                    res.json({
                        status: "error",
                        message: err,
                    });
                else
                    res.json({
                    message: 'Execution Info updated',
                    data: execution
                });
            });
        }        
    });
};
// Handle delete execution
exports.delete = function (req, res) {
    Execution.remove({
        _id: req.params.execution_id
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

exports.execute = function (req, res) {
    let scenario = req.body;
    console.log(scenario)
    if(scenario.chatbot.type == 'IBM Assistent') {
        Izzy.execute(req.userId, agent, scenario);
    } else if(scenario.chatbot.type == 'Rasa') {
        Rasa.execute(req.userId, scenario);
    } else {
        res.status(400).json({
            status: "error",
            message: "Agent not working",
        }); 
    }
    
    res.json({
        status: "success",
        message: 'Scenario executed',
    });
};