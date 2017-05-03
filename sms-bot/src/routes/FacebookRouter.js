const router = require('express').Router();

const validateParams = require(__base + '/message/RouteValidator').validateParams;
const rejectError = require(__base + '/utils/utils').rejectError;
const isNullOrUndefined = require(__base + '/utils/utils').isNullOrUndefined;

// TODO: maybe there is a better way to store this
const MESSENGER_VALIDATION_TOKEN = process.env.MESSENGER_VALIDATION_TOKEN;
const FacebookBot = require('../api/FacebookBot');

class FacebookRouter {
  constructor(botApi) {
    this.router = router;
    this.botApi = botApi

    // TODO: one day this will be grabbed from some sort of config depending on which user called it
    // USE PAGE_ID in request to get the data
    this.facebookBot = new FacebookBot(process.env.MESSENGER_PAGE_ACCESS_TOKEN);
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
      var params = {
        userId: req.params.userId,
        integrationType: 'facebookBot'
      }

      // TODO: Verify request is from facebook
      // https://developers.facebook.com/docs/messenger-platform/webhook-reference#security
      validateParams(params)
      .then(() => {
        var data = req.body;
        if (data.object == 'page') {
          data.entry.forEach((entry) => {

            entry.messaging.forEach((msg) => {
              console.log(msg)
              this.facebookFlow(msg)
            }) // end messaging

          }); // end entry
        } // end data.object
      }); // end then

      return res.sendStatus(200);

    });
  }

  parseMessage(data) {
    if (!data) {
      return rejectError(400, `receivedData is undefined`);
    }

    let missingParams = [];

    if (isNullOrUndefined(data.sender.id)) {
      missingParams.push("senderId");
    }
    if (isNullOrUndefined(data.message.text)) {
      missingParams.push("message");
    }

    if (missingParams.length > 0) {
      return rejectError(400, `Missing required parameters:${missingParams}`);
    }

    return Promise.resolve({
      message: data.message.text,
      number: data.sender.id
    })
  }

  facebookFlow(reqBody) {
    let senderId = null;
    this.parseMessage(reqBody)
      .then(messageAndNumber => {
        senderId = messageAndNumber.number
        return this.botApi.handleMessage(messageAndNumber.message, messageAndNumber.number);
      })
      .then(response => {
        this.facebookBot.sendTextMessage(senderId, response);
      })
      .catch(err => {
        this.facebookBot.sendTextMessage(senderId, err.message);
        console.error(err);
      });
  }

  getRouter() {
    return this.router;
  }
}

module.exports = FacebookRouter;

/*

//TODO: we should make a separate middleware for auth, that doesn't get confused with the incoming message
*/
