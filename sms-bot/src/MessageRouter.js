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

const bodyParser = require('body-parser');


const rejectError = require('./utils/utils').rejectError;


const integrationTypes = {
  cli: true,
  Way2Mint: true
};

class MessageRouter {
  constructor(express, botApi) {
    //The underlying express router object
    this.router = express.Router();
    this.router.use(bodyParser.json()); // for parsing application/json


    this.botApi = botApi;
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
      return this.validateParams(req.params)
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

      return this.validateParams(req.params)
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

  validateParams(params) {
    console.log(params);
    if (Object.keys(integrationTypes).indexOf(params.integrationType) === -1){
      return rejectError(400, {message:`unsupported integrationType: ${params.integrationType}`});
    }

    if (params.userId !== '1') {
      return rejectError(404, {message:`user with userId:${params.userId} not found`});
    }

    return Promise.resolve(true);
  }

  parseMessage(data, integrationType) {
    //TODO: parse the req.data differently based on the integrationType
    console.log(data);

    if (!data) {
      return rejectError(400, `data is undefined`);
    }

    let missingParams = [];
    if (!data.message) {
      missingParams.push("message");
    }

    if (!data.number) {
      missingParams.push("number");
    }

    if (missingParams.length > 0) {
      return rejectError(400, `Missing required parameters:${missingParams}`);
    }

    return Promise.resolve({
      message:data.message,
      number:data.number
    })
  }

  getRouter() {
    return this.router;
  }
}

module.exports = MessageRouter;
