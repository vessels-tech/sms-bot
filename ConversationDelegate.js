"use strict"


const intentTypes = [
  "saveReading"
];

//For each intent, we need all of these entites in order to complete a query
const desiredEntities = {
  saveReading: {
    resourceId: true,
    reading: true,
    datetime: true,
    postcode: true
  }

}

/**
 * A class for handling different conversations
 * eventually we will read these configurations from a json file or database or something
 */
class ConversationDelegate {
  constructor(intentType) {
    //TODO: define and read different conversation types from a json config file
    if (intentTypes.indexOf(intentType) === -1) {
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
    console.log('entities', entities);
    const missingEntities = findMissingEntities(entities);

  }

  /**
   * Check to see if any entities are missing.
   */
  findMissingEntities(entities) {
    
  }


}

module.exports = ConversationDelegate;
