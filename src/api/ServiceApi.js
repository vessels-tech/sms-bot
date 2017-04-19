/*
  Service API is the interface between a ConversationRouter and services that will consume the sms-bot application
*/

const utils = require('../utils/utils');
const request = require('request-promise');

const rejectError = utils.rejectError;


/**
 * define each service type here
 * For now, there will just be a mock service
 */
const services = {
  mock: {
    baseUrl: "http://localhost:8080",
    endpoints: {
      saveReading: "/saveReading",
      queryReading: "/queryReading"
    }
  }
}

class ServiceApi {
  constructor(serviceType) {
    if (Object.keys(services).indexOf(serviceType) == -1) {
      throw rejectError(500, `Error initializing ServiceApi. ServiceType ${serviceType} is not defined.`, false);
    }
    //TODO: make this less ugly and more intuitive
    this.serviceType = serviceType;
    this.baseUrl = services[serviceType].baseUrl;
    this.endpoints = services[serviceType].endpoints;
  }

  handleRequest(requestType, entities) {
    //TODO: check for request type!
    if (Object.keys(this.endpoints).indexOf(requestType) == -1) {
      return rejectError(500, `Error handling request. requestType ${requestType} is not defined.`);
    }

    const options = {
        uri: `${this.baseUrl}${this.endpoints[requestType]}`,
        json: true
      }

    //Hopefully all of these apis will like posts...
    return request.post(options);
  }

}

module.exports = ServiceApi;
