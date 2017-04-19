const nock = require('nock');

const ServiceApi = require('../../src/api/ServiceApi');


describe('ServiceApi tests', () => {

  it('initializes a mock api', () => {
    const mockApi = new ServiceApi('mock');
  });

  it('fails if the service is not defined', () => {
    try {
      const none = new ServiceApi('nah');
    } catch (error) {
      if (error.statusCode !== 500) {
        throw error
      }
    }
  });

  it('sends a saveReading request', () => {
    nock('http://localhost:8080')
      .post('/saveReading')
      .reply(200, 'test');

    const serviceApi = new ServiceApi('mock');
    const entities = {};

    return serviceApi.handleRequest('saveReading', entities);

  });

  it('fails to send a request if the endpoint is not defined', () => {
    const serviceApi = new ServiceApi('mock');
    const entities = {};

    return serviceApi.handleRequest('notAMethod', entities)
      .catch(err => {
        if (err.statusCode !== 500) {
          return Promise.reject(err);
        }
      });
  });


});
