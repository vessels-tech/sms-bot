"use strict"

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
  constructor(intentType) {
    //TODO: define and read different conversation types from a json config file
    if (Object.keys(desiredEntities).indexOf(intentType) === -1) {
      console.error(`ConversationDelegateType ${intentType} is not defined.`);
      process.exit(1);
    }

    this.intent = intentType;
    this.desiredEntities = desiredEntities[intentType];
  }

  getIntent() {
    return this.intent;
  }

  /**
   * handle a response from wit.ai!
   * @param entities - entities object from wit.ai response: https://wit.ai/docs/http/20160526#get--message-link
   * @returns Promise<String message>
   */
  handleConversation(entities) {
    //TODO: look up conversation context in redis, see if current conversation is in progress
    const missingEntities = this.findMissingEntities(entities);

    console.log(missingEntities);

    if (missingEntities.length > 0) {
      return "missing required entities!"
    }

    return "submitted query!";
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
