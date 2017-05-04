import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux'
import { fetchServiceLogs, selectService } from '/actions';
import { Button } from 'react-bootstrap';
import {RaisedButton, FlatButton} from 'material-ui';
class ServiceLog extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { serviceLogId } = this.props;
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
    this.props.onChangeServiceId(serviceId);
  }

  render() {
    const { isFetching } = this.props;
    return (
      <div>
        {isFetching && <h2>Loading...</h2>}
        {this.getLogPanel()}
        <RaisedButton 
          label="1"
          onClick={() => {this.changeService('1')}} 
        />
        <RaisedButton 
          label="2"
          onClick={() => {this.changeService('2')}} 
        />
        <RaisedButton
          label="3" 
          onClick={() => {this.changeService('3')}} 
        />
      </div>
    );
  }
}

ServiceLog.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  serviceId: PropTypes.string.isRequired,
  serviceLogs: PropTypes.arrayOf(PropTypes.shape({
    intentType:PropTypes.string,
    createdAt:PropTypes.string,
    entities: PropTypes.dict,
  })).isRequired,
  lastUpdated: PropTypes.number,
  onChangeServiceId: PropTypes.func,
}


export default ServiceLog;
