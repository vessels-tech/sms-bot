const isNullOrUndefined = require('util').isNullOrUndefined;

module.exports = {
  rejectError: (statusCode, message, shouldPromise) => {
    let error = new Error(message);
    error.statusCode = statusCode;
    if (shouldPromise === false) {
      return error;
    }
    return Promise.reject(error);
  },

};
