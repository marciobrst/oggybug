// Initial Setup
var port = process.env.PORT || 9090;
var mongoUrl =  process.env.MONGODB_URI || 'mongodb://localhost:27017/oggybug';

// Import express
let express = require('express');
let cors = require('cors');
// Import Body parser
let bodyParser = require('body-parser');
//var cookieParser = require('cookie-parser');
// Import Mongoose
let mongoose = require('mongoose');

let secutiry = require('./api/v2/services/security');
let signupController = require('./v2/controllers/signupController');

// Initialise the app
let app = express();

// Import routes
let apiRoutes = require("./api/v2/routes");

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors({ origin: [ "https://oggybug.herokuapp.com" ], allowedHeaders: ["Origin", "X-Request-Width", "Content-Type", "Accept", "x-access-token"], optionsSuccessStatus: 200 }))
app.use(secutiry.verifyJWT)



function preparar_mongo() {
    // Connect to Mongoose and set connection variable
    mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true});
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Error connecting db:'));
    db.once('open', function() {
        console.log("Db connected successfully")
        
    });    
}
setTimeout(preparar_mongo, 10000);


// Send message for default URL
app.get('/', (req, res) => res.send(''));

// Use Api routes in the App
app.use('/api', apiRoutes);
// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running on port " + port);
});