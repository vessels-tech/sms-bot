import React, { PropTypes, Component } from 'react';
import Dropzone from 'react-dropzone';
import SMSBotService from '/client/SMSBotService';
import ServiceLogContainer from  '/components/ServiceLog/ServiceLogContainer';
import ServiceConfigurationContainer from '/components/ServiceConfiguration/ServiceConfigurationContainer';
import { Button, ButtonGroup, Col, Grid, PageHeader, Row } from 'react-bootstrap';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      serviceId: '1'
    };
  }

  getServiceConfiguration() {
    return (
      <ServiceConfigurationContainer
        serviceId={'1'}
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

  getServiceLogs() {
    return (
      <ServiceLogContainer
        serviceId={this.state.serviceId}
        onChangeServiceId={(serviceId) => this.onChangeServiceId(serviceId)}
      />
    );
  }

  render() {
    console.log("app render");
    return (
      <div className="container">
        <PageHeader>Welcome to the SMS-Bot</PageHeader>
        {this.getServiceConfiguration()}
        {this.getServiceLogs()}
      </div>
    )
  }
}

export default App;
