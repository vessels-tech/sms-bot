const request = require('request-promise');
const isNullOrUndefined = require('../utils/utils').isNullOrUndefined;

class AIApi {
  constructor() {
    this.baseUrl = 'https://api.wit.ai'; //TODO: get from config file or something
    this.accessToken = process.env.TOKEN;

    if (isNullOrUndefined(this.accessToken)) {
      console.error("no access token found! Requests will likely fail.");
    }
  }

  /*
  GET 'https://api.wit.ai/message?v=20160526&q=how%20many%20people%20between%20Tuesday%20and%20Friday' \
  -H "Authorization: Bearer $TOKEN"

  hmm, this is getting convoluded, as we are putting in the notion of threads here.
  */
  understandMessage(message) {
    let response = null;

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

    return request.get(options)
    .then(_response => {
      response = _response;
      if (!isNullOrUndefined(response) && isNullOrUndefined(response.entities)) {
        return rejectError(500, `Something went wrong with your request.`);
      }

      return response;
    })
    .catch(err => {
      console.log('caught err', err);
      return Promise.reject(err);
    });
  }
}

module.exports  = AIApi;
