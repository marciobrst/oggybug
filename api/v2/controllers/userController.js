// userController.js
// Import user model
User = require('../models/userModel');

// Handle create user actions
exports.new = function (req, res) {
    var user = new User();
    user.name = req.body.name;
    user.login = req.body.login;
    user.password = req.body.password;
    // save the user and check for errors
    user.save(function (err) {
        user.id = user._id;
        if (err)
            res.json({
                status: "error",
                message: err,
            });
        else
            res.status(201).json(user);
    });
};

// Handle view user info
exports.view = function (req, res) {
    User.findById(req.userId, function (err, user) {
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
    User.findById(req.userId, function (err, user) {
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
