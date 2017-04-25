const router = require('express').Router();
const validateParams = require('./utils').validateParams;
const rejectError = require('../utils/utils').rejectError;

// TODO: maybe there is a better way to store this
const MESSENGER_VALIDATION_TOKEN = process.env.MESSENGER_VALIDATION_TOKEN;
const FacebookBot = require('../FacebookBot');
const facebookBot = new FacebookBot(process.env.MESSENGER_PAGE_ACCESS_TOKEN);

class FacebookRouter {
  constructor(botApi) {
    this.router = router;
    this.setupAuth();
    this.setupPostRoute();
  }
  
  setupAuth() {
    // catch facebookBot webhook authentication request
    // https://developers.facebook.com/docs/messenger-platform/guides/setup#webhook_setup
    this.router.get('/incoming/1/facebookBot', function(req, res) {
      if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === MESSENGER_VALIDATION_TOKEN) {
        return res.status(200).send(req.query['hub.challenge']);
      }
      
      console.error("Failed validation. Make sure the validation tokens match.");
      return res.sendStatus(403);
    });
  }
  
  setupPostRoute() {
    this.router.post('/incoming/:userId/facebookBot', (req, res) => {
      var senderId = null; // for facebook
      return validateParams(req.params)
        .then(() => this.parseMessage(req.body, req.params.integrationType))
        .then(messageAndNumber => {
          // facebook requires confirmation asap
          res.sendStatus(200);
          senderId = messageAndNumber.number

          return this.botApi.handleMessage(messageAndNumber.message, messageAndNumber.number);
        })
        .then(response => {
          // already sent facebook status
          facebookBot.sendTextMessage(senderId, response);
        })
        .catch(err => {
          facebookBot.sendTextMessage(senderId, err.message);
          console.error(err);

          let statusCode = 500;
          if (err.statusCode) {
            statusCode = err.statusCode;
          }
        });
    });
  }
  
  parseMessage(receivedData, integrationType) {
    //TODO: parse the req.data differently based on the integrationType

    if (!receivedData) {
      return rejectError(400, `receivedData is undefined`);
    }

    let missingParams = [];
    let data = {};
    
    data = facebookBot.formatRequest(receivedData);
    
    if (missingParams.length > 0) {
      return rejectError(400, `Missing required parameters:${missingParams}`);
    }

    return Promise.resolve({
      message: data.message,
      number: data.number
    })
  }
  
  getRouter() {
    return this.router;
  }
}

module.exports = FacebookRouter;

/*

//TODO: we should make a separate middleware for auth, that doesn't get confused with the incoming message
*/
