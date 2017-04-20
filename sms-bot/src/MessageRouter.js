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

// TODO: maybe there is a better way to store this
const MESSENGER_VALIDATION_TOKEN = process.env.MESSENGER_VALIDATION_TOKEN;
const FacebookBot = require('./FacebookBot');
const facebookBot = new FacebookBot(process.env.MESSENGER_PAGE_ACCESS_TOKEN);

const integrationTypes = {
  cli: true,
  Way2Mint: true,
  facebookBot: true
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
    
    // catch facebookBot webhook authentication request
    // https://developers.facebook.com/docs/messenger-platform/guides/setup#webhook_setup
    this.router.use('/incoming/:userId/facebookBot', function(req, res, next) {
      // console.log(req.query)
      if (req.method == 'GET') {
        // get request - probably a auth request
        if (req.query['hub.mode'] === 'subscribe') {
          // definitely an auth request
          if (req.query['hub.verify_token'] === MESSENGER_VALIDATION_TOKEN) {
            res.status(200).send(req.query['hub.challenge']);
          } 
          else {
            console.error("Failed validation. Make sure the validation tokens match.");
            res.sendStatus(403);
          }
        }
      } else {
        // post request - probably a message
        next();
      }

    })
  }

  setupRoutes() {
    this.router.get('/incoming/:userId/:integrationType', (req, res) => {
      return this.validateParams(req.params)
        .then(() => this.parseMessage(req.query, req.params.integrationType))
        .then(messageAndNumber => {
          
          // facebook requires confirmation asap
          if(req.params.integrationType == 'facebookBot') {
            res.sendStatus(200);
          }
          
          return this.botApi.handleMessage(messageAndNumber.message, messageAndNumber.number);
        })
        .then(response => {
          // already sent facebook status
          if(req.params.integrationType != 'facebookBot') {
            res.send({message:response});
          }
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
        .then(() => this.parseMessage(req.query, req.params.integrationType))
        .then(messageAndNumber => {
          
          // facebook requires confirmation asap
          if(req.params.integrationType == 'facebookBot') {
            res.sendStatus(200);
          }
          
          return this.botApi.handleMessage(messageAndNumber.message, messageAndNumber.number);
        })
        .then(response => {
          // already sent facebook status
          if(req.params.integrationType != 'facebookBot') {
            res.send({message:response});
          }
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
    if (Object.keys(integrationTypes).indexOf(params.integrationType) === -1){
      return rejectError(400, {message:`unsupported integrationType: ${params.integrationType}`});
    }

    // TODO: more users?
    if (params.userId !== '1') {
      return rejectError(404, {message:`user with userId:${params.userId} not found`});
    }

    return Promise.resolve(true);
  }

  parseMessage(receivedData, integrationType) {
    //TODO: parse the req.data differently based on the integrationType
    
    if (!receivedData) {
      return rejectError(400, `receivedData is undefined`);
    }

    let missingParams = [];
    let data = {};
    
    // facebook bot is structured differently
    // format the params
    if (integrationType == 'facebookBot') {
      data = facebookBot.formatRequest(receivedData);
    }
    else {
      if (!receivedData.message) {
        missingParams.push("message");
      }

      if (!receivedData.number) {
        missingParams.push("number");
      }
      
      data = receivedData;
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
