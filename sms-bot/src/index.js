global.__base = __dirname + '/';

const express = require('express');
const bodyParser = require('body-parser');

const MessageRouter = require(__base + '/message/MessageRouter');
const ConsoleRouter = require(__base + '/console/ConsoleRouter');
const ConversationDelegate = require(__base + '/conversation/ConversationDelegate');
const ConversationRouter = require(__base + '/conversation/ConversationRouter');
const MongoHelper = require(__base + '/utils/MongoHelper');
const BotApi = require(__base + '/api/BotApi');

const app = express();
app.use(bodyParser.json());

/* configure all of the things */

/* Setup CORS */
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const conversationRouter = new ConversationRouter(app);

const botApi = new BotApi(app);


// TODO: tidy in better config step

return MongoHelper.mongoConnect()
  .then(_mongoClient => {
    const config = {
      botApi: botApi,
      conversationRouter: conversationRouter,
      mongoClient: _mongoClient,
    };

    //Express' app objects can access this
    app.set('config', config);

    /* Create and register routers */
    const messageRouter = new MessageRouter(config);
    const consoleRouter = new ConsoleRouter(config);

    app.use(messageRouter.getRouter());
    app.use(consoleRouter.getRouter());

    /* Error handling */
    app.use(function (err, req, res, next) {
      if (!err.statusCode) {
        return next(err);
      }

      console.error(err.stack);
      res.status(err.statusCode).send({message:err.message, status:err.statusCode});
    });

    app.use(function (err, req, res, next) {
      console.error(err.stack);
      res.status(500).send({message:err.message, status:500});
    });

    app.get('/', (req, res) => {
      res.status(200).send({message:'sms-bot up and running'});
    });

    app.listen(3000, function () {
      console.log('sms-bot listening on port 3000!');
    });

  });
