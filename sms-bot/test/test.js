const assert = require('assert');
const nock = require('nock');

describe('sms-bot tests', () => {
  describe('Array', function() {
    describe('#indexOf()', function() {
      it('should return -1 when the value is not present', function() {
        assert.equal(-1, [1,2,3].indexOf(4));
      });
    });
  });

  describe('Conversation Tests', () => {
    require('./conversation/ConversationDelegate');
  });

  describe('Api Tests', () => {
    require('./api/ServiceApi');
  });

  describe('Util Tests', () => {
    require('./utils/Utils');
  })


  afterEach(function() {
    if(!nock.isDone()) {
      this.test.error(new Error(`Not all nock interceptors were used. \n\tRemaining:\n\t\t${nock.activeMocks()}`));
      nock.cleanAll();
    }
  });

});
