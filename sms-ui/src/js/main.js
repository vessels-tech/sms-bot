import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import '../styles/main.scss';
import 'whatwg-fetch';


render(<App/>, document.querySelector("#react-mount"));
