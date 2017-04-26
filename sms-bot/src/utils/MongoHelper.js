const MongoClient = require('mongodb').MongoClient;

module.exports = {
  mongoConnect: () => {
    let host = 'mongo';
    let port = 27017;
    let database = 'sms-bot';

    return new Promise((resolve, reject) => {
      MongoClient.connect(`mongodb://${host}:${port}/${database}`,
      (err, db) => {
        return err ? reject(err) : resolve(db);
      });
    });
  }
}
