"use strict"

const ConversationDelegate = require('./ConversationDelegate');
const isNullOrUndefined = require('util').isNullOrUndefined;
const rejectError = require('../utils/utils').rejectError;

/**
 * Routes conversations to ConversationDelegate based on the intent
 */

class ConversationRouter {
  constructor() {
    this.intents = {}

    //Configure the default conversation router. Might be better to do this elsewhere
    const saveReadingDelegate = new ConversationDelegate('saveReading');
    this.registerConversationDelegate(saveReadingDelegate);
  }

  registerConversationDelegate(conversationDelegate) {
    this.intents[conversationDelegate.getIntent()] = conversationDelegate;
  }

  routeConversation(intent, number) {
    const conversationDelegate = this.intents[intent];
    if (isNullOrUndefined(conversationDelegate)) {
      return rejectError(400, `ConversationDelegate is not defined/implemented for intent: ${intent}`);
    }

    return conversationDelegate.handleConversation(number);
  }
}

module.exports = ConversationRouter;
