import React, { PropTypes, Component } from 'react';
import Dropzone from 'react-dropzone';
import SMSBotService from '/client/SMSBotService';
import ServiceLogContainer from  '/components/ServiceLog/ServiceLogContainer';
import ServiceConfigurationContainer from '/components/ServiceConfiguration/ServiceConfigurationContainer';
import { Button, ButtonGroup, Col, Grid, PageHeader, Row } from 'react-bootstrap';

// material ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

// components
import AppBar from 'material-ui/AppBar';

// import HeaderBar from '/components/HeaderBar'

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

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
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <div>
          <AppBar
            title="Bare Bones SMS Console"
            showMenuIconButton={false}
          />
          <div className="container">
            {this.getServiceConfiguration()}
            {this.getServiceLogs()}
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App;
