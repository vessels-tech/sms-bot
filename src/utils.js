const isNullOrUndefined = require('util').isNullOrUndefined;
const redis = require('redis');

//Not sure if this will work...
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);



module.exports = {
  rejectError: (statusCode, message) => {
    let error = new Error(message);
    error.statusCode = statusCode;
    return Promise.reject(error);
  },

  /**
   * Gets a new redis client, adding it to the global clients to keep track
   */
  getRedisClient: () => {
    if (isNullOrUndefined(global.redisClients)) {
      global.redisClients = [];
    }
    client = redis.createClient();
    global.redisClients.push(client);
    return client;
  }


};
