IntegrationModel = require('../models/integrationModel');

exports.index = function (req, res) {
    IntegrationModel.find({user: req.userId},function (err, models) {
        if (err)
            res.status(500).json({ message: err, });
        else 
            res.status(200).json(models);
    });
};

exports.new = function (req, res) {
    var model = new IntegrationModel();
    model.user = req.userId;
    model.name = req.body.name;
    model.description = req.body.description;
    model.status = req.body.status;
    model.fields = req.body.fields;
    model.save(function (err) {
        model.id = model._id;
        if (err)
            res.status(500).json({ message: err, });
        else
            res.status(200).json(model);
    });
};

exports.view = function (req, res) {
    IntegrationModel.findById(req.params.model_id, function (err, model) {
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
    IntegrationModel.findById(req.params.model_id, function (err, model) {
        if (err)
            res.status(500).json({ message: err, });
        else if(req.userId != model.user) {
            res.status(403).json({ message: "Permission denied", });
        } else {
            model.user = req.userId;
            model.name = req.body.name;
            model.description = req.body.description;
            model.status = req.body.status;
            model.fields = req.body.fields;
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
    IntegrationModel.findById(req.params.model_id, function (err, model) {
        if (err)
            res.status(500).json({ message: err, });
        else if(req.userId != model.user) {
            res.status(403).json({ message: "Permission denied", });
        } else {
            IntegrationModel.deleteOne({ _id: req.params.model_id }, function (err) {
                if (err)
                    res.status(500).json({ message: err, });
                else 
                    res.status(200).json({ message: 'Data Integration deleted' });
            });
        }
    });
};