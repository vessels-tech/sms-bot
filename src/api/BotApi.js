"use strict";

const request = require('request-promise');
const isNullOrUndefined = require('util').isNullOrUndefined;
const utils = require('../utils/utils');
const rejectError = utils.rejectError;
const RedisHelper = require('../utils/RedisHelper');
const Thread = require('../Models/Thread');

const redisClient = new RedisHelper();

/**
 * A class for interacting with the bot api.
 *
 */
class BotApi {
  constructor() {

  }

  /*
    Handle a message
    1. Get or create a new Thread for the message
    2. Let the Thread handle the message
  */
  handleMessage(message, number) {
    return Thread.findOrCreate(number)
      .then(_thread => {
        return _thread.sendHandoff(message);
      });
  }
}

module.exports = BotApi;
