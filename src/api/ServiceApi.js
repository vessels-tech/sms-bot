/*

Service API is the interface between a ConversationRouter and services that will consume the sms-bot application

*/


/**
 * define each service type here
 * For now, there will just be a mock service
 */
const services = {
  mock: {
    baseUrl: "http://localhost:8080"
    endpoints: {
      saveReading: "/saveReading",
      queryReading: "/queryReading"
    }
  }
}

class ServiceApi {
  constructor(serviceType) {
    if (Object.keys(services).indexOf(serviceType) == -1) {
      return rejectError('500', `Error initializing ServiceApi. ServiceType ${serviceType} is not defined.`);
    }
    this.serviceType = serviceType;
    this = Object.apply(this, services[serviceType]);
  }

  handleRequest(requestType, entities) {

  }



}
