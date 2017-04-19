/**
 * mock-service is that will stand in the place of MyWell for the time being
 * The sms-bot service will submit readings to this service
 */

const express = require('express');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());


app.post('/saveReading', (req, res) => {
  res.status(200).send({message:'Thanks. Submitted successfully.'});
});

app.post('/queryReading', (req, res) => {
  res.status(200).send({message:'The reading is 10.24m'});
});

app.listen(3001, function () {
  console.log('mock-service listening on port 3001!');
});
