import SMSBotService from '../client/SMSBotService';


/*Action types*/
const REQUEST_SERVICE_LOGS = 'REQUEST_SERVICE_LOGS';
const RECEIVE_SERVICE_LOGS = 'RECEIVE_SERVICE_LOGS';

const REQUEST_SERVICE_CONFIGURATION = "REQUEST_SERVICE_CONFIGURATION";
const RECEIVE_SERVICE_CONFIGURATION = "RECEIVE_SERVICE_CONFIGURATION";

const calculateNewState = (state = {}, action) => {
  switch (action.type) {
    case REQUEST_SERVICE_LOGS:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE_SERVICE_LOGS:
      return {
        ...state,
        isFetching: false,
        serviceLogs: action.response,
        serviceId: action.serviceId,
      };
    case REQUEST_SERVICE_CONFIGURATION:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE_SERVICE_CONFIGURATION:
      return {
        ...state,
        isFetching: false,
        serviceId: action.serviceId,
        serviceConfiguration: action.serviceConfiguration,
      };
    default:
      return state;
  }
}

/**
This feels pretty messy to me - but I'm still trying to figure out a nicer way
stateDelegate is an Object containing a getState and setState closure, eg:
  const stateDelegate = {
    getState: () => this.state,
    setState: (state) => this.setState(state),
  };
*/
export const fetchServiceLogs = (stateDelegate, serviceId, forceUpdate) => {
  let firstState = stateDelegate.getState();

  if (serviceId === firstState.serviceId && !forceUpdate) {
    console.log("ignoring fetch as we already have data");
    return;
  }

  stateDelegate.setState(calculateNewState(firstState, {type:REQUEST_SERVICE_LOGS}));
  return SMSBotService.fetchServiceLogs(serviceId)
    .then(_response => {
      stateDelegate.setState(calculateNewState(stateDelegate.getState(), {type:RECEIVE_SERVICE_LOGS, response:_response, serviceId: serviceId}));
    });
}


export const fetchServiceConfiguration = (stateDelegate, serviceId, forceUpdate) => {
  let firstState = stateDelegate.getState();

  if (serviceId === firstState.serviceId && !forceUpdate) {
    console.log("ignoring fetch as we already have data");
    return;
  }

  stateDelegate.setState(calculateNewState(firstState, {type:REQUEST_SERVICE_CONFIGURATION}));
  return SMSBotService.fetchServiceConfiguration(serviceId)
    .then(_response => stateDelegate.setState(calculateNewState(stateDelegate.getState(), {
      type: RECEIVE_SERVICE_CONFIGURATION,
      serviceId: serviceId,
      serviceConfiguration: _response,
    })));
}
