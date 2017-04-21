const assert = require('assert');

const Utils = require('../../src/utils/utils');

describe('isNullOrUndefined tests', () => {

  it('returns true if undefined', () => {
    let actual = Utils.isNullOrUndefined(undefined);
    let expected = true;
    assert.equal(actual, expected);
  });
  
  it('returns true if null', () => {
    let actual = Utils.isNullOrUndefined(null);
    let expected = true;
    assert.equal(actual, expected);
  });
  
  it('returns false if string', () => {
    let actual = Utils.isNullOrUndefined('hello');
    let expected = false;
    assert.equal(actual, expected);
  });
  
  it('returns false if int', () => {
    let actual = Utils.isNullOrUndefined(123);
    let expected = false;
    assert.equal(actual, expected);
  });
  
  it('returns false if object', () => {
    let actual = Utils.isNullOrUndefined({hello:'hi'});
    let expected = false;
    assert.equal(actual, expected);
  });
  
});
