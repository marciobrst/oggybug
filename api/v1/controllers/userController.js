// userController.js
// Import user model
User = require('../models/userModel');
// Handle index actions
exports.index = function (req, res) {
    User.get(function (err, users) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else 
            res.json({
                status: "success",
                message: "Users retrieved successfully",
                data: users
            });
    });
};
// Handle create user actions
exports.new = function (req, res) {
    var user = new User();
    user.name = req.body.name;
    user.login = req.body.login;
    user.password = req.body.password;
    user.status = req.body.status;
    // save the user and check for errors
    user.save(function (err) {
        user.id = user._id;
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else
            res.json({
                message: 'New user created!',
                data: user
            });
    });
};
// Handle view user info
exports.view = function (req, res) {
    User.findById(req.params.user_id, function (err, user) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else 
            res.json({
                message: 'User details loading..',
                data: user
            });
    });
};
// Handle update user info
exports.update = function (req, res) {
    User.findById(req.params.user_id, function (err, user) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else {
            user.name = req.body.name;
            user.login = req.body.login;
            user.password = req.body.password;
            user.status = req.body.status;
            // save the User and check for errors
            user.save(function (err) {
                if (err)
                    res.json({
                        status: "error",
                        message: err,
                    });
                else
                    res.json({
                    message: 'User Info updated',
                    data: user
                });
            });
        }        
    });
};
// Handle delete user
exports.delete = function (req, res) {
    User.remove({
        _id: req.params.user_id
    }, function (err, user) {
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else 
            res.json({
                status: "success",
                message: 'User deleted'
            });
    });
};

exports.init = function(req, res) {
    var user = new User();
    user.name = "ADMIN";
    user.login = "admin";
    user.password = "admin";
    user.status = "Ativo";
    // save the user and check for errors
    user.save(function (err) {
        user.id = user._id;
        if (err)
            console.log("usuario nao registrado" + err)
        else
            console.log("usuario registrado")
    });
    res.json({
        status: "success",
        message: 'Admin created'
    });
}    
