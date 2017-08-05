import chai from 'chai';

import StateManager from '../stateManager';

const should = chai.should();

describe('StateManager', () => {
  const stateManager = new StateManager('1234');

  it('should initialize with state.', () => {
    stateManager.should.have.property('state');
  });

  it('should have state of length 0', () => {
    stateManager.state.length.should.equal(0);
  });

  it('should initialize with id defined.', () => {
    stateManager.should.have.property('id');
  });

  it('should have id be not undefined', () => {
    stateManager.id.should.not.be.a('null');
    stateManager.id.should.not.be.an('undefined');
  });

  it('should have the id same as the original input', () => {
    stateManager.id.should.equal('1234');
  });
});
