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
  }

  /**
   * Call this when the ConversationDelegate deems the conversation complete
   * @param thread
   * @returns Promise<?>
   */
  submitConversation(query, entities) {
    const conversationDelegate = this.getConversationDelegate(query);
    return conversationDelegate.submitConversation(entities);
  }

  getConversationDelegate(query) {
    return new ConversationDelegate(this.app, query);
  }

}

module.exports = ConversationRouter;
