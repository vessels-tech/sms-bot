import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import ServiceLog from './ServiceLog';
import SMSBotService from '../client/SMSBotService';

class ServiceLogContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { isFetching: false, serviceLogs: null };
  }

  componentDidMount() {
    const { serviceId } = this.props;

    //TODO: find neater way to do this
    this.setState({
      isFetching: true,
    });

    SMSBotService.fetchServiceLogs(serviceId)
      .then(_response => {
        this.setState({
          isFetching: false,
          serviceLogs: _response,
        });
      });
  }

  //TODO: receive props update, do network request!

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
