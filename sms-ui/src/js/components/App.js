import React, { PropTypes, Component } from 'react';
import Dropzone from 'react-dropzone';
import SMSBotService from '/client/SMSBotService';
import ServiceLogContainer from  '/components/ServiceLog/ServiceLogContainer';
import ServiceConfigurationContainer from '/components/ServiceConfiguration/ServiceConfigurationContainer';
import { Button, ButtonGroup, Col, Grid, PageHeader, Row } from 'react-bootstrap';
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      serviceId: '1'
    };
  }

  getServiceConfiguration(serviceId) {
    return (
      <ServiceConfigurationContainer
        serviceId={serviceId}
        onChangeServiceId={(serviceId) => this.onChangeServiceId(serviceId)}
      />
    );
  }

  onChangeServiceId(serviceId) {
    console.log("App, onChangeServiceId:", serviceId);
    this.setState({
      ...this.state,
      serviceId: serviceId,
    });
  }

  getServiceLogs(serviceId) {
    return (
      <ServiceLogContainer
        serviceId={serviceId}
        onChangeServiceId={(serviceId) => this.onChangeServiceId(serviceId)}
      />
    );
  }

  getHome(props) {
    let serviceId = props.params.serviceId ? props.params.serviceId : '1';

    return (
      <div className="container">
        <PageHeader>Welcome to the SMS-Bot</PageHeader>
        <h3>Viewing Service: {serviceId}</h3>
        {this.getServiceConfiguration(serviceId)}
        {this.getServiceLogs(serviceId)}
      </div>
    )
  }

  getAddress() {
    return (
      <h1>We are located at 555 Jackson St.</h1>
    );
  }

  render() {
    const NotFound = () => (<h1>404.. This page is not found!</h1>);

    return (
      <Router history={hashHistory}>
        <Route path='/(:serviceId)' component={(props) => this.getHome(props)} />
        <Route path='/address' component={() => this.getAddress()} />
        <Route path='*' component={NotFound} />
      </Router>
    )
  }
}

export default App;
