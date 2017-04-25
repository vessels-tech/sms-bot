/**
 * MessageRouter allows us to integrate with a number of APIs
 * It wraps around the express router object
 * Nexmo: https://docs.nexmo.com/messaging/sms-api/api-reference#inbound
 */


/**
 * Perhaps incoming messages should have the format:
   POST /incoming/{userId}/{integrationType}

  - We can verify and authenticate the user based on some JWT token...
    although this may be tricky, as each service will different options
  - How do we handle replies here? Or I guess each user will have a reply endpoint for us to hit...
 */
const router = require('express').Router();
const bodyParser = require('body-parser');
const rejectError = require('./utils/utils').rejectError;

// TODO: maybe there is a better way to store this
const MESSENGER_VALIDATION_TOKEN = process.env.MESSENGER_VALIDATION_TOKEN;
const FacebookBot = require('./FacebookBot');
const facebookBot = new FacebookBot(process.env.MESSENGER_PAGE_ACCESS_TOKEN);

const integrationTypes = require('./utils/enums').IntegrationTypes;
const FacebookRouter = require('./routes/FacebookRouter');
const facebookRouter = new FacebookRouter();
const validateParams = require('./routes/utils').validateParams;

class MessageRouter {
  constructor(config) {
    //The underlying express router object
    this.router = router;
    this.router.use(bodyParser.json()); // for parsing application/json
    this.router.use(facebookRouter.getRouter());

    this.botApi = config.botApi;
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.router.use(function(req, res, next) {
      //TODO: authenticate user from token or something
      next();
    });
  }

  setupRoutes() {
    this.router.get('/incoming/:userId/:integrationType', (req, res) => {
      return validateParams(req.params)
        .then(() => this.parseMessage(req.query, req.params.integrationType))
        .then(messageAndNumber => {
          return this.botApi.handleMessage(messageAndNumber.message, messageAndNumber.number);
        })
        .then(response => {
          res.send({message:response});
        })
        .catch(err => {
          console.error(err);

          let statusCode = 500;
          if (err.statusCode) {
            statusCode = err.statusCode;
          }

          res.status(statusCode).send({message:err.message, status:statusCode});
        });
    });

    this.router.post('/incoming/:userId/:integrationType', (req, res) => {
      var senderId = null; // for facebook
      return validateParams(req.params)
        .then(() => this.parseMessage(req.body, req.params.integrationType))
        .then(messageAndNumber => {
          return this.botApi.handleMessage(messageAndNumber.message, messageAndNumber.number);
        })
        .then(response => {
          res.send({message:response});
        })
        .catch(err => {
          console.error(err);

          let statusCode = 500;
          if (err.statusCode) {
            statusCode = err.statusCode;
          }

          res.status(statusCode).send({message:err.message, status:statusCode});
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

    if (!receivedData.message) {
      missingParams.push("message");
    }

    if (!receivedData.number) {
      missingParams.push("number");
    }

    data = receivedData;

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

module.exports = MessageRouter;
