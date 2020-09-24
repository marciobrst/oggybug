// ScenarioController.js
// Import Data model
Contract = require('../models/contractModel');
Data = require('../models/dataModel');
DataFunctions = require('../services/dataFunctions');

/*
function transform(data) {
    tranform = {}
    data.values.forEach((value) => {
        tranform[value.name] = value.value;
    })
    return tranform
}

function transformAll(data) {
    all = []
    data.forEach((value) => {
        all.push(transform(value))
    })
    return all
}

function converter(contract, body) {
    values = [];
    fields = contract.fields;
    for (let index = 0; index < fields.length; index++) {
        const key = fields[index].name;
        values.push({name: key, value: body[key]});                
    }
    return values;
}

function getKey(contract, body) {
    value = null;
    fields = contract.fields;
    for (let index = 0; index < fields.length; index++) {
        if(fields[index].key) {
            const key = fields[index].name;
            value = body[key];
        }        
    }
    return value;
}
*/

// Handle index actions
exports.index = function (req, res) {
    console.log(req.params);
    console.log(req.query);
    filter = {contract: req.params.contract, user: req.userId, session: req.query.session}
    Data.find(filter, function (err, datas) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else 
            res.json(DataFunctions.transformAll(datas));
    });
};

// Handle create Data actions
exports.new = function (req, res) {
    filter = {name: req.params.contract, user: req.userId}
    Contract.findOne(filter, function (err, contract) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else {
            var data = new Data();
            data.user = req.userId;
            data.session = req.query.session;
            data.contract = req.params.contract;
            data.key = DataFunctions.getKey(contract, req.body);
            data.values = DataFunctions.converter(contract, req.body);
            data.save(function (err) {
                data.id = data._id;
                if (err)
                    res.json({
                        status: "error",
                        message: err,
                    });
                else
                    res.json(req.body);
            });
        }
    });
    
};
// Handle view data info
exports.view = function (req, res) {
    filter = {contract: req.params.contract, user: req.userId, session: req.query.session, key: req.params.key}
    Data.findOne(filter, function (err, data) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else if(req.userId != data.user) {
            res.json({
                status: "error",
                message: "Permission denied",
            });
        } else             
            res.json(DataFunctions.transform(data));
    });
};
// Handle update data info
exports.update = function (req, res) {
    filter = {name: req.params.contract, user: req.userId}
    console.log(filter)
    Contract.findOne(filter, function (err, contract) {
        console.log(contract)
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else {
            filter = {contract: req.params.contract, user: req.userId, execution: req.query.execution, key: req.params.key}
            Data.findOne(filter, function (err, data) {
                console.log(data)
                if (err)
                    res.json({
                        status: "error",
                        message: err,
                    });
                else if(req.userId != data.user) {
                    res.json({
                        status: "error",
                        message: "Permission denied",
                    });
                } else {
                    data.values = DataFunctions.converter(contract, req.body);
                    data.save(function (err) {
                        if (err)
                            res.json({
                                status: "error",
                                message: err,
                            });
                        else
                            res.json(req.body);
                    });
                }        
            });
        }
    });

    
};
// Handle delete data
exports.delete = function (req, res) {
    filter = {contract: req.params.contract, user: req.userId, session: req.query.session, key: req.params.key}
    Data.deleteOne(filter, function (err, data) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else 
            res.json({
                status: "success",
                message: 'Data deleted'
            });
    });
};