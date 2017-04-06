"use strict"

const isNullOrUndefined = require('util').isNullOrUndefined;
const rejectError = require('./utils').rejectError;

/**
 * Routes conversations to ConversationDelegate based on the intent
 */

class ConversationRouter {
  constructor() {
    this.intents = {}
  }

  registerConversationDelegate(conversationDelegate) {
    this.intents[conversationDelegate.getIntent()] = conversationDelegate;
  }

  routeConversation(intent, conversation, context) {
    const conversationDelegate = this.intents[intent];
    if (isNullOrUndefined(conversationDelegate)) {
      return rejectError(400, `ConversationDelegate is not defined/implemented for intent: ${intent}`);
    }

    return conversationDelegate.handleConversation(conversation, context);
  }
}

module.exports = ConversationRouter;
