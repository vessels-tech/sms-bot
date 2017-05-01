
const baseOptions = {
  baseUrl: __SMS_BOT_BASE_URL__,
  headers: [
    { key:'Content-type', value: 'application/json'}
  ]
  // baseUrl: 'https:sms.vesselstech.com'
}

export const REQUEST_SERVICE_LOGS = 'REQUEST_SERVICE_LOGS';
export const RECEIVE_SERVICE_LOGS = 'RECEIVE_SERVICE_LOGS';
export const INVALIDATE_SERVICE_LOGS = 'INVALIDATE_SERVICE_LOGS';


function requestServiceLogs(serviceId) {
  return {
     type: REQUEST_SERVICE_LOGS,
     serviceId
   }
}

function receiveServiceLogs(serviceId, json) {
  return {
    type: RECEIVE_SERVICE_LOGS,
    serviceId,
    serviceLogs: json,
    receivedAt: Date.now()
  }
}

export function fetchServiceLogs(serviceId) {
  return (dispatch) => {
    dispatch(requestServiceLogs(serviceId));

    const options = {
      uri: '/console/service/:serviceId/readings',
      qs: {
       ":serviceId": serviceId
      }
    };
    return getRequest(options)
      .then(_response => {
        dispatch(receiveServiceLogs(serviceId, _response));
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  }
}

const getRequest = (options) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    const url = baseOptions.baseUrl + parseQueryArguments(options.uri, options.qs) + parseRequestParams(options.params);
    xhr.open('GET', url);

    baseOptions.headers.forEach(header => xhr.setRequestHeader(header.key, header.value));

    xhr.onreadystatechange = () => { //Call a function when the state changes.
      if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
        resolve(JSON.parse(xhr.responseText));
      }
    }

    xhr.onerror = err => {
      reject(err);
    }
    xhr.send(null);
  });
}

/**
 * Convert a dict of arguments to a pretty urlencoded string
 */
const parseRequestParams = (params) => {
  if (!params) {
    return "";
  }

  let string = Object.keys(params).reduce((acc, key, idx) => {
    let firstChar = '?';
    if (idx != 0) {
      firstChar = '&';
    }
    return acc + `${firstChar}${key}=${params[key]}`;
  }, "");

  return encodeURI(string);
}

/**
 * Use find and replace to fill in the query params
 */
const parseQueryArguments = (uri, query) => {
  if (!query) {
    return uri;
  }

  let string = Object.keys(query).reduce((acc, key) => {
    acc = acc.replace(key, query[key]);
    return acc;
  }, uri)

  return string;
}
