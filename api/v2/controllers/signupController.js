// userController.js
// Import user model
User = require('../models/userModel');

// Handle create user actions
exports.new = function (req, res) {
    var user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;

    User.findOne({email: user.email}, function (err, user) {
        if (err)
            res.status(500).json({
                status: "error",
                message: err,
            });
        else if(user) {
            res.status(400).json({
                status: "error",
                message: "E-mail already registered!",
            });
        } else {
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
        }
    });

    
};