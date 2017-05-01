import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux'
import { fetchServiceLogs } from '../actions';

class ServiceLog extends Component {
  constructor(props) {
    super(props);

  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchServiceLogs("1"));
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

  render() {
    const { isFetching } = this.props;
    console.log("isFetching", isFetching);
    return (
      <div>
        {isFetching && <h2>Loading...</h2>}
        {this.getLogPanel()}
      </div>
    );
  }
}

ServiceLog.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  serviceLogs: PropTypes.arrayOf(PropTypes.shape({
    intentType:PropTypes.string,
    createdAt:PropTypes.string,
    entities: PropTypes.dict,
  })).isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  console.log("Mapping state to props", state);
  const {serviceLogs} = state;
  return {
    ...serviceLogs['1']
  };
  // const { selectedSubreddit, postsBySubreddit } = state;
  // const {
  //   isFetching,
  //   lastUpdated,
  //   items: posts
  // } = postsBySubreddit[selectedSubreddit] || {
  //   isFetching: true,
  //   items: []
  // }
  //
  // return {
  //   selectedSubreddit,
  //   posts,
  //   isFetching,
  //   lastUpdated
  // }
}

export default connect(mapStateToProps)(ServiceLog);
