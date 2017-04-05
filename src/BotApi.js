"use strict";

const request = require('request-promise');
const isNullOrUndefined = require('util').isNullOrUndefined;
const rejectError = require('./utils').rejectError;


/**
 * A class for interacting with the bot api.
 *
 */
class BotApi {
  constructor(baseUrl, accessToken, conversationRouter) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
    this.conversationRouter = conversationRouter;

    if (isNullOrUndefined(this.accessToken)) {
      console.error("no access token found! Requests will likely fail.");
    }
  }

  /*
  GET 'https://api.wit.ai/message?v=20160526&q=how%20many%20people%20between%20Tuesday%20and%20Friday' \
  -H "Authorization: Bearer $TOKEN"
  */
  understandMessage(message) {
    const options = {
      uri: `${this.baseUrl}/message`,
      headers: {
       'Authorization': `Bearer ${this.accessToken}`
      },
      json: true,
      qs: {
        q: message
      },
    }

    return Promise.resolve(true)
    .then(() => request.get(options))
    .then(response => {
      if (!isNullOrUndefined(response.entities) && isNullOrUndefined(response.entities.intent)) {
        return rejectError(404, `Intent not found for message: ${message}`);
      }

      const intent = response.entities.intent[0].value;


      //TODO: send this response to the router!
      return this.conversationRouter.routeConversation(intent, response.entities);
    });
  }

}

module.exports = BotApi;
