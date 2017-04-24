// const assert = require('assert')

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const expect = chai.expect;
chai.use(chaiAsPromised);


const RedisHelper = require('../../src/utils/RedisHelper');
const redis = require('redis');

const redisHelper = new RedisHelper();
var client = redis.createClient({
  host:'redis'
});

describe('get', () => {
  it('return key value if valid', (done) => {
    var expected = JSON.stringify('this is a test');
    var actual = null;
    client.set('test', expected, () => {
       expect(redisHelper.get('test')).to.eventually.equal(expected).notify(done);
    });
  });

  it('return null if invalid key', (done) => {
    var expected = null;
    expect(redisHelper.get('nothing')).to.eventually.equal(expected).notify(done);
  })

});

describe('set', () => {
  it('set key value', (done) => {
    
    var key = 'test'
    var value = 'this is a test';
    var expectedValue = JSON.stringify(value);
    
    redisHelper.set(key, value).then(() => {
      client.get(key, (_err, _value) => {
        expect(_value).to.equal(expectedValue);
        done();
      });
    });
    
  });
});
