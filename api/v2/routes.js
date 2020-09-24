// routes.js
// Initialize express router
let router = require('express').Router();
var secutiry = require('./services/security');

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to OggyBug crafted with love!',
    });
});

var signupController = require('../v2/controllers/signupController');
var userControllerV2 = require('../v2/controllers/userController');
var dataControllerV2 = require('../v2/controllers/dataController');
var chatbotControllerV2 = require('../v2/controllers/chatbotController');
var integrationControllerV2 = require('../v2/controllers/integrationController');
var scenarioControllerV2 = require('../v2/controllers/scenarioController');
var executionController = require('../v2/controllers/executionController');

var executeController = require('../v2/controllers/executeController');

router.route('/signup')
    .post(signupController.new);

router.route('/login')
    .post(secutiry.login);


router.route('/user')
    .get(secutiry.get);

// V2 routes

router.route('/v2/users').post(userControllerV2.new);
router.route('/profile').get(userControllerV2.view);
router.route('/profile/update').put(userControllerV2.update);

router.route('/v2/data/:contract')
    .get(dataControllerV2.index)
    .post(dataControllerV2.new);
router.route('/v2/data/:contract/:key')
    .get(dataControllerV2.view)
    .patch(dataControllerV2.update)
    .put(dataControllerV2.update)
    .delete(dataControllerV2.delete);

router.route('/v2/chatbots')
    .get(chatbotControllerV2.index)
    .post(chatbotControllerV2.new);
router.route('/v2/chatbots/:model_id')
    .get(chatbotControllerV2.view)
    .patch(chatbotControllerV2.update)
    .put(chatbotControllerV2.update)
    .delete(chatbotControllerV2.delete); 

router.route('/v2/integrations')
    .get(integrationControllerV2.index)
    .post(integrationControllerV2.new);
router.route('/v2/integrations/:model_id')
    .get(integrationControllerV2.view)
    .patch(integrationControllerV2.update)
    .put(integrationControllerV2.update)
    .delete(integrationControllerV2.delete);  
    
router.route('/v2/scenarios')
    .get(scenarioControllerV2.index)
    .post(scenarioControllerV2.new);
router.route('/v2/scenarios/:model_id')
    .get(scenarioControllerV2.view)
    .patch(scenarioControllerV2.update)
    .put(scenarioControllerV2.update)
    .delete(scenarioControllerV2.delete);  



router.route('/v2/executions/count')
    .get(executionController.count)
router.route('/v2/executions')
    .get(executionController.index)
router.route('/v2/executions/:model_id')
    .get(executionController.view)
    .delete(executionController.delete);

router.route('/v2/scenarios/:scenario_id/chatbots/:chatbot_id')
    .post(executeController.executeParam);

router.route('/v2/execute')
    .post(executeController.executeBody);

module.exports = router;