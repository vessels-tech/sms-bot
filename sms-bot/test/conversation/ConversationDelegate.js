const ConversationDelegate = require('../../src/conversation/ConversationDelegate');

//For now, use an actual mongoClient to test
const MongoHelper = require('../../src/utils/MongoHelper');


describe('ConversationDelegate tests', () => {
  let conversationDelegate = null;

  //TODO: mock this out better
  before(function() {
    let mongoClient = null;
    return MongoHelper.mongoConnect()
      .then(_client => mongoClient = _client)
      .then(() => {
        const mockApp = {
          get: (string) => {
            return {
              mongoClient: mongoClient
            };
          }
        }

        return conversationDelegate = new ConversationDelegate(mockApp, 'saveReading');
      });
  });

  //TODO: mock mongodb
  it.only('logs to mongodb', () => {
    console.log("log to mongodb");
    conversationDelegate.logConversation({test:1234});
  });

});
