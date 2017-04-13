"use strict"

const RedisHelper = require('../utils/RedisHelper');
const Thread = require('../Models/Thread');
const rejectError = require('../utils/utils').rejectError;
const ConversationCompleteResponse = require('./ConversationCompleteResponse');


//For each intent, we need all of these entites in order to complete a query
const desiredEntities = {
  saveReading: {
    resourceId: true,
    reading: true,
    datetime: true,
    pincode: true
  }
};

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
  }

  getIntent() {
    return this.intent;
  }

  submitConversation(entities) {
    //TODO: talk to external api
    console.log("Submitting entities!", entities);
    return Promise.resolve(true)
      .then(_response => {
        return {message: "Readings have been submitted successfully"};
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
}

module.exports = ConversationDelegate;
