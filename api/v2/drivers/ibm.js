const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');
var ExecutionModel = require('../models/executionModel');
var Data = require('../models/dataModel');
var DataFunctions = require('../services/dataFunctions');


const STEP_SET_DATA = "Set Data";
const STEP_GET_DATA = "Get Data";
const STEP_SET_CONTEXT = "Set Context";
const STEP_GET_CONTEXT = "Get Context";
const STEP_SEND_MESSAGE = "Send Message";
const STEP_RECEIVE_MESSAGE = "Receive Message";

var assistantId;
var assistant;

var sessionId = '';
var current_context = {
  'global': {
    'system': {
      'user_id': 'oggybug'
    }
  },
  'skills': {
    'main skill': {
      'user_defined': {
        'account_number': '123456'
      }
    }
  }
}
var current_response = null;
var current_step = null;
var step = 0;
var scenario = null;
var execution = null;

function nextStep() {
  console.log("##### next step");
  if(step >= scenario.steps.length) {
    closeSession();
    return;
  }
  console.log(">>> step: "+step);
  current_step = scenario.steps[step];
  console.log(">>> current step: "+current_step);
  step++;
  var rs = false;
  if(current_step.type == STEP_SET_DATA) {
    sendData(current_step);    
  } else if(current_step.type == STEP_GET_DATA) {
    checkData(current_step);
  } else if(current_step.type == STEP_SET_CONTEXT) {
    current_context.skills["main skill"].user_defined[current_step.name] = current_step.value;
    current_step.result = true;
    nextStep();
  } else if(current_step.type == STEP_GET_CONTEXT) {
    rs = current_context.skills["main skill"].user_defined[current_step.name] == current_step.value;
    console.log(">>> result step: "+rs);
    current_step.result = rs;
    nextStep();
  } else if(current_step.type == STEP_SEND_MESSAGE) {    
    sendMessageStep(current_step);
  } else if(current_step.type == STEP_RECEIVE_MESSAGE) {
    receiveMessageStep(current_step);    
  } else {
    console.log(">>> step none");
    nextStep();
  }
}

// Send message to assistant.
function sendMessageStep(step) {
  console.log("##### input");
  messageInput = {
    message_type: 'text',
    text: step.data.text,
    options: {
      return_context: true
    }
  }
  console.log(messageInput);
  current_context.skills["main skill"].user_defined["my_conversation"] = sessionId;
  console.log("##### current context");
  console.log(current_context.skills["main skill"].user_defined)
  console.log("##### send message");
  current_response = null;  
  console.log("##### send message config");
  message_config = { assistantId: assistantId, sessionId: sessionId, input: messageInput, context: current_context }  
  console.log(message_config)
  assistant.message(message_config)
  .then (res => {
    processResponse(res); 
  })
  .catch(err => {
    console.log(err); // something went wrong 
    closeSession();
  }); 
}
function receiveMessageStep(step) {
  rs = current_response == current_step.data.text;  
  item = { 
    type: current_step.type, 
    data: {
      expected: current_step.data.text,
      received: current_response,
      result: rs
    }
  };
  execution.steps.push(item);
  nextStep();
}

// Processe a resposta.
function processResponse(response) {
  console.log("##### process response");
  console.log(">>> response: "+ JSON.stringify(response));
  current_context = response.result.context;
  if (response.result.output.generic) {
    if (response.result.output.generic.length > 0) {
      if (response.result.output.generic[0].response_type === 'text') {
        current_response = response.result.output.generic[0].text; 
        current_step.result = true;

        item = { 
          type: current_step.type, 
          data: {
            expected: current_step.data.text,
            received: current_step.data.text,
            result: true
          }
        };
        execution.steps.push(item);
        nextStep();
      }
    }
  }    
}

function closeSession() {
  console.log("##### close session");
  // We're done, so we close the session.
  assistant.deleteSession({ assistantId: assistantId, sessionId: sessionId, })
  .then(res => {
    endSuccess();    
  }).catch(err => {
      console.log(err);
  }); 
}

function createSession() {
  console.log("##### create session");
  // Create session.
  assistant.createSession({ assistantId: assistantId })
  .then (res => {  
    sessionId = res.result.session_id;      
    console.log(">>> session_id: "+ sessionId);
    execution.session = sessionId
    execution.save();
    nextStep();
  }).catch(err => {
      console.log(err); // something went wrong 
  });
}

function sendData(step) {
  console.log("=> send data")
  filter = {name: step.name, user: execution.user}
  Contract.findOne(filter, function (err, contract) {
      if (err) {
        console.log("=> find error")
        current_step.result = false;
        nextStep();
      } else {        
        var data = new Data();
        data.user = execution.user;
        data.session = sessionId;
        data.execution = execution._id;
        data.contract = contract.name;
        data.key = DataFunctions.getKey(contract, step.data);
        data.values = DataFunctions.converter(contract, step.data);
        data.save(function (err) {
            if (err) {
              current_step.result = false;
              nextStep();
            } else {
              current_step.result = true;
              nextStep();
            }            
        });
      }
  });
}

function checkData(step) {
  filter = {name: step.name, user: execution.user}
  Contract.findOne(filter, function (err, contract) {
      if (err) {
        current_step.result = false;
        nextStep();
      } else {
        filter = {contract: contract.name, user: execution.user, execution: execution._id}
        Data.find(filter, function (err, datas) {
          if (err) {
            current_step.result = false;
            nextStep();
          } else {
            current_step.result = false;
            result = DataFunctions.transformAll(datas);
            result.forEach((item) => {
              var rs = true
              contract.fields.forEach((field) => {
                if(item[field] == step.data[field]) {
                  //pass
                } else {
                  rs = false
                }
              })
              if(rs) {
                current_step.result = true;
              }
            })
            nextStep();
          }
        });
      }
  });
}

var exports = module.exports = {};

exports.execute = function(scenarioModel) {
  scenario = scenarioModel;
  step = 0;
  current_response = null;
  current_step = null;  
  execution = null;
  sessionId = null;
  current_context = {
    'global': {
      'system': {
        'user_id': 'oggybug'
      }
    },
    'skills': {
      'main skill': {
        'user_defined': {
          'oggybug_version': '1.0.0'
        }
      }
    }
  }

  assistantId = scenario.chatbot.config.workspace;
  assistant = new AssistantV2({
    authenticator: new IamAuthenticator({ apikey: scenario.chatbot.config.apikey }),
    url: 'https://gateway.watsonplatform.net/assistant/api/',
    version: '2018-09-19'
  });

  if(scenario.steps == null || scenario.steps === undefined || scenario.steps.length == 0) {
      console.log("scenario sem steps");
      return;
  }
  execution = new ExecutionModel();
  execution.name = scenario.name;
  execution.scenario = {
    _id: scenario._id,
    name: scenario.name
  };
  execution.chatbot = {
    _id: scenario.chatbot._id,
    name: scenario.chatbot.name
  };
  execution.user = scenario.user._id;
  execution.control = {
    started_at: new Date(),
    fineshed_at: new Date(),
    status: 'Created'
  },
  execution.steps = [];
  execution.save()
  createSession();
};

function endSuccess() {
  execution.control.fineshed_at = new Date()
  execution.control.status = "Success"
  execution.save();
}

function endError() {
  execution.control.fineshed_at = new Date()
  execution.control.status = "Error"
  execution.save();
}