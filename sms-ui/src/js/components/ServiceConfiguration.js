import React, { PropTypes, Component } from 'react';
import { fetchServiceConfiguration, selectService } from '../actions/index';
import { Button, Col, Row, } from 'react-bootstrap';

class ServiceConfiguration extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch, serviceId } = this.props;
    // dispatch(selectService(serviceId));
    // dispatch(fetchServiceConfiguration(serviceId));
  }

  getIncomingPanel() {
    const { isFetching, serviceConfiguration } = this.props;

    //TODO: when isFetching is false, we should have a service configuration...
    if (isFetching || !serviceConfiguration) {
      return null;
    }

    const { integrationType, incomingURL, replyURL } = serviceConfiguration;

    let content = null;
    if (!integrationType || !incomingURL || !replyURL) {
      content = <p>Incoming requests not configured</p>;
    } else {
      content = (
        <div>
          <Row className="">
            <Col sm={3} md={3}>IntegrationType:</Col>
            <Col sm={3} md={3}>
              {integrationType}
            </Col>
            <Col sm={6} md={6}>
              <Button>
                Change
              </Button>
            </Col>
          </Row>
          <Row className="">
            <Col sm={3} md={3}>Incoming Url:</Col>
            <Col sm={9} md={9}>
              <h4>{incomingURL}</h4>
            </Col>
          </Row>
          <Row className="">
            <Col sm={3} md={3}>Reply Url:</Col>
            <Col sm={9} md={9}>
              <h4>{replyURL}</h4>
            </Col>
          </Row>
        </div>
      );
    }

    return (
      <div>
        <h3 className="page-header">Incoming:</h3>
          {content}
      </div>
    );
  }

  getQueryRow(query) {
    return (
      <div key={query.intentType}>
        <Row className="">
          <Col sm={3} md={3}>IntentType:</Col>
          <Col sm={9} md={9}>{query.intentType}</Col>
        </Row>
        <Row className="">
          <Col sm={3} md={3}>url:</Col>
          <Col sm={9} md={9}>{query.url}</Col>
        </Row>
        <Row className="">
          <Col sm={3} md={3}>Method:</Col>
          <Col sm={9} md={9}>{query.method}</Col>
        </Row>
      </div>
    );
  }

  getQueryPanel() {
    const { isFetching, serviceConfiguration } = this.props;

    if (isFetching || !serviceConfiguration) {
      return null;
    }

    const { queries } = this.props.serviceConfiguration;

    let content = <p>Your service is not subscribed to any queries.</p>

    if (queries && queries.length > 0) {
      content = queries.map(query => this.getQueryRow(query));
    }

    return (
      <div>
        <h3 className="page-header">Queries:</h3>
        {content}
        <Button>Edit your subscribed queries</Button>
      </div>
    );
  }

  render() {
    const { isFetching } = this.props;


    if (isFetching) {
      return null;
    }

    return (
      <div>
        {this.getIncomingPanel()}
        {this.getQueryPanel()}
      </div>
    );
  }

}

ServiceConfiguration.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  serviceId: PropTypes.string.isRequired,
  serviceConfiguration: PropTypes.shape({
    _id:  PropTypes.string,
    serviceId: PropTypes.string,
    incomingURL: PropTypes.string,
    replyURL: PropTypes.string,
    integrationType: PropTypes.string,
    witAiName: PropTypes.string,
    queries: PropTypes.arrayOf(PropTypes.shape({
      intentType: PropTypes.string,
      url: PropTypes.string,
      method: PropTypes.string,
      requiredEntities: PropTypes.shape({
        name:PropTypes.string,
        type:PropTypes.string,
      }),
    })),
  }),
};

export default ServiceConfiguration;
