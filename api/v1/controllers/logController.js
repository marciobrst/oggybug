// logController.js
// Import log model
Log = require('../models/logModel');
// Handle index actions
exports.index = function (req, res) {
    Log.find({user: req.userId},function (err, logs) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else 
            res.json({
                status: "success",
                message: "Logs retrieved successfully",
                data: logs
            });
    });
};
// Handle create log actions
exports.new = function (req, res) {
    var log = new Log();
    log.user = req.userId;
    log.session = req.body.session;
    log.title = req.body.title;
    log.description = req.body.description;
    log.save(function (err) {
        log.id = log._id;
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else
            res.json({
                message: 'New log created!',
                data: log
            });
    });
};
// Handle view log info
exports.view = function (req, res) {
    Log.findById(req.params.log_id, function (err, log) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else if(req.userId != log.user) {
            res.json({
                status: "error",
                message: "Permission denied",
            });
        } else {            
            res.json({
                message: 'Log details loading..',
                data: log
            });
        }
            
    });
};
// Handle update log info
exports.update = function (req, res) {
    Log.findById(req.params.log_id, function (err, log) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else if(req.userId != log.user) {
            res.json({
                status: "error",
                message: "Permission denied",
            });
        } else {
            log.session = req.body.session;
            log.title = req.body.title;
            log.description = req.body.description;
            // save the Log and check for errors
            log.save(function (err) {
                if (err)
                    res.json({
                        status: "error",
                        message: err,
                    });
                else
                    res.json({
                    message: 'Log Info updated',
                    data: log
                });
            });
        }        
    });
};
// Handle delete log
exports.delete = function (req, res) {
    Log.remove({
        _id: req.params.log_id
    }, function (err, log) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else if(req.userId != log.user) {
            res.json({
                status: "error",
                message: "Permission denied",
            });
        } else 
            res.json({
                status: "success",
                message: 'Log deleted'
            });
    });
};