const isNullOrUndefined = require('util').isNullOrUndefined;
const redis = require('redis');
const bluebird = require('bluebird');

//Ideally we would use native promises, but they don't work with this redis client according to the docs
// bluebird.promisifyAll(redis.RedisClient.prototype);
// bluebird.promisifyAll(redis.Multi.prototype);


class RedisHelper {
  constructor() {
    if (isNullOrUndefined(global.redisClients)) {
      global.redisClients = [];
    }

    this.client = redis.createClient({
      host:'redis'
    });
    global.redisClients.push(this.client);
    return this;
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (!isNullOrUndefined(err)) {
          console.log(err);
          return reject(err);
        }

        resolve(value);
      });
    });
  }

  /**
   * Save a value to redis.
   * Value is JSON.stringified()
   */
  set(key, value) {
    console.log(`Saving key:${key}, value:${JSON.stringify(value)}`);

    return new Promise((resolve, reject) => {
      this.client.set(key, JSON.stringify(value), (err, value) => {
        if (!isNullOrUndefined(err)) {
          return reject(err);
        }

        resolve(value);
      });
    });
  }

}

module.exports = RedisHelper;
