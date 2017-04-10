const isNullOrUndefined = require('util').isNullOrUndefined;

module.exports = {
  rejectError: (statusCode, message) => {
    let error = new Error(message);
    error.statusCode = statusCode;
    return Promise.reject(error);
  },

};
