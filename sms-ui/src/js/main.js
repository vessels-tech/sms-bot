import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import 'whatwg-fetch';

import App from './components/App';
import rootReducer from './reducers';
import '../styles/main.scss';
import { fetchServiceLogs } from './actions';

//Not working with latest react
// const loggerMiddleware = createLogger()

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware, // lets us dispatch() functions
    // loggerMiddleware // neat middleware that logs actions
  )
);

store.dispatch(fetchServiceLogs('1')).then(() => console.log(store.getState()));

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector("#react-mount")
);
