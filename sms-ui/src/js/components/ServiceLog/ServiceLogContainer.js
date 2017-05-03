import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import ServiceLog from '/components/ServiceLog/ServiceLog';
import SMSBotService from '/client/SMSBotService';
import { fetchServiceLogs } from '/actions';

class ServiceLogContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { isFetching: false, serviceLogs: [] };
  }

  fetchAndUpdateServiceLogs(serviceId, forceUpdate) {
    const stateDelegate = {
      getState: () => this.state,
      setState: (state) => this.setState(state),
    };

    //Maybe this needs to be opinionated - and only fetch if the serviceId has changed
    fetchServiceLogs(stateDelegate, serviceId, forceUpdate);
  };

  componentDidMount() {
    const { serviceId } = this.props;
    this.fetchAndUpdateServiceLogs(serviceId, true);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchAndUpdateServiceLogs(nextProps.serviceId, false);
  }

  render() {
    return (
      <ServiceLog
        isFetching={this.state.isFetching}
        serviceId={this.props.serviceId}
        serviceLogs={this.state.serviceLogs}
        onChangeServiceId={this.props.onChangeServiceId}
      />
    );
  }
}

ServiceLogContainer.propTypes = {
  serviceId: PropTypes.string.isRequired,
  onChangeServiceId: PropTypes.func,
};

export default ServiceLogContainer;
