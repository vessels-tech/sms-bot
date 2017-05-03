/**
 * A response for the Delegate to send, giving the necessary information for a thread to reply
 * to a user
 */
class ConversationCompleteResponse {

  /**
   * @param complete - boolean
   * @param missingParams - array
   * @param message - string
   * @returns ConversationCompleteResponse
   */
  constructor(complete, missingParams, message) {
    this.complete = complete;
    this.missingParams = missingParams;
    this.message = message;

    return this
  }

}

module.exports = ConversationCompleteResponse;
