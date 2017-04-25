const express = require('express');

const app = express();

//TODO: fix silly webpack issue where we have to have 2 index.html files
app.use(express.static('./dist'));

app.listen(3002, function () {
  console.log('sms-ui running on 3002!')
});
