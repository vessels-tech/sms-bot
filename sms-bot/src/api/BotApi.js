"use strict";

const use = require('undot')
const request = require('request-promise');

const isNullOrUndefined = use('/./utils/utils').isNullOrUndefined;
const utils = use('/./utils/utils');
const rejectError = utils.rejectError;
const RedisHelper = use('/./utils/RedisHelper');
const Thread = use('/./model/Thread');

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
    //TODO: add serviceId to thread or something
    return Thread.findOrCreate(this.app, number)
      .then(_thread => {
        return _thread.sendHandoff(message);
      });
  }
}

module.exports = BotApi;
