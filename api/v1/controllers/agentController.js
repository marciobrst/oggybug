// agentController.js
// Import agent model
Agent = require('../models/agentModel');
// Handle index actions
exports.index = function (req, res) {
    Agent.find({user: req.userId},function (err, agents) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else 
            res.json({
                status: "success",
                message: "Agents retrieved successfully",
                data: agents
            });
    });
};
// Handle create agent actions
exports.new = function (req, res) {
    var agent = new Agent();
    agent.user = req.userId;
    agent.type = req.body.type;
    agent.name = req.body.name;
    agent.description = req.body.description;
    agent.config = req.body.config;
    agent.status = req.body.status;
    // save the agent and check for errors
    agent.save(function (err) {
        agent.id = agent._id;
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else
            res.json({
                message: 'New agent created!',
                data: agent
            });
    });
};
// Handle view agent info
exports.view = function (req, res) {
    Agent.findById(req.params.agent_id, function (err, agent) {
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
            res.json({
                message: 'Agent details loading..',
                data: agent
            });
        }
            
    });
};
// Handle update agent info
exports.update = function (req, res) {
    Agent.findById(req.params.agent_id, function (err, agent) {
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
            agent.type = req.body.type;
            agent.name = req.body.name;
            agent.description = req.body.description;
            agent.config = req.body.config;
            agent.status = req.body.status;
            // save the Agent and check for errors
            agent.save(function (err) {
                if (err)
                    res.json({
                        status: "error",
                        message: err,
                    });
                else
                    res.json({
                    message: 'Agent Info updated',
                    data: agent
                });
            });
        }        
    });
};
// Handle delete agent
exports.delete = function (req, res) {
    Agent.remove({
        _id: req.params.agent_id
    }, function (err, agent) {
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
        } else 
            res.json({
                status: "success",
                message: 'Agent deleted'
            });
    });
};