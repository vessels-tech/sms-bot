const nock = require('nock');
const assert = require('assert');

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
    nock('http://mock-service:3001')
      .post('/saveReading')
      .reply(200, {message:"Thanks. Submitted successfully."});

    const serviceApi = new ServiceApi('mock');

    const options = {
      url: '/saveReading',
      method: 'POST'
    };
    const entities = {};

    return serviceApi.handleRequest(options, entities)
      .then(_response => {
        assert.deepEqual({message:"Thanks. Submitted successfully."}, _response);
      });
  });

  it('fails to send a request if the endpoint is not defined', () => {
    nock('http://mock-service:3001')
      .post('/notAUrl')
      .reply(500, {message:'Error. method not defined'});

    const serviceApi = new ServiceApi('mock');
    const options = {
      url: '/notAUrl',
      method: 'POST'
    };
    const entities = {};

    return serviceApi.handleRequest(options, entities)
      .catch(err => {
        if (err.statusCode !== 500) {
          return Promise.reject(err);
        }
      });
  });
});
