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
    baseUrl: "http://mock-service:3001",
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

  handleRequest(query, entities) {
    console.log("queryURL", query.url);
    const options = {
        uri: `${query.url}`,
        json: true
      }

    //TODO: load GET or POST configuration from query
    return request.post(options);
  }

}

module.exports = ServiceApi;
