ScenarioModel = require('../models/scenarioModel');

exports.index = function (req, res) {
    ScenarioModel.find({user: req.userId},function (err, models) {
        if (err)
            res.status(500).json({ message: err, });
        else 
            res.status(200).json(models);
    });
};

exports.new = function (req, res) {
    var model = new ScenarioModel();
    model.user = req.userId;
    model.agent = req.body.agent;
    model.name = req.body.name;
    model.description = req.body.description;
    model.status = req.body.status;
    model.steps = req.body.steps;
    model.save(function (err) {
        model.id = model._id;
        if (err)
            res.status(500).json({ message: err, });
        else
            res.status(200).json(model);
    });
};

exports.view = function (req, res) {
    ScenarioModel.findById(req.params.model_id, function (err, model) {
        if (err)
            res.status(500).json({ message: err, });
        else if(req.userId != model.user) {
            res.status(403).json({ message: "Permission denied", });
        } else {            
            res.status(200).json(model);
        }            
    });
};

exports.update = function (req, res) {
    ScenarioModel.findById(req.params.model_id, function (err, model) {
        if (err)
            res.status(500).json({ message: err, });
        else if(req.userId != model.user) {
            res.status(403).json({ message: "Permission denied", });
        } else {
            model.user = req.userId;
            model.agent = req.body.agent;
            model.name = req.body.name;
            model.description = req.body.description;
            model.status = req.body.status;
            model.steps = req.body.steps;
            model.save(function (err) {
                if (err)
                    res.status(500).json({ message: err, });
                else
                    res.status(200).json(model);
            });
        }        
    });
};

exports.delete = function (req, res) {
    ScenarioModel.findById(req.params.model_id, function (err, model) {
        if (err)
            res.status(500).json({ message: err, });
        else if(req.userId != model.user) {
            res.status(403).json({ message: "Permission denied", });
        } else {
            ScenarioModel.deleteOne({ _id: req.params.model_id }, function (err) {
                if (err)
                    res.status(500).json({ message: err, });
                else 
                    res.status(200).json({ message: 'Scenario deleted' });
            });
        }
    });
};