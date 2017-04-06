const isNullOrUndefined = require('util').isNullOrUndefined;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const BotApi = require('./BotApi');
const ConversationDelegate = require('./ConversationDelegate');
const ConversationRouter = require('./ConversationRouter');

/* configure all of the things */
const conversationRouter = new ConversationRouter();

//Register a delegate for each intent
const saveReadingDelegate = new ConversationDelegate('saveReading');
conversationRouter.registerConversationDelegate(saveReadingDelegate);

const botApi = new BotApi('https://api.wit.ai', process.env.TOKEN, conversationRouter);


app.get('/message', function (req, res) {
  console.log("handling incoming request");
  let missingParams = [];
  if (isNullOrUndefined(req.query.message)) {
    missingParams.add("message");
  }

  if (isNullOrUndefined(req.query.number)) {
    missingParams.add("number");
  }

  if (missingParams.length > 0) {
    return res.status(400).send(`Missing required parameters:${missingParams}`);
  }

  /*Should we get anything from redis at this point, and add to the context?
    No - each component should interact with redis separately
  That makes the wole thing more thread safe (Even though we don't have threads)*/
  const context = {
    number: req.query.number,
    message: req.query.message
  }

  botApi.understandMessage(req.query.message, context)
  .then(response => {
    res.send({message:response});
  })
  .catch(err => {
    res.status(err.statusCode).send({message:err.message, status:err.statusCode});
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
