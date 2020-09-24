// hostController.js
// Import host model
Host = require('../models/hostModel');
// Handle index actions
exports.index = function (req, res) {
    Host.get(function (err, hosts) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else 
            res.json({
                status: "success",
                message: "Hosts retrieved successfully",
                data: hosts
            });
    });
};
// Handle create host actions
exports.new = function (req, res) {
    var host = new Host();
    host.name = req.body.name ? req.body.name : host.name;
    host.mac = req.body.mac;
    host.status = 'New';
    console.log(host);
    // save the host and check for errors
    host.save(function (err) {
        host.id = host._id;
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else
            res.json({
                message: 'New host created!',
                data: host
            });
    });
};
// Handle view host info
exports.view = function (req, res) {
    Host.findById(req.params.host_id, function (err, host) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else 
            res.json({
                message: 'Host details loading..',
                data: host
            });
    });
};
// Handle update host info
exports.update = function (req, res) {
    Host.findById(req.params.host_id, function (err, host) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else {
            host.name = req.body.name ? req.body.name : host.name;
            host.mac = req.body.mac;
            // save the Host and check for errors
            host.save(function (err) {
                if (err)
                    res.json({
                        status: "error",
                        message: err,
                    });
                else
                    res.json({
                    message: 'Host Info updated',
                    data: host
                });
            });
        }        
    });
};
// Handle delete host
exports.delete = function (req, res) {
    Host.remove({
        _id: req.params.host_id
    }, function (err, host) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else 
            res.json({
                status: "success",
                message: 'Host deleted'
            });
    });
};


// Handle status host info
exports.status = function (req, res) {
    var query = { "mac": req.query.mac };
    Host.find(query, function (err, hosts) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else {
            res.json({
                status: "success",
                message: "Hosts retrieved successfully",
                data: hosts
            });
        }        
    });
};

// Handle create host actions
exports.register = function (req, res) {
    var host = new Host();
    host.name = req.body.name;
    host.mac = req.body.mac;
    host.status = 'New';
    // save the host and check for errors
    host.save(function (err) {
        host.id = host._id;
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else
            res.json({
                message: 'New host created!',
                data: host
            });
    });
};

// Handle active host
exports.active = function (req, res) {
    var query = { "mac": req.query.mac, "status": "New"};
    Host.find(query, function (err, hosts) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else {
            hosts.forEach(host => {
                host.status = "Ok";
                host.save();
            });
            res.json({
                status: "success",
                message: "Hosts actived successfully",
                data: hosts.length
            });
        }        
    });
};