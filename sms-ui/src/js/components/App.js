import React, { PropTypes, Component } from 'react';
import Dropzone from 'react-dropzone';
import SMSBotService from '/client/SMSBotService';
import ServiceLogContainer from  '/components/ServiceLog/ServiceLogContainer';
import ServiceConfigurationContainer from '/components/ServiceConfiguration/ServiceConfigurationContainer';
import { Button, ButtonGroup, Col, Grid, PageHeader, Row } from 'react-bootstrap';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory, Switch } from 'react-router'
import Header from '/components/Header';

class App extends Component {

  render() {
    return (
      <div>
        <Header/>
        <div className="container">
          <PageHeader>Welcome to the SMS-Bot</PageHeader>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App;
