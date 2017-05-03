import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import 'whatwg-fetch';

import Routes from '/components/Routes';
import '../styles/main.scss';


render(
  <Routes />,
  document.querySelector("#react-mount")
);
