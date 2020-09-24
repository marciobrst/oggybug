// routes.js
// Initialize express router
let router = require('express').Router();
var secutiry = require('./services/secutiry');
// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to OggyBug crafted with love!',
    });
});
// Import contact controller
var userController = require('./controllers/userController');
var agentController = require('./controllers/agentController');
var hostController = require('./controllers/hostController');
var scenarioController = require('./controllers/scenarioController');
var executionController = require('./controllers/executionController');
var logController = require('./controllers/logController');
var contractController = require('./controllers/contractController');
var dataController = require('./controllers/dataController');

var chatbotControllerV2 = require('../v2/controllers/chatbotController');
var integrationControllerV2 = require('../v2/controllers/integrationController');
var scenarioControllerV2 = require('../v2/controllers/scenarioController');

router.route('/login')
    .post(secutiry.login);

router.route('/user')
    .get(secutiry.get);

router.route('/init')
    .get(userController.init);    

// User routes
//router.route('/users')
//    .get(userController.index)
//    .post(userController.new);
//router.route('/users/:user_id')
//    .get(userController.view)
//    .patch(userController.update)
//    .put(userController.update)
//    .delete(userController.delete);

router.route('/contracts')
    .get(contractController.index)
    .post(contractController.new);
router.route('/contracts/:contract_id')
    .get(contractController.view)
    .patch(contractController.update)
    .put(contractController.update)
    .delete(contractController.delete);  

// Agent routes
router.route('/logs')
    .get(logController.index)
    .post(logController.new);
router.route('/logs/:log_id')
    .get(logController.view)
    .patch(logController.update)
    .put(logController.update)
    .delete(logController.delete);   



// Agent routes
router.route('/agents')
    .get(agentController.index)
    .post(agentController.new);
router.route('/agents/:agent_id')
    .get(agentController.view)
    .patch(agentController.update)
    .put(agentController.update)
    .delete(agentController.delete);    


router.route('/executions/count')
    .get(executionController.count)
router.route('/executions')
    .get(executionController.index)
    .post(executionController.new);
router.route('/executions/:execution_id')
    .get(executionController.view)
    .patch(executionController.update)
    .put(executionController.update)
    .delete(executionController.delete);

// Host routes
router.route('/hosts/status')
    .get(hostController.status);
    router.route('/hosts/register')
    .post(hostController.register)
    router.route('/hosts/active')
    .get(hostController.active);
router.route('/hosts')
    .get(hostController.index)
    .post(hostController.new);
router.route('/hosts/:host_id')
    .get(hostController.view)
    .patch(hostController.update)
    .put(hostController.update)
    .delete(hostController.delete);

// Scenario routes
router.route('/scenarios/:scenario_id/execute')
    .get(scenarioController.execute);
router.route('/scenarios/count')
    .get(scenarioController.count)
router.route('/scenarios')
    .get(scenarioController.index)
    .post(scenarioController.new);
router.route('/scenarios/:scenario_id')
    .get(scenarioController.view)
    .patch(scenarioController.update)
    .put(scenarioController.update)
    .delete(scenarioController.delete);

router.route('/data/:contract')
    .get(dataController.index)
    .post(dataController.new);
router.route('/data/:contract/:key')
    .get(dataController.view)
    .patch(dataController.update)
    .put(dataController.update)
    .delete(dataController.delete);


router.route('/execute')
    .post(executionController.execute);

// Export API routes
module.exports = router;