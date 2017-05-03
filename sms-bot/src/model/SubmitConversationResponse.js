/**
 * A response for any external api to send back to us, so that we can return a valid message to the user
 */
class SubmitConversationResponse {

  constructor(statusCode, message) {
    this.statusCode = statusCode;
    this.message = message;

    return this
  }

}

module.exports = SubmitConversationResponse;
