"use strict"

const RedisHelper = require(__base + '/utils/RedisHelper');
const Thread = require(__base + '/model/Thread');
const rejectError = require(__base + '/utils/utils').rejectError;
const ConversationCompleteResponse = require(__base + '/model/ConversationCompleteResponse');
const SubmitConversationResponse = require(__base + '/model/SubmitConversationResponse');
const ServiceApi = require(__base + '/api/ServiceApi');
const MongoPromise = require(__base + '/utils/MongoPromise');

/**
 * A class for handling different conversations
 * eventually we will read these configurations from a json file or database or something
 */
class ConversationDelegate {
  constructor(app, intentType) {
    this.app = app;
    //TODO: define and read different conversation types from a json config file
    if (Object.keys(desiredEntities).indexOf(intentType) === -1) {
      return rejectError('500', `ConversationDelegateType ${intentType} is not defined.`);
    }

    this.intent = intentType;
    this.desiredEntities = desiredEntities[intentType];
    this.serviceApi = config[intentType].serviceApi;
  }

  getIntent() {
    return this.intent;
  }

  submitConversation(entities) {
    //TODO: talk to external api
    console.log("submitting to external Api");
    return this.serviceApi.handleRequest(this.intent, entities)
      .then(_response => {
        console.log("response", _response);
        return new SubmitConversationResponse(200, _response.message);
      });
  }

  isConversationComplete(entities) {
    const missingEntities = this.findMissingEntities(entities);
    if (missingEntities.length > 0) {
      const message = `Missing required entities ${missingEntities}`;

      return new ConversationCompleteResponse(false, missingEntities, message);
    }

    return new ConversationCompleteResponse(true, [], "Conversation is complete. Submitting");
  }


  /**
   * Check to see if any entities are missing.
   * @returns list
   */
  findMissingEntities(entities) {
    return Object.keys(this.desiredEntities).filter(desiredEntitity => !(desiredEntitity in entities));
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

    return mongoClient.save('readings', saveObject)
    //We don't care if this fails, still continue responding to user
      .catch(err => {
        console.error(err);
      });

  }

  getMongoClient() {
    return new MongoPromise(this.app.get('config').mongoClient);
  }
}

module.exports = ConversationDelegate;
