// security.js
// Import user model
var jwt = require('jsonwebtoken');
User = require('../models/userModel');
const SECRET = process.env.SECRET || "0ggyBug2020";

// Handle index actions
exports.login = function (req, res) {
    User.findOne({email: req.body.email, password: req.body.password}, function (err, user) {
        if (err)
            res.status(500).json({
                status: "error",
                message: err,
            });
        else if(user) {
            var userId = user._id;
            var userName = user.name;
            var token = jwt.sign({ userId }, SECRET, {
                expiresIn: 1*24*60*60
            });
            res.status(200).send({ auth: true, name: userName, token: token, expires_in: 60*60 });
        }
        else {
            res.status(401).json({
                status: "error",
                message: err,
            });
        }
            
    });
};

// Handle index actions
exports.get = function (req, res) {    
    User.findById(req.userId, function (err, user) {
        if (err)
            res.status(500).json({
                status: "error",
                message: err,
            });
        else {
            res.status(200).send(user);
        }
            
    });
};

exports.verifyJWT =  function(req, res, next) {
    if (req.method.includes('OPTIONS')) {
        return next();
    } else if (req.originalUrl.includes('signup')) {
        return next();
    } else if (req.originalUrl.includes('login')) {
        return next();
    }
    var token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, SECRET, function(err, decoded) {
            if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
            req.userId = decoded.userId;
            next();    
        });
    } else {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    
}

exports.cors = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://oggybug.herokuapp.com");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
}