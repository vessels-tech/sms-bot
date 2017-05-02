import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux'
import { fetchServiceLogs, selectService } from '../actions/index';
import { Button } from 'react-bootstrap';

class ServiceLog extends Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    const { dispatch, serviceLogId } = this.props;
    dispatch(selectService(serviceLogId));
    dispatch(fetchServiceLogs(serviceLogId));
  }

  getLogItem(log) {
    return (
      <div key={log._id}>
        <p>{log.intentType}, {log.createdAt}, {JSON.stringify(log.entities)}</p>
      </div>
    );
  }

  getLogPanel() {
    const { serviceLogs } = this.props;
    let content = <p>No logs have been recorded for this service</p>;
    if (serviceLogs && serviceLogs.length > 0) {
      content = serviceLogs.map(log => this.getLogItem(log));
    }

    return (
      <div>
        <h3 className="page-header">Service Logs:</h3>
        {content}
      </div>
    )
  }

  changeService(serviceId) {
    const { dispatch } = this.props;
    dispatch(selectService(serviceId));
    dispatch(fetchServiceLogs(serviceId));
  }

  render() {
    const { dispatch, isFetching } = this.props;
    console.log("isFetching", isFetching);
    return (
      <div>
        {isFetching && <h2>Loading...</h2>}
        {this.getLogPanel()}
        <Button onClick={() => {this.changeService('1')}}>1</Button>
        <Button onClick={() => {this.changeService('2')}}>2</Button>
        <Button onClick={() => {this.changeService('3')}}>3</Button>
      </div>
    );
  }
}

ServiceLog.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  serviceLogId: PropTypes.string.isRequired,
  serviceLogs: PropTypes.arrayOf(PropTypes.shape({
    intentType:PropTypes.string,
    createdAt:PropTypes.string,
    entities: PropTypes.dict,
  })).isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  const { serviceLogs, selectedService } = state;
  return {
    ...serviceLogs[selectedService]
  };
}

export default connect(mapStateToProps)(ServiceLog);
