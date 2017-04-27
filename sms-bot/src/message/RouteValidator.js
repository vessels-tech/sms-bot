// TODO: maybe a better name

const rejectError = require('../utils/utils').rejectError;

/**
 * A bunch of tools to validate requests
 */
class RouteValidator {

  /* TODO: we can probably make this more generic and stuff */
  static validateParams(params) {
    let errors = [];

    if (!params.integrationType) {
      errors.push(`required parameter 'integrationType' is not defined`);
    }
    if (!params.serviceId) {
      errors.push(`required parameter 'serviceId' is not defined`);
    }

    if (errors.length > 0) {
      return rejectError(400, {message:`Request is invalid: ${errors}`});
    }

    return Promise.resolve(true);
  }

}


module.exports = RouteValidator
