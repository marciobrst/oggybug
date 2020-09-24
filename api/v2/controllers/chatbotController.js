ChatbotModel = require('../models/chatbotModel');

exports.index = function (req, res) {
    ChatbotModel.find({user: req.userId},function (err, models) {
        if (err)
            res.status(500).json({ message: err, });
        else 
            res.status(200).json(models);
    });
};

exports.new = function (req, res) {
    var model = new ChatbotModel();
    model.user = req.userId;
    model.type = req.body.type;
    model.name = req.body.name;
    model.description = req.body.description;
    model.config = req.body.config;
    model.status = req.body.status;
    model.save(function (err) {
        model.id = model._id;
        if (err)
            res.status(500).json({ message: err, });
        else
            res.status(200).json(model);
    });
};

exports.view = function (req, res) {
    ChatbotModel.findById(req.params.model_id, function (err, model) {
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
    ChatbotModel.findById(req.params.model_id, function (err, model) {
        if (err)
            res.status(500).json({ message: err, });
        else if(req.userId != model.user) {
            res.status(403).json({ message: "Permission denied", });
        } else {
            model.type = req.body.type;
            model.name = req.body.name;
            model.description = req.body.description;
            model.config = req.body.config;
            model.status = req.body.status;
            // save the ChatbotModel and check for errors
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
    ChatbotModel.findById(req.params.model_id, function (err, model) {
        if (err)
            res.status(500).json({ message: err, });
        else if(req.userId != model.user) {
            res.status(403).json({ message: "Permission denied", });
        } else {
            ChatbotModel.deleteOne({ _id: req.params.model_id }, function (err) {
                if (err)
                    res.status(500).json({ message: err, });
                else 
                    res.status(200).json({ message: 'Chatbot deleted' });
            });
        }
    });
};