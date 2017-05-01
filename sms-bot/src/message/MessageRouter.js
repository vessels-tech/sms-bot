/**
 * MessageRouter allows us to integrate with a number of APIs
 * It wraps around the express router object
 * Nexmo: https://docs.nexmo.com/messaging/sms-api/api-reference#inbound
 */


/**
 * Perhaps incoming messages should have the format:
   POST /incoming/{serviceId}/{integrationType}

  - We can verify and authenticate the user based on some JWT token...
    although this may be tricky, as each service will different options
  - How do we handle replies here? Or I guess each user will have a reply endpoint for us to hit...
 */
const bodyParser = require('body-parser');

const rejectError = require(__base + '/utils/utils').rejectError;
const MongoPromise = require(__base + '/utils/MongoPromise');
const FacebookRouter = require(__base + '/message/FacebookRouter');
const validateParams = require(__base + '/message/RouteValidator').validateParams;

//TODO: load from db
const integrationTypes = require(__base + '/utils/enums').IntegrationTypes;

class MessageRouter {
  constructor(config) {
    //The underlying express router object
    this.router = require('express-promise-router')()
    this.config = config;

    // use
    this.router.use(bodyParser.json()); // for parsing application/json
    const botApi = this.getBotApi();
    this.router.use(new FacebookRouter(botApi).getRouter());
    /* add other integations here */

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
    this.router.get('/incoming/:serviceId/:integrationType', (req, res) => {
      const botApi = this.getBotApi();
      const mongo = this.getMongoClient();

      const serviceId = req.params.serviceId;
      const integrationType = req.params.integrationType;

      let service = null;

      return validateParams(req.params)
        //serviceId will probably be unique by itself, but we need to check to make sure that the correct integrationType is attached to the service
        //As users can change integrationTypes for a given service
        .then(() => mongo.findOne('Service', {query:{'serviceId':serviceId, 'integrationType':integrationType}}))
        .then(_service => {
          if (!_service) {
            return rejectError(404, `Service not found for serviceId: ${serviceId} and integrationType: ${integrationType}`);
          }

          service = _service;
          return this.parseMessage(req.query, integrationType)
        })
        .then(messageAndNumber => {
          return botApi.handleMessage(service, messageAndNumber.message, messageAndNumber.number);
        })
        .then(response => {
          res.send({message:response});
        });
    });

    this.router.post('/incoming/:serviceId/:integrationType', (req, res) => {
      const botApi = this.getBotApi();
      const mongo = this.getMongoClient();

      const serviceId = req.params.serviceId;
      const integrationType = req.params.integrationType;

      let service = null;

      return validateParams(req.params)
        .then(() => mongo.findOne('Service', {query:{'serviceId':serviceId, 'integrationType':integrationType}}))
        .then(_service => {
          if (!_service) {
            return rejectError(404, `Service not found for serviceId: ${serviceId} and integrationType: ${integrationType}`);
          }

          service = _service;
          return this.parseMessage(req.body, integrationType)
        })
        .then(messageAndNumber => {
          //We should pass in the found service from mongodb here... or at least the serviceId and integrationType
          return botApi.handleMessage(service, messageAndNumber.message, messageAndNumber.number);
        })
        .then(response => {
          res.send({message:response});
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

  getBotApi() {
    return this.config.botApi;
  }

  getMongoClient() {
    return new MongoPromise(this.config.mongoClient);
  }
}

module.exports = MessageRouter;
