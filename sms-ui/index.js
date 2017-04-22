const express = require('express');

const app = express();

app.use(express.static('dist'));

app.listen(3002, function () {
  console.log('sms-ui running on 3002!')
});
