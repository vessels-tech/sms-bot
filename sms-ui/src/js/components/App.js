import React, { PropTypes, Component } from 'react';
import Dropzone from 'react-dropzone';
import SMSBotService from '../services/SMSBotService';
// import ServiceLogContainer from '../containers/ServiceLogContainer';
import ServiceLog from './ServiceLog';
import ServiceConfiguration from './ServiceConfiguration';
import { Button, ButtonGroup, Col, Grid, PageHeader, Row } from 'react-bootstrap';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      serviceId: null,
      integrationType: null,
      incomingURL: null,
      replyURL: null,
      logs: [],
      integrationTypes: [],
      queries: []
    };
  }

  /*TODO: find better way to load these things - perhaps using react router */
  componentWillMount() {
    this.fetchServiceConfiguration();
    this.fetchServiceLogs();
    this.fetchIntegrationTypes();
  }

  fetchServiceConfiguration() {
    //TODO: load these from path params - need to implement react router
    return SMSBotService.fetchServiceConfiguration("1")
      .then(_service => {
        this.setState({
          ...this.state,
          ..._service,
        });
      });
  }

  fetchServiceLogs() {
    //TODO: load these from path params - need to implement react router
    return SMSBotService.fetchServiceLogs("1")
      .then(_logs => {
        this.setState({
          ...this.state,
          logs: _logs
        });
      });
  }

  fetchIntegrationTypes() {
    return SMSBotService.fetchIntegrationTypes()
      .then(_integrationTypes => {
        this.setState({
          ...this.state,
          integrationTypes: _integrationTypes
        });
      });
  }

  getServiceConfiguration() {
    return (
      <ServiceConfiguration serviceId={'1'}/>
    );
  }

  getServiceLogs() {
    return (
      <ServiceLog serviceLogId={'1'}/>
    );
  }

  render() {
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
