const isNullOrUndefined = require('util').isNullOrUndefined;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const BotApi = require('./api/BotApi');
const ConversationRouter = require('./conversation/ConversationRouter');

/* configure all of the things */
const botApi = new BotApi();


app.get('/message', function (req, res) {
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
  console.log('Example app listening on port 3000!')
});
