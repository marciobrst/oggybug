const request = require('request')
const requestApi = require('./API')
const url = require('url')
var uuid = require('uuid');

function Rasa(endpoint, token, timeout) {
  this.sessionId = uuid.v1();
  let conf = {
    baseUrl: endpoint,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    qs: {
      token: token || '',
    },
    timeout: timeout || 20000
  }
  const requestWrapper = request.defaults(conf)
  this.request = requestApi(requestWrapper)
  this.actions = {
    get_tracker: {
      method: 'GET',
      uri: '/conversations/'+this.sessionId+'/tracker'
    },
    post_events: {
      method: 'POST',
      uri: '/conversations/'+this.sessionId+'/tracker/events'
    },
    put_events: {
      method: 'PUT',
      uri: '/conversations/'+this.sessionId+'/tracker/events'
    },
    get_story: {
      method: 'GET',
      uri: '/conversations/'+this.sessionId+'/story'
    },
    post_messages: {
      method: 'POST',
      uri: '/conversations/'+this.sessionId+'/messages'
    },
    post_execute: {
      method: 'POST',
      uri: '/conversations/'+this.sessionId+'/execute'
    },    
    post_parse: {
      method: 'POST',
      uri: '/model/parse'
    },    
    get_domain: {
      method: 'GET',
      uri: '/domain'
    },    
    post_predict: {
      method: 'POST',
      uri: '/conversations/'+this.sessionId+'/predict'
    }
  }
}

Rasa.prototype.send = function (endpoint, body) {  
  let payload = this.actions[endpoint]  
  return new Promise((resolve, reject) => {
    if (['POST', 'PUT'].indexOf(payload.method) !== -1) {
      try {
        payload.body = JSON.stringify(body)
      } catch (e) {
        return reject(e)
      }
    } else {
      payload.qs = body
    }
    this.request(payload, (err, res) => {
      if (err) {
        return reject(err)
      }
      return resolve(res)
    })
  })
}

Rasa.prototype.getTracker = function () {
  return this.send('get_tracker')
}

Rasa.prototype.postEvents = function (body) {
  return this.send('post_events', body)
}

Rasa.prototype.putEvents = function (body) {
  return this.send('put_events', body)
}

Rasa.prototype.getStory = function () {
  return this.send('get_story')
}

Rasa.prototype.postMessages = function (body) {
  return this.send('post_messages', body)
}

Rasa.prototype.postParse = function (body) {
  return this.send('post_parse', body)
}

Rasa.prototype.postExecute = function (body) {
  return this.send('post_execute', body)
}

Rasa.prototype.getDomain = function () {
  return this.send('get_domain')
}

Rasa.prototype.postPredict = function (body) {
  return this.send('post_predict', body)
}

module.exports = Rasa
