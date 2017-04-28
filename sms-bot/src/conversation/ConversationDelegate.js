"use strict"
const use = require('undot')
const RedisHelper = use('/./utils/RedisHelper');
const Thread = use('/./model/Thread');
const rejectError = use('/./utils/utils').rejectError;
const ConversationCompleteResponse = use('/./model/ConversationCompleteResponse');
const SubmitConversationResponse = use('/./model/SubmitConversationResponse');
const ServiceApi = use('/./api/ServiceApi');
const MongoPromise = use('/./utils/MongoPromise');

/**
 * A class for handling different conversations
 * eventually we will read these configurations from a json file or database or something
 */
class ConversationDelegate {
  /* A query object (service.query) contains all we need to submit a conversation to the external service */
  constructor(app, query) {
    this.app = app;
    this.query = query;
    //TODO: we can probably init the service api from the query...
    this.serviceApi = new ServiceApi('mock');
  }

  submitConversation(entities) {
    //TODO: talk to external api
    console.log("submitting to external Api");
    return this.serviceApi.handleRequest(this.query, entities)
      .then(_response => {
        console.log("response", _response);
        return new SubmitConversationResponse(200, _response.message);
      });
  }

  /**
   * Save the conversation to MongoDB in a log
   */
  logConversation(entities) {
    const mongoClient = this.getMongoClient();
    let saveObject = {
      method:'queryReading',
      time: new Date(),
      entities: entities
    };

    return mongoClient.collection('readings').insertOne(saveObject)
    //We don't care if this fails, still continue responding to user
      .catch(err => {
        console.error(err);
      });

  }

  getIntent() {
    return this.query.intentType;
  }

  getMongoClient() {
    //just testing this out
    const app = express();
    return new MongoPromise(app.get('config').mongoClient);
  }
}

module.exports = ConversationDelegate;
