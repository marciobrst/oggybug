// ScenarioController.js
// Import Scenario model
Scenario = require('../models/scenarioModel');
Agent = require('../models/agentModel');
Izzy = require('../services/izzy');
Rasa = require('../services/rasa');
// Handle index actions
exports.index = function (req, res) {
    var params= { user: req.userId }
    if(req.query.status) {
        params["status"] = "Enabled";
    }
    console.log(params)
    Scenario.find(params, function (err, scenarios) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else 
            res.json({
                status: "success",
                message: "Scenarios retrieved successfully",
                data: scenarios
            });
    });
};
// Handle create Scenario actions
exports.new = function (req, res) {
    var scenario = new Scenario();
    scenario.user = req.userId;
    scenario.agent = req.body.agent;
    scenario.name = req.body.name;
    scenario.description = req.body.description;
    scenario.status = req.body.status;
    scenario.steps = req.body.steps;
    scenario.data = req.body.data;
    // save the scenario and check for errors
    scenario.save(function (err) {
        scenario.id = scenario._id;
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else
            res.json({
                message: 'New scenario created!',
                data: scenario
            });
    });
};
// Handle view scenario info
exports.view = function (req, res) {
    Scenario.findById(req.params.scenario_id, function (err, scenario) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else if(req.userId != scenario.user) {
            res.json({
                status: "error",
                message: "Permission denied",
            });
        } else 
            res.json({
                message: 'Scenario details loading..',
                data: scenario
            });
    });
};
// Handle update scenario info
exports.update = function (req, res) {
    Scenario.findById(req.params.scenario_id, function (err, scenario) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else if(req.userId != scenario.user) {
            res.json({
                status: "error",
                message: "Permission denied",
            });
        } else {
            scenario.agent = req.body.agent;
            scenario.name = req.body.name;
            scenario.description = req.body.description;
            scenario.status = req.body.status;
            scenario.steps = req.body.steps;
            scenario.data = req.body.data;
            // save the Scenario and check for errors
            scenario.save(function (err) {
                if (err)
                    res.json({
                        status: "error",
                        message: err,
                    });
                else
                    res.json({
                    message: 'Scenario Info updated',
                    data: scenario
                });
            });
        }        
    });
};
// Handle delete scenario
exports.delete = function (req, res) {
    Scenario.remove({
        _id: req.params.scenario_id
    }, function (err, scenario) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else if(req.userId != scenario.user) {
            res.json({
                status: "error",
                message: "Permission denied",
            });
        } else 
            res.json({
                status: "success",
                message: 'Scenario deleted'
            });
    });
};

exports.run = function (req, res) {
    Scenario.findById(req.params.scenario_id, function (err, scenario) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else if(req.userId != scenario.user) {
            res.json({
                status: "error",
                message: "Permission denied",
            });
        } else {            
            // save the Scenario and check for errors
            scenario.save(function (err) {
                if (err)
                    res.json({
                        status: "error",
                        message: err,
                    });
                else
                    res.json({
                    message: 'Scenario Info updated',
                    data: scenario
                });
            });
        }        
    });
};

exports.execute = function (req, res) {
    Scenario.findById(req.params.scenario_id, function (err, scenario) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else if(req.userId != scenario.user) {
            res.json({
                status: "error",
                message: "Permission denied",
            });
        } else {
            Agent.findById(scenario.agent, function (err, agent) {
                if (err)
                    res.json({
                        status: "error",
                        message: err,
                    });
                else if(req.userId != agent.user) {
                    res.json({
                        status: "error",
                        message: "Permission denied",
                    });
                } else {
                    if(agent.type == 'IBM Assistent') {
                        Izzy.execute(req.userId, agent, scenario);
                    } else if(agent.type == 'Rasa') {
                        Rasa.execute(req.userId, agent, scenario);
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
                }
            });            
        }        
    });
};

exports.count = function (req, res) {
    Scenario.count({user: req.userId}, function (err, result) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else 
            res.json({
                status: "success",
                message: "Scenarios retrieved successfully",
                data: result
            });
    });
};