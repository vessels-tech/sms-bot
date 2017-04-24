import React, { PropTypes, Component } from 'react';
import Dropzone from 'react-dropzone';
import SMSBotService from '../services/SMSBotService';


class App extends Component {

  // static propTypes = {
  //   service: PropTypes.shape({
  //     serviceId: PropTypes.string,
  //     integrationType: PropTypes.string,
  //     incomingUrl: PropTypes.string,
  //     outgoingUrl: PropTypes.string,
  //   }),
  // }

  constructor(props) {
    super(props);

    this.state = {
      serviceId: null,
      integrationType: null,
      incomingUrl: null,
      outgoingUrl: null,
      logs: []
    };
  }

  componentWillMount() {
    this.fetchServiceConfiguration();
    this.fetchServiceLogs();
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

  getIncomingPanel() {
    const { integrationType, incomingUrl } = this.state;
    if (!integrationType || !incomingUrl) {
      return null;
    }

    return (
      <div>
        <p>Integration Type:</p>
        <h4>{integrationType}</h4>
        <p>Incoming Url:</p>
        <h4>{incomingUrl}</h4>
      </div>
    );
  }

  getOutgoingPanel() {
    const { outgoingUrl } = this.state;

    if (!outgoingUrl) {
      return null;
    }

    return (
      <div>
        <p>Outgoing Url:</p>
        <h4>{outgoingUrl}</h4>
      </div>
    );
  }

  getLogPanel() {
    const { logs } = this.state;
    if (logs.length === 0) {
      return (
        <div>
          <p>No logs have been recorded for this service</p>
        </div>
      );
    }
    
  }

  render() {
    console.log("Rendering");

    return (
      <div>
        <h1>Welcome to Bare Bones Console</h1>
        {this.getIncomingPanel()}
        {this.getOutgoingPanel()}
        {this.getLogPanel()}
      </div>
    )
  }
}

export default App;
