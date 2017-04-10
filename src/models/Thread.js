const isNullOrUndefined = require('util').isNullOrUndefined;

const Interaction = require('./Interaction');
const RedisHelper = require('../utils/RedisHelper');
const rejectError = require('../utils/utils').rejectError;
const IntentTypes = require('../utils/enums').IntentTypes;
const InteractionTypes = require('../utils/enums').InteractionTypes;
const AIApi = require('../api/AIApi');


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

  static findOrCreate(key) {
    return redisClient.get(key)
    .then(_threadString => {
      const _thread = JSON.parse(_threadString);

      if (isNullOrUndefined(_thread)) {
        let thread = new Thread(key);
        return thread;
      }
      //Recreate the thread from redis. Need to call new to get the functions etc.
      let thread = new Thread(key);
      thread.interactions = _thread.interactions;
      thread.entities = _thread.entities;
      thread.intent = _thread.intent;
      thread.state = _thread.state;

      return thread;
    });
  }

  constructor(number) {
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
    console.log('response is', JSON.stringify(response));

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
      console.log(`Configuring intial intent for state: ${this.intent}`);
    }

    //Add entities:
    this.entities = Object.assign(this.entities, response.entities);
    console.log(`Updated Thread entities: ${JSON.stringify(this.entities)}`);

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
      break;
      default:
        return rejectError(500, `Error: unknown state: ${this.state}`);
    }
  }

  /**
   * handle once we get a message back
   * We will need to move this elsewhere, to handle different intents and integrations accordingly,
   * but this works for now.
   * Ideally, each intent would have a delegate that defined the required entities, and it's submission function
   */
  handleResponseReceived() {
    if (isNullOrUndefined(this.intent)) {
      return rejectError(500, `Sorry, I didn't undertand your query. Please try again.`)
    }

    if (Object.keys(desiredEntities).indexOf(this.intent) === -1) {
      return rejectError(400, `Sorry, your request could not be handled for intent: ${this.intent}. Please try again.`);
    }

    const missing = this.findMissingEntities(this.entities);
    if (missing.length === 0) {
      //TODO: communicate with external API
      return {message: 'Thanks, your message was received.'};
    } else {
      return {message: `Missing required entities ${missing}`};
    }
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
      console.log("interaction", interaction);
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

  /**
   * Save the Thread to redis.
   * //TODO: Set expiry
   */
  save() {
    //TODO: configure to not save in test or something... For now uncomment to avoid evil state
    // return Promise.resolve(true);
    return redisClient.set(this.number, this);
  }

}

module.exports = Thread;
