import {
  REQUEST_SERVICE_CONFIGURATION,
  RECEIVE_SERVICE_CONFIGURATION,
  INVALIDATE_SERVICE_CONFIGURATION,
} from './types';
import { getRequest } from './request';

const requestServiceConfiguration = (serviceId) => {
  return {
    type: REQUEST_SERVICE_CONFIGURATION,
    serviceId,
  }
}

const receiveServiceConfiguration = (serviceId, json) => {
  console.log("receive service config", json);
  return {
    type: RECEIVE_SERVICE_CONFIGURATION,
    serviceId,
    serviceConfiguration: json,
    receivedAt: Date.now()
  }
}

export function fetchServiceConfiguration(serviceId) {
  return (dispatch) => {
    dispatch(requestServiceConfiguration(serviceId));

    const options = {
      uri: '/console/service/:serviceId',
      qs: {
        ":serviceId": serviceId
      }
    };
    return getRequest(options)
      .then(_response => {
        dispatch(receiveServiceConfiguration(serviceId, _response));
      })
      .catch(err => {
        console.log(err);
        return Promise.reject(err);
      });
  }
}
