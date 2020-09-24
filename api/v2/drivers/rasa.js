const Rasa = require('./rasa-api/Rasa')
var uuid = require('uuid');

const STEP_SET_CONTEXT = "Set Context";
const STEP_GET_CONTEXT = "Get Context";
const STEP_SEND_MESSAGE = "Send Message";
const STEP_RECEIVE_MESSAGE = "Receive Message";

var rasa;

var current_form = null;
var current_action = null;
var current_intend = null;
var current_entities = [];
var current_slots = [];
var current_response = null;
var current_step = null;
var step = 0;
var execution = null;
var putforth;

var scenarios = null
var index = null
var sessionId = null;

var current_prefix = ""
var current_suffix = ""

var actions = []
var forms = []

function log(title, description) {
  console.log("############> "+ title)
  console.log(description)
  //putforth.postLogs({session: sessionId, title: title, description: description});
}

function nextStep() {
  if(step >= execution.steps.length) {
    closeSession();
    return;
  }
  current_step = execution.steps[step];
  step++;  
  log("Iniciando etapa ", JSON.stringify(current_step));
  if(current_step.type == STEP_SET_CONTEXT) {
    postEvent(current_step)    
  } else if(current_step.type == STEP_GET_CONTEXT) {
    getEvent(current_step)
  } else if(current_step.type == STEP_SEND_MESSAGE) {
    input = {
      text: current_step.text,
      sender: "user"
    }
    sendMessage(input);
  } else if(current_step.type == STEP_RECEIVE_MESSAGE) {
    getMessage();
  } else {
    nextStep();
  }
}

// Send message to assistant.
function sendMessage(message) {  
  log("Enviando mensagem ", JSON.stringify(message));
  current_response = null;
  rasa.postMessages(message).then((res) => {
    current_entities = res.latest_message.entities;    
    current_slots = res.slots
    if(res.active_form) {
      current_form = res.active_form.name;    
    } else {
      current_form = null;    
    }
    current_step.result = true;
    nextStep();
  }).catch((error) => {
    console.log(error);
    closeSession();
  })
}

function loadEntities() {
  if(current_form && current_entities.length > 0) {
    log("Carregando entidades", JSON.stringify(current_entities));
    events = [{
      "event": "slot",
      "name": current_slots.requested_slot,
      "value": null
    }]
    current_entities.forEach((entity) => {
      events[0].value = entity.value
    })
    return rasa.postEvents(events)
  }  
}

function executeAction() {
  var inputAction = { name: current_action } 
  log("Action", JSON.stringify(inputAction));
  rasa.postExecute(inputAction).then((res) => {
    log("Executando action", JSON.stringify(res));
    var rs = false
    var split = current_step.text.split('\n');
    split.forEach(text => {
      if(!rs) {
        rs = res.messages[0].text == text;
        if(rs) {
          current_step.value = res.messages[0].text;
          current_step.valid = text;
        }
      }
    });
    current_step.result = rs;    
    nextStep();
  })
}

// Send message to assistant.
function getMessage() {
  if(current_form && current_entities.length > 0) {
    loadEntities().then((res) => {
      current_entities = []
      getMessage()
    })
  } else if(current_form) {
    executeAction()
  } else {
    rasa.postPredict().then((res) => {
      log("Prevendo ações", JSON.stringify(res));
      current_action = res.scores[0].action
      if(current_action == "action_listen") {
        nextStep();
      } else {
        executeAction()
      }      
    }).catch((error) => {
      closeSession();
    })
  }
  
}

function postEvent(step) {
  var event = {
    "event": "slot", 
    "name": current_step.name,
    "value": current_step.value
  }
  rasa.postEvents(event).then((res) => {
    log("Eventos atualizados", JSON.stringify(res));
    current_event = res;
    current_step.result = true;
    nextStep();
  }).catch((error) => {
    closeSession();
  })
}

function getEvent() {
  if(current_form && current_entities.length > 0) {
    loadEntities().then((res) => {
      current_entities = []
      getEvent()
    })
  } else {
    rasa.getTracker().then((res) => {
      log("Recuperando eventos", JSON.stringify(res));
      current_event = res.events;
      current_step.result = false;
      res.events.forEach(function(event) {
        if(event.name == current_step.name) {
          current_step.result = current_step.value == event.value;
          current_step.valid = event.value;
        }
      });    
      nextStep();
    }).catch((error) => {
      closeSession();
    })
  }
  
}

function closeSession() {  
  log("Fechando sessão", "------------------------------");
  var status = true
  execution.steps.forEach(step => {
    if(status && !step.result) {
      status = false
    }
  })
  execution.status = status  
  console.log("Execução do cenário '" + execution.name + "' com resultado '" + status + "'.");
  console.log(execution);
  console.log("---------------------------");

  index++;
  //putforth.excecuteScenario(scenarios, index)
}

function createSession() {
  log("Inicio da execução", "")
  nextStep();  
}

function createExecution(agent, scenario) {
  execution = {};  
  execution.session = sessionId;
  execution.chatbot = agent.type;
  execution.name = scenario.name;
  execution.description = scenario.description;
  execution.steps = [];
  scenario.steps.forEach(step => {
      item = { type: step.type, text: step.text, name: step.name, value: step.value, result: false };
      execution.steps.push(item);
  });
  return execution;
}

function createRasa(agent) {
  rasa = new Rasa(agent.endpoint, agent.apikey)
}

var exports = module.exports = {};
  
exports.execute = function(agent, scenario) {
  sessionId = uuid.v1();
  step = 0;
  current_response = null;
  current_step = null;  
  execution = null;
  current_event = null;

  if(scenario.chatbot.endpoint == null) {
    console.log("Configuração do agente sem servidor");
    return;
  }

  if(scenario.chatbot.apikey == null) {
    console.log("Configuração do agente sem apikey (token)");
  }

  if(scenario.steps == null || scenario.steps === undefined || scenario.steps.length == 0) {
      console.log("scenario sem steps");
      return;
  }

  createExecution(scenario.chatbot, scenario)
  createRasa(scenario.chatbot)
  createSession();
};
