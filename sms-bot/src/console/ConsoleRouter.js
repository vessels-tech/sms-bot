const bodyParser = require('body-parser');

const rejectError = require('../utils/utils').rejectError;


/**
 * Console router allows users to manage their service, add remove, configure etc.
 * we will also connect to MongoDB to create new services
 *
 * This service is likely to eventually be detached from the sms-bot, but we need to see how
 * these systems work together first
 */
class ConsoleRouter {

  constructor(config) {
    this.router = require('express-promise-router')()
    this.router.use(bodyParser.json());

    this.config = config;
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {

  }

  setupRoutes() {

    /**
     * Get the service configuration etc.
     *
    service: {
      serviceId:
      integrationType:
      incomingUrl:
      outgoingUrl:
    }
     */
    this.router.get('/console/service/:serviceId', (req, res) => {
      console.log("TODO: talk to DB");
      const service = {
        serviceId: req.query.serviceId,
        integrationType: 'facebookBot',
        incomingUrl: `https://sms.vesselstech.com/${req.query.serviceId}/facebookBot`,
        outgoingUrl: 'https:/the.url/of/your/service'
      };

      return res.status(200).send(service);
      //TODO: return promises from these methods!
      // return Promise.resolve(service);
    });

    /**
     * Register a new service
     */
    this.router.post('/console/service', (req, res) => {

    });

    /**
     * Get the logs for a given service
     */
    this.router.get('/console/service/:serviceId/logs', (req, res) => {
      const mongoClient = this.getMongoClient();

      return mongoClient.collection('readings').find().toArray((err, docs) => {
        res.status(200).send(docs);
      });
    });
  }

  getRouter() {
    return this.router;
  }

  getMongoClient() {
    return this.config.mongoClient;
  }
}

module.exports = ConsoleRouter;
