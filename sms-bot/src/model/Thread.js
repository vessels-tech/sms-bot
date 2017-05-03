const express = require('express');

require(__base + '/conversation/ConversationDelegate');


const isNullOrUndefined = require(__base + '/utils/utils').isNullOrUndefined;
const Interaction = require(__base + '/model/Interaction');
const RedisHelper = require(__base + '/utils/RedisHelper');
const rejectError = require(__base + '/utils/utils').rejectError;
const ConversationCompleteResponse = require(__base + '/model/ConversationCompleteResponse');
const InteractionTypes = require(__base + '/utils/enums').InteractionTypes;
const AIApi = require(__base + '/api/AIApi');
const MongoPromise = require(__base + '/utils/MongoPromise');

const redisClient = new RedisHelper();
const AIApiClient = new AIApi();

const ThreadStates = {
  pending: 'PENDING', //Waiting for user to enter more information
  handoffSent: 'HANDOFF_SENT', //The message has been sent to the AI service, and Thread is awaiting reply
  responseReceived: 'RESPONSE_RECEIVED', //Recevied a response from the AI service
  done: 'DONE',//All Necessary information received
}

//TODO: make this more extendable and configurable
const desiredEntities = {
  saveReading: {
    resourceId: true,
    reading: true,
    datetime: true,
    pincode: true
  },
  queryReading: {
    resourceId: true,
    pincode: true
  }
};

/**
 *  A list of transitions, the source on the left, the possible valid desitinations in a list
 */
const stateTransitions = {
  PENDING: [ ThreadStates.handoffSent ],
  HANDOFF_SENT: [ ThreadStates.responseReceived ],
  RESPONSE_RECEIVED: [ ThreadStates.pending, ThreadStates.done],
  DONE: []
}

class Thread {

  static findOrCreate(app, key) {
    return redisClient.get(key)
    .then(_threadString => {
      const _thread = JSON.parse(_threadString);

      if (isNullOrUndefined(_thread)) {
        let thread = new Thread(app, key);
        return thread;
      }
      //Recreate the thread from redis. Need to call new to get the functions etc.
      let thread = new Thread(app, key);
      thread.interactions = _thread.interactions;
      thread.entities = _thread.entities;
      thread.intent = _thread.intent;
      thread.state = _thread.state;

      return thread;
    });
  }

  constructor(app, number) {
    this.app = app;
    this.number = number;
    this.interactions = []; //Ordered list of interactions between the user and api. Latest interactions are at the end!
    this.entities = {};     //The entities found in the interactions
    this.intent = null;
    this.state = ThreadStates.pending;
  }

  /**
   * Send a handoff message to the AI Service
   */
  sendHandoff(message) {
    this.addInteraction(message, InteractionTypes.message);
    let response = null;

    //TODO: talk to the AI service
    return AIApiClient.understandMessage(message)
      .then(_response => response = _response)
      .then(() => this.setState(ThreadStates.handoffSent))
      .then(() => this.handleEnterState())
      .then(() => this.receiveResponse(response));
  }

  /**
   * Handle a response from the AI Service
   */
  receiveResponse(response) {
    this.addInteraction(response, InteractionTypes.message);

    //Add any intent to the intent object.
    //If we already have the intent, log a intentchanged error
    let intent = this.getIntentFromInteractions();
    if (!isNullOrUndefined(this.intent) && this.intent !== intent) {
      console.error(`Intent has changed in conversation. This is not a fatal error, but worth mentioning. \n \
        Former intent: ${this.intent}, new intent: ${intent} will be ignored`);
    }

    if (isNullOrUndefined(this.intent)) {
      //we handle null intents later on!
      this.intent = intent;
    }

    //Add entities:
    this.entities = Object.assign(this.entities, response.entities);

    return this.setState(ThreadStates.responseReceived)
      .then(() => this.handleEnterState());
  }

  addInteraction(data, type) {
    this.interactions.push(new Interaction(data, type));
  }

  setState(newState) {
    if (Object.keys(ThreadStates).map(key => ThreadStates[key]).indexOf(newState) == -1) {
      return rejectError(500, `Error: tried setting Thread.state to invalid state: ${newState}.`);
    }

    //Check for invalid state transition - defined in stateTransitions
    if (stateTransitions[this.state].indexOf(newState) == -1) {
      return rejectError(500, `Error: tried transitioning Thread.state from ${this.state} to invalid state: ${newState}.`);
    }

    this.state = newState;
    return this.save();
  }

  handleEnterState() {
    switch (this.state) {
      case ThreadStates.pending:
      break;
      case ThreadStates.handoffSent:
      break;
      case ThreadStates.responseReceived:
        return this.handleResponseReceived();
      break;
      case ThreadStates.done:
        //TODO: log this to a long term database eventually
        return this.handleThreadDone();
      break;
      default:
        return rejectError(500, `Error: unknown state: ${this.state}`);
    }
  }

  /**
   * handle once we get a message back
   */
  handleResponseReceived() {
    if (isNullOrUndefined(this.intent)) {
      //TODO: ideally we would have a chain of post response steps, where we could handle this state change
      return this.setState(ThreadStates.done)
        .then(() => this.handleEnterState())
        .then(() => {
          return rejectError(500, `Sorry, I didn't understand your query. Please try again.`)
        });
    }

    if (Object.keys(desiredEntities).indexOf(this.intent) === -1) {
      return this.setState(ThreadStates.done)
        .then(() => this.handleEnterState())
        .then(() => {
          return rejectError(400, `Sorry, your request could not be handled for intent: ${this.intent}. Please try again.`);
        });
    }

    //Check to see if the conversation is complete
    const router = this.getConversationRouter();
    //Not sure why we are asking the router if the conversation is complete...
    let submitConversationResponse = null;
    const completeResponse = router.isConversationComplete(this);
    if (completeResponse.complete) {
      //submit!
      return router.submitConversation(this)
        .then(_submitConversationResponse => submitConversationResponse = _submitConversationResponse)
        .then(() => this.setState(ThreadStates.done))
        .then(() => this.handleEnterState())
        .then(() => {

          return submitConversationResponse.message;
        });
    }

    //CompleteResponse contains the necessary user-facing message for us to ask for more info!
    /*
      Hmm this is a little unintutive. We set the state, call handle enter state, and THEN handle the response
      for the previous state? I wonder how we could do it better.
      The issue is that everything happens within an express request lifecycle.

      one option is to pass a promise chain of 'post response steps'
      the response object will call the response, and look for any of these steps to perform after the response
      we could define a custom object that could do this instead of just returning a response object as below
    */
    return Promise.resolve(true)
      .then(() => this.setState(ThreadStates.pending))
      .then(() => this.handleEnterState())
      .then(() => {
        return completeResponse.message;
      });
  }

  handleThreadDone() {
    return this.delete();
  }

  /**
   * Search through the list of interactions for the intent
   * Assume interactions is sorted, oldest to newest
   */
  getIntentFromInteractions() {
    let intent = null;
    //Reverse the array - that way we pick up any new intent changes
    let reversedInteractions = this.interactions.slice().reverse();
    reversedInteractions.some(interaction => {
      if (interaction.type === 'message') {
        return false;
      }

      //Gets the first intent - presumably highest coincidence
      //This will break if we wish to handle multiple intents.
      if (interaction.data && interaction.data.entities && interaction.data.entities.intent) {
        intent = interaction.data.entities.intent[0].value;
        return true;
      }
    });

    return intent;
  }

  isComplete() {
    const missing = this.findMissingEntities(this.entities)
    return missing.length === 0;
  }

  findMissingEntities(entities) {
    return Object.keys(desiredEntities[this.intent])
      .filter(desiredEntitity => !(desiredEntitity in entities));
  }

  getConversationRouter() {
    return this.app.get('config').conversationRouter;
  }

  /**
   * Save the Thread to redis.
   * //TODO: Set expiry
   */
  save() {
    //TODO: configure to not save in test or something... For now uncomment to avoid evil state
    // return Promise.resolve(true);
    return redisClient.set(this.number, this);
  }

  /**
   * Delete the thread from redis
   */
  delete() {
    return redisClient.delete(this.number);
  }

}

module.exports = Thread;
