import { combineReducers } from 'redux'
import {
  REQUEST_SERVICE_LOGS,
  RECEIVE_SERVICE_LOGS,
  INVALIDATE_SERVICE_LOGS,
  SELECT_SERVICE,
  REQUEST_SERVICE_CONFIGURATION,
  RECEIVE_SERVICE_CONFIGURATION,
  INVALIDATE_SERVICE_CONFIGURATION,
} from '../actions/types';

function selectedService(state = '1', action) {
  switch (action.type) {
    case SELECT_SERVICE:
      return action.serviceId
    default:
      return state
  }
}

function logs(state = {
  isFetching: false,
  didInvalidate: false,
  serviceLogs: []
}, action) {
  switch(action.type) {
    case INVALIDATE_SERVICE_LOGS:
      return {
        ...state,
        didInvalidate: true,
      };
    case REQUEST_SERVICE_LOGS:
    return {
      ...state,
      isFetching: true,
      didInvalidate:false,
    }
    case RECEIVE_SERVICE_LOGS:
    return {
      isFetching: false,
      didInvalidate: false,
      serviceLogs: action.serviceLogs,
      lastUpdated: action.receivedAt
    }
  }
}

function serviceLogs(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_SERVICE_LOGS:
    case RECEIVE_SERVICE_LOGS:
    case REQUEST_SERVICE_LOGS:
      return Object.assign({}, state, {
        [action.serviceId]: logs(state[action.serviceId], action)
      })
    default:
      return state
  }
}

function configuration(state = {
  isFetching: false,
  didInvalidate: false,
  serviceConfiguration: {}
}, action) {
  switch(action.type) {
    case INVALIDATE_SERVICE_CONFIGURATION:
      return {
        ...state,
        didInvalidate: true,
      };
    case REQUEST_SERVICE_CONFIGURATION:
    return {
      ...state,
      isFetching: true,
      didInvalidate:false,
    }
    case RECEIVE_SERVICE_CONFIGURATION:
    return {
      isFetching: false,
      didInvalidate: false,
      serviceConfiguration: action.serviceConfiguration,
      lastUpdated: action.receivedAt
    }
  }
}

function serviceConfiguration(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_SERVICE_CONFIGURATION:
    case RECEIVE_SERVICE_CONFIGURATION:
    case REQUEST_SERVICE_CONFIGURATION:
      return Object.assign({}, state, {
        [action.serviceId]: configuration(state[action.serviceId], action)
      })
    default:
      return state;
  }
}


const rootReducer = combineReducers({
  serviceLogs,
  selectedService,
  serviceConfiguration,
});

export default rootReducer
