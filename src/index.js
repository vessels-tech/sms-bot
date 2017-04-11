const isNullOrUndefined = require('util').isNullOrUndefined;
const express = require('express');
const bodyParser = require('body-parser');

const ConversationDelegate = require('./conversation/ConversationDelegate');
const ConversationRouter = require('./conversation/ConversationRouter');

const app = express();
app.use(bodyParser.json());

/* configure all of the things */
const BotApi = require('./api/BotApi');

const conversationRouter = new ConversationRouter(app);
const saveReadingDelegate = new ConversationDelegate(app, 'saveReading');
conversationRouter.registerConversationDelegate(saveReadingDelegate);

const botApi = new BotApi(app);
app.set('config', {
  botApi: botApi,
  conversationRouter: conversationRouter,
});

app.get('/message', function (req, res) {
  let missingParams = [];
  if (isNullOrUndefined(req.query.message)) {
    missingParams.push("message");
  }

  if (isNullOrUndefined(req.query.number)) {
    missingParams.push("number");
  }

  if (missingParams.length > 0) {
    return res.status(400).send(`Missing required parameters:${missingParams}`);
  }

  //BotApi is the entrypoint for handling messages
  botApi.handleMessage(req.query.message, req.query.number)
  .then(response => {
    res.send({message:response});
  })
  .catch(err => {
    console.error(err);

    let statusCode = 500;
    if (!isNullOrUndefined(err.statusCode)) {
      statusCode = err.statusCode;
    }

    res.status(statusCode).send({message:err.message, status:statusCode});
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
