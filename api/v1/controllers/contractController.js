// ScenarioController.js
// Import Contract model
Contract = require('../models/contractModel');
// Handle index actions
exports.index = function (req, res) {
    var params= { user: req.userId }
    if(req.query.status) {
        params["status"] = "Enabled";
    }
    Contract.find(params, function (err, scenarios) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else 
            res.json({
                status: "success",
                message: "Contracts retrieved successfully",
                data: scenarios
            });
    });
};
// Handle create Contract actions
exports.new = function (req, res) {
    console.log(req.body);
    var contract = new Contract();
    contract.user = req.userId;
    contract.name = req.body.name;
    contract.description = req.body.description;
    contract.status = req.body.status;
    contract.fields = req.body.fields;

    contract.save(function (err) {
        contract.id = contract._id;
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else
            res.json({
                message: 'New contract created!',
                data: contract
            });
    });
};
// Handle view contract info
exports.view = function (req, res) {
    Contract.findById(req.params.contract_id, function (err, contract) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else if(req.userId != contract.user) {
            res.json({
                status: "error",
                message: "Permission denied",
            });
        } else 
            res.json({
                message: 'Contract details loading..',
                data: contract
            });
    });
};
// Handle update contract info
exports.update = function (req, res) {
    Contract.findById(req.params.contract_id, function (err, contract) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else if(req.userId != contract.user) {
            res.json({
                status: "error",
                message: "Permission denied",
            });
        } else {
            contract.name = req.body.name;
            contract.description = req.body.description;
            contract.status = req.body.status;
            contract.fields = req.body.fields;
            contract.save(function (err) {
                if (err)
                    res.json({
                        status: "error",
                        message: err,
                    });
                else
                    res.json({
                    message: 'Contract Info updated',
                    data: contract
                });
            });
        }        
    });
};
// Handle delete contract
exports.delete = function (req, res) {
    Contract.remove({
        _id: req.params.contract_id
    }, function (err, contract) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else if(req.userId != contract.user) {
            res.json({
                status: "error",
                message: "Permission denied",
            });
        } else 
            res.json({
                status: "success",
                message: 'Contract deleted'
            });
    });
};

exports.run = function (req, res) {
    Contract.findById(req.params.contract_id, function (err, contract) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else if(req.userId != contract.user) {
            res.json({
                status: "error",
                message: "Permission denied",
            });
        } else {            
            // save the Contract and check for errors
            contract.save(function (err) {
                if (err)
                    res.json({
                        status: "error",
                        message: err,
                    });
                else
                    res.json({
                    message: 'Contract Info updated',
                    data: contract
                });
            });
        }        
    });
};

exports.count = function (req, res) {
    Contract.count({user: req.userId}, function (err, result) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else 
            res.json({
                status: "success",
                message: "Contracts retrieved successfully",
                data: result
            });
    });
};