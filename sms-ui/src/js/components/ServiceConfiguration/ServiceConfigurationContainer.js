import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import ServiceConfiguration from '/components/ServiceConfiguration/ServiceConfiguration';
import SMSBotService from '/client/SMSBotService';
import { fetchServiceConfiguration } from '/actions';

class ServiceConfigurationContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { isFetching: false, serviceConfiguration: {} };
  }

  fetchAndUpdateServiceConfiguration(serviceId, forceUpdate) {
    const stateDelegate = {
      getState: () => this.state,
      setState: (state) => this.setState(state),
    };

    //Maybe this needs to be opinionated - and only fetch if the serviceId has changed
    fetchServiceConfiguration(stateDelegate, serviceId, forceUpdate);
  };

  componentDidMount() {
    const { serviceId } = this.props;
    this.fetchAndUpdateServiceConfiguration(serviceId, true);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchAndUpdateServiceConfiguration(nextProps.serviceId, false);
  }

  render() {
    return (
      <ServiceConfiguration
        isFetching={this.state.isFetching}
        serviceId={this.props.serviceId}
        serviceConfiguration={this.state.serviceConfiguration}
        onChangeServiceId={this.props.onChangeServiceId}
      />
    );
  }
}

ServiceConfigurationContainer.propTypes = {
  serviceId: PropTypes.string.isRequired,
  onChangeServiceId: PropTypes.func,
};

export default ServiceConfigurationContainer;
