"use strict"

const ConversationDelegate = require(__base + '/conversation/ConversationDelegate');
const isNullOrUndefined = require(__base + '/utils/utils').isNullOrUndefined;
const rejectError = require(__base + '/utils/utils').rejectError;

/**
 * Routes conversations to ConversationDelegate based on the intent
 */

class ConversationRouter {
  constructor(app) {
    this.app = app;
    this.intents = {}
  }

  registerConversationDelegate(conversationDelegate) {
    this.intents[conversationDelegate.getIntent()] = conversationDelegate;
  }

  /**
   * Call this when the ConversationDelegate deems the conversation complete
   * @param thread
   * @returns Promise<?>
   */
  submitConversation(thread) {
    const conversationDelegate = this.getConversationDelegate(thread.intent);
    return conversationDelegate.submitConversation(thread.entities);
  }

  /**
   * Checks whether or not a conversation is complete
   * Forwards onto the delegate
   * @param Thread
   * @returns Promise<ConversationCompleteResponse>,
   */
  isConversationComplete(thread) {
    const conversationDelegate = this.getConversationDelegate(thread.intent);
    return conversationDelegate.isConversationComplete(thread.entities);
  }

  getConversationDelegate(intent) {
    const conversationDelegate = this.intents[intent];
    if (isNullOrUndefined(conversationDelegate)) {
      return rejectError(400, `ConversationDelegate is not defined/implemented for intent: ${intent}`);
    }
    return conversationDelegate;
  }

}

module.exports = ConversationRouter;
