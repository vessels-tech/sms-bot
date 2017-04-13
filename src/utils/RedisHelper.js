const isNullOrUndefined = require('util').isNullOrUndefined;
const redis = require('redis');

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
    console.log(`Saving key:${key}`);
    const disable_redis = process.env.DISABLE_REDIS;

    if (disable_redis === "true") {
      console.log("skipping save to redis, as DISABLE_REDIS is true");
      return Promise.resolve(true);
    }

    return new Promise((resolve, reject) => {
      this.client.set(key, JSON.stringify(value), (err, value) => {
        if (!isNullOrUndefined(err)) {
          return reject(err);
        }

        resolve(value);
      });
    });
  }

  /**
   * Delete a value from redis
   */
   delete(key) {
     console.log(`Deleting key:${key}`);

     return new Promise((resolve, reject) => {
       this.client.del(key, (err, value) => {
         if (!isNullOrUndefined(err)) {
           return reject(err);
         }
         resolve(value);
       });
     });
   }

}

module.exports = RedisHelper;
