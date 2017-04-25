// TODO: maybe a better name

const rejectError = require('../utils/utils').rejectError;
const rejectError = require('../utils/utils').rejectError;
const integrationTypes = require('../utils/enums').IntegrationTypes;

class RouteUtils {
  constructor() {

  }

  static validateParams(params) {
    if (Object.keys(integrationTypes).indexOf(params.integrationType) === -1){
      return rejectError(400, {message:`unsupported integrationType: ${params.integrationType}`});
    }

    // TODO: more users?
    if (params.userId !== '1') {
      return rejectError(404, {message:`user with userId:${params.userId} not found`});
    }

    return Promise.resolve(true);
  }

}


module.exports = RouteUtils
