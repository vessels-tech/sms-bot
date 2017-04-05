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
  console.log(req.query);

  if (isNullOrUndefined(req.query) && isNullOrUndefined(req.query.message)) {
    res.status(400).send('Missing message parameter');
  }

  botApi.understandMessage(req.query.message)
  .then(response => {
    res.send(response);
  })
  .catch(err => {
    res.status(err.statusCode).send({message:err.message, status:err.statusCode});
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});
