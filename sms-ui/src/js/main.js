import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import 'whatwg-fetch';

import App from '/components/App';
import '../styles/main.scss';


render(
  <App />,
  document.querySelector("#react-mount")
);
