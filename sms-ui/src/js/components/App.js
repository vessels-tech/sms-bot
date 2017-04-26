import React, { PropTypes, Component } from 'react';
import Dropzone from 'react-dropzone';
import SMSBotService from '../services/SMSBotService';
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

  getIncomingPanel() {
    const { integrationType, incomingURL, integrationTypes, replyURL } = this.state;
    let content = null;
    if (!integrationType || !incomingURL || !integrationTypes || !replyURL) {
      content = <p>Incoming requests not configured</p>;
    } else {
      content = (
        <div>
          <Row className="">
            <Col sm={3} md={3}>IntegrationType:</Col>
            <Col sm={3} md={3}>
              {integrationType}
            </Col>
            <Col sm={6} md={6}>
              <Button>
                Change
              </Button>
            </Col>
          </Row>
          <Row className="">
            <Col sm={3} md={3}>Incoming Url:</Col>
            <Col sm={9} md={9}>
              <h4>{incomingURL}</h4>
            </Col>
          </Row>
          <Row className="">
            <Col sm={3} md={3}>Reply Url:</Col>
            <Col sm={9} md={9}>
              <h4>{replyURL}</h4>
            </Col>
          </Row>
        </div>
      );
    }

    return (
      <div>
        <h3 className="page-header">Incoming:</h3>
          {content}
      </div>
    );
  }

  getQueryRow(query) {
    return (
      <div key={query.intentType}>
        <Row className="">
          <Col sm={3} md={3}>IntentType:</Col>
          <Col sm={9} md={9}>{query.intentType}</Col>
        </Row>
        <Row className="">
          <Col sm={3} md={3}>url:</Col>
          <Col sm={9} md={9}>{query.url}</Col>
        </Row>
        <Row className="">
          <Col sm={3} md={3}>Method:</Col>
          <Col sm={9} md={9}>{query.method}</Col>
        </Row>
      </div>
    );
  }

  getQueryPanel() {
    const { queries } = this.state;
    let content = <p>Your service is not subscribed to any queries.</p>

    if (queries.length > 0) {
      content = queries.map(query => this.getQueryRow(query));
    }

    return (
      <div>
        <h3 className="page-header">Queries:</h3>
        {content}
        <Button>Edit your subscribed queries</Button>
      </div>
    );
  }

  getLogItem(log) {
    return (
      <div key={log._id}>
        <p>{log.intentType}, {log.createdAt}, {JSON.stringify(log.entities)}</p>
      </div>
    );
  }

  getLogPanel() {
    const { logs } = this.state;
    let content = <p>No logs have been recorded for this service</p>;
    if (logs.length > 0) {
      content = logs.map(log => this.getLogItem(log));
    }

    return (
      <div>
        <h3 className="page-header">Service Logs:</h3>
        {content}
      </div>
    )
  }

  render() {
    return (
      <div className="container">
        <PageHeader>Welcome to Bare Bones Console</PageHeader>

        {this.getIncomingPanel()}
        {this.getQueryPanel()}
        {this.getLogPanel()}
      </div>
    )
  }
}

export default App;
