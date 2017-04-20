/**
 * mock-service is that will stand in the place of MyWell for the time being
 * The sms-bot service will submit readings to this service
 */

const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const mongoConnect = () => {
  let host = 'mongo';
  let port = 27017;
  let database = 'mock-service';

  return new Promise((resolve, reject) => {
    MongoClient.connect(`mongodb://${host}:${port}/${database}`,
    (err, db) => {
      err ? reject(err) : resolve(db);
    });
  });
};

const app = express();
app.use(bodyParser.json());
let mongo = null;


app.post('/saveReading', (req, res) => {
  let saveObject = {
    method:'saveReading',
    time: new Date(),
  };

  saveObject = Object.assign(saveObject, req.body);
  return mongo.collection('readings').insertOne(saveObject)
    .then(() => {
      res.status(200).send({message:'Thanks. Submitted successfully.'});
    })
    .catch(err => {
      console.error("error", err);

      let statusCode = 500;
      if (err.statusCode) {
        statusCode = err.statusCode;
      }

      res.status(statusCode).send(err);
    });
});

app.post('/queryReading', (req, res) => {
  let saveObject = {
    method:'queryReading',
    time: new Date(),
  };

  saveObject = Object.assign(saveObject, req.body);
  return mongo.collection('readings').insertOne(saveObject)
    .then(() => {
      res.status(200).send({message:'The reading is 10.24m'});
    })
    .catch(err => {
      console.error("error", err);

      let statusCode = 500;
      if (err.statusCode) {
        statusCode = err.statusCode;
      }

      res.status(statusCode).send(err);
    });
});

app.get('/readings', (req, res) => {
  return mongo.collection('readings').find().toArray((err, docs) => {
    res.status(200).send(docs);
  });

});

app.get('/', (req, res) => {
  res.status(200).send({message:'mock-sms-service up and running'});
});

app.listen(3001, function () {
  return mongoConnect()
    .then(_mongo => mongo = _mongo)
    .then(console.log('mock-service listening on port 3001!'));
});
