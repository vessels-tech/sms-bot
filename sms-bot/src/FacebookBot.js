const request = require('request');

class FacebookBot {
  constructor(accessToken) {
    this.PAGE_ACCESS_TOKEN = accessToken;
  }
  
  formatRequest(data) {
    // TODO: facebook may batch requests
    // figure out a nice way to handle this
    if (data.object == 'page') {
      
      data.entry.forEach((entry) => {
        entry.messaging.forEach((msg) => {
          console.log(msg);
        })
      })
      
      let entry = data.entry[0];
      if (entry.messaging) {// message was received
        let msg = entry.messaging[0];
        console.log(msg.message.text)
        return {number: msg.sender.id, message: msg.message.text};
      } 
      else {
        return {number: '0410101557', message: 'msg.message.text'};
      }
    }
    else {
      return {number: '0410101557', message: 'msg.message.text'};
    }
  }
  
  /*
   * Send a text message using the Send API.
   *
   */
  sendTextMessage(recipientId, messageText) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: messageText,
        metadata: "DEVELOPER_DEFINED_METADATA"
      }
    };

    callSendAPI(messageData);
  }
  
  /*
   * Call the Send API. The message data goes in the body. If successful, we'll 
   * get the message id in a response 
   *
   */
  callSendAPI(messageData) {
    request({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: this.PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: messageData

    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var recipientId = body.recipient_id;
        var messageId = body.message_id;

        if (messageId) {
          console.log("Successfully sent message with id %s to recipient %s", 
            messageId, recipientId);
        } else {
        console.log("Successfully called Send API for recipient %s", 
          recipientId);
        }
      } else {
        console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
      }
    });  
  }
}

module.exports = FacebookBot;
