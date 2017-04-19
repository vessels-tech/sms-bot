const isNullOrUndefined = require('util').isNullOrUndefined;
const express = require('express');
const bodyParser = require('body-parser');

const MessageRouter = require('./MessageRouter');
const ConversationDelegate = require('./conversation/ConversationDelegate');
const ConversationRouter = require('./conversation/ConversationRouter');

const app = express();
app.use(bodyParser.json());


/* configure all of the things */
const BotApi = require('./api/BotApi');

const conversationRouter = new ConversationRouter(app);
const saveReadingDelegate = new ConversationDelegate(app, 'saveReading');
const queryReadingDelegate = new ConversationDelegate(app, 'queryReading');
conversationRouter.registerConversationDelegate(saveReadingDelegate);
conversationRouter.registerConversationDelegate(queryReadingDelegate);

const botApi = new BotApi(app);
app.set('config', {
  botApi: botApi,
  conversationRouter: conversationRouter,
});

//TODO: find better way to dependency inject this one...
const messageRouter = new MessageRouter(express, botApi);
app.use(messageRouter.getRouter());

app.listen(3000, function () {
  console.log('sms-bot listening on port 3000!');
});
