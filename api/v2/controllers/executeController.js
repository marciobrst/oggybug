UserModel = require('../models/userModel');
ScenarioModel = require('../models/scenarioModel');
ChatbotModel = require('../models/chatbotModel');

IBMDriver = require('../drivers/ibm');
RasaDriver = require('../drivers/rasa');

exports.executeBody = function (req, res) {
    UserModel.findById(req.userId, function (err, modelUser) {
        if (err)
            res.status(500).json({ message: err, });
        else {
            let scenario = req.body;
            scenario.user = modelUser
            console.log("###> Scenario to execute")
            console.log(scenario)
            if(scenario.chatbot.type == 'IBM Watson') {
                IBMDriver.execute(scenario);
                res.json({
                    status: "success",
                    message: 'Scenario executed',
                });
            } else if(scenario.chatbot.type == 'Rasa') {
                RasaDriver.execute(req.userId, scenario);
                res.json({
                    status: "success",
                    message: 'Scenario executed',
                });
            } else {
                res.status(400).json({
                    status: "error",
                    message: "Driver not found",
                }); 
            }          
            
        }
    })
    
};

exports.executeParam = function (req, res) {
    UserModel.findById(req.params.scenario_id, function (err, modelUser) {
        if (err)
            res.status(500).json({ message: err, });
        else {
            ScenarioModel.findById(req.params.scenario_id, function (err, modelScenario) {
                if (err)
                    res.status(500).json({ message: err, });
                else if(req.userId != modelScenario.user) {
                    res.status(403).json({ message: "Permission denied", });
                } else {
                    ChatbotModel.findById({ _id: req.params.chatbot_id }, function (err, modelChatbot) {
                        if (err)
                            res.status(500).json({ message: err, });
                        else if(req.userId != modelChatbot.user) {
                            res.status(403).json({ message: "Permission denied", });
                        } else {
                            modelScenario.user = modelUser
                            modelScenario.chatbot = modelChatbot
                            if(scenario.chatbot.type == 'IBM Watson') {
                                IBMDriver.execute(modelScenario);
                            } else if(scenario.chatbot.type == 'Rasa') {
                                RasaDriver.execute(req.userId, modelScenario);
                            } else {
                                res.status(400).json({
                                    status: "error",
                                    message: "Driver not found",
                                }); 
                            }
                        }
                            
                    });
                }
            });
        }
    })
    
};