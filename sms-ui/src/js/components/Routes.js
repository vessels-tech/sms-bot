import React, { PropTypes, Component } from 'react';

import { Router, Route, Link, IndexRoute, hashHistory, browserHistory, Switch } from 'react-router'
import App from '/components/App';
import ServiceConfigurationContainer from '/components/ServiceConfiguration/ServiceConfigurationContainer';
import ServiceLogContainer from '/components/ServiceLog/ServiceLogContainer';

class Routes extends Component {

  getServiceConfiguration(props) {
    console.log("param", props);
    if (props.params && !props.params.serviceId) {
      return null;
    }

    return <ServiceConfigurationContainer
      serviceId={props.params.serviceId}
      onChangeServiceId={(serviceId) => console.log(serviceId)}
    />
  }

  getServiceLogs(props) {
    return <ServiceLogContainer
        serviceId={props.params.serviceId}
        onChangeServiceId={(serviceId) => this.onChangeServiceId(serviceId)}
      />;
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
        <Route path='/' component={App}>
          <Route path='/details/:serviceId' component={(props) => this.getServiceConfiguration(props)}/>
          <Route path='/logs/:serviceId' component={(props) => this.getServiceLogs(props)}/>
          <Route path='/address' component={() => this.getAddress()} />
        </Route>
        <Route path='*' component={NotFound}/>
      </Router>
    );
  }
}

export default Routes;
