import { combineReducers } from 'redux'
import {
  REQUEST_SERVICE_LOGS, RECEIVE_SERVICE_LOGS,
  INVALIDATE_SERVICE_LOGS
} from '../actions'

function serviceLogs(state = {
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

function postsBySubreddit(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_SERVICE_LOGS:
    case RECEIVE_SERVICE_LOGS:
    case REQUEST_SERVICE_LOGS:
      return Object.assign({}, state, {
        [action.serviceId]: serviceLogs(state[action.serviceId], action)
      })
    default:
      return state
  }
}


const rootReducer = combineReducers({
  postsBySubreddit,
});

export default rootReducer
