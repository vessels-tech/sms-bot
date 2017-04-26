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
      incomingUrl: null,
      replyUrl: null,
      logs: [],
      integrationTypes: [],
      queries: [
        {_id:"1", intentType:'1234', url:'https://url.com'},
        {_id:"2", intentType:'1235', url:'https://url.com'},
      ]
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
    const { integrationType, incomingUrl, integrationTypes, replyUrl } = this.state;
    let content = null;
    if (!integrationType || !incomingUrl || !integrationTypes || !replyUrl) {
      content = <p>Incoming requests not configured</p>;
    } else {
      content = (
        <div>
          <Row className="">
            <Col sm={3} md={3}>IntegrationType:</Col>
            <Col sm={9} md={9}>
              {/* <h4>{integrationType}</h4> */}
              <ButtonGroup>
                <Button>Left</Button>
                <Button>Middle</Button>
                <Button>Right</Button>
              </ButtonGroup>
            </Col>
          </Row>
          <Row className="">
            <Col sm={3} md={3}>Incoming Url:</Col>
            <Col sm={9} md={9}>
              <h4>{incomingUrl}</h4>
            </Col>
          </Row>
          <Row className="">
            <Col sm={3} md={3}>Reply Url:</Col>
            <Col sm={9} md={9}>
              <h4>{replyUrl}</h4>
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
      <div key={query._id}>
        <Row className="">
          <Col sm={3} md={3}>IntentType:</Col>
          <Col sm={9} md={9}>{query.intentType}</Col>
        </Row>
        <Row className="">
          <Col sm={3} md={3}>url:</Col>
          <Col sm={9} md={9}>{query.url}</Col>
        </Row>
      </div>
    );
  }

  getQueryPanel() {
    const { queries } = this.state;
    let content = <p>Your service is not subscribed to any queries.</p>

    if (queries) {
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
        <p>{log.method}, {log.time}, {JSON.stringify(log.entities)}</p>
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
        <PageHeader>Welcome to Bare Bones Console </PageHeader>

        {this.getIncomingPanel()}
        {this.getQueryPanel()}
        {this.getLogPanel()}
      </div>
    )
  }
}

export default App;
