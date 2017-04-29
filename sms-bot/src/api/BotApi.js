"use strict";

const request = require('request-promise');

const isNullOrUndefined = require(__base + '/utils/utils').isNullOrUndefined;
const utils = require(__base + '/utils/utils');
const RedisHelper = require(__base + '/utils/RedisHelper');
const Thread = require(__base + '/model/Thread');

const rejectError = utils.rejectError;
const redisClient = new RedisHelper();

/**
 * A class for interacting with the bot api.
 *
 */
class BotApi {
  constructor(app) {
    this.app = app;
  }

  /*
    Handle a message
    1. Get or create a new Thread for the message
    2. Let the Thread handle the message
  */
  handleMessage(service, message, number) {
    return Thread.findOrCreate(this.app, service.serviceId, number)
      .then(_thread => {
        return _thread.sendHandoff(message);
      });
  }
}

module.exports = BotApi;
