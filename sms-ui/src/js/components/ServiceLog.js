import React, { PropTypes, Component } from 'react';


class ServiceLog extends Component {
  constructor(props) {
    super(props);

  }

  getLogItem(log) {
    return (
      <div key={log._id}>
        <p>{log.intentType}, {log.createdAt}, {JSON.stringify(log.entities)}</p>
      </div>
    );
  }

  getLogPanel() {
    // const { logs } = this.state;
    let content = <p>No logs have been recorded for this service</p>;
    // if (logs && logs.length > 0) {
    //   content = logs.map(log => this.getLogItem(log));
    // }

    return (
      <div>
        <h3 className="page-header">Service Logs:</h3>
        {content}
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.getLogPanel()}
      </div>
    );
  }
}

ServiceLog.propTypes = {
  logs: PropTypes.arrayOf(PropTypes.shape({
    intentType:PropTypes.string,
    createdAt:PropTypes.string,
    entities: PropTypes.dict,
  })).isRequired,
}

export default ServiceLog;
