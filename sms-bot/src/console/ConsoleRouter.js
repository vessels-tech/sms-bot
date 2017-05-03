const bodyParser = require('body-parser');

const rejectError = require(__base + '/utils/utils').rejectError;
const MongoPromise = require(__base + '/utils/MongoPromise');


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
     * Get the available IntegrationTypes for the service
     */
    this.router.get('/console/service/integrationTypes', (req, res) => {
      const mongo = this.getMongoClient();

      return mongo.find('IntegrationType', {})
        .then(_docs => {
          res.status(200).send(_docs);
        });
    });

    /**
     * Get the service configuration
     */
    this.router.get('/console/service/:serviceId', (req, res) => {
      const mongo = this.getMongoClient();
      return mongo.findOne('Service',{query:{serviceId:req.params.serviceId}})
        .then(_docs => {
          console.log(_docs);
          res.status(200).send(_docs);
        });
    });

    /**
     * Register a new service
     */
    this.router.post('/console/service', (req, res) => {

    });

    /**
     * Get the logs for a given service
     */
    this.router.get('/console/service/:serviceId/readings', (req, res) => {
      const mongo = this.getMongoClient();
      return mongo.find('Reading', {query:{'serviceId':req.params.serviceId}})
        .then(_services => {
          res.status(200).send(_services);
        });
    });
  }

  getRouter() {
    return this.router;
  }

  getMongoClient() {
    return new MongoPromise(this.config.mongoClient);
  }
}

module.exports = ConsoleRouter;
