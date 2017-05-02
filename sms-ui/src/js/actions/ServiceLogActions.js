import {
  REQUEST_SERVICE_LOGS,
  RECEIVE_SERVICE_LOGS,
  INVALIDATE_SERVICE_LOGS,
  SELECT_SERVICE,
} from './types';
import { getRequest } from './request';

export function selectService(serviceId) {
  return {
    type: SELECT_SERVICE,
    serviceId
  }
}

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
