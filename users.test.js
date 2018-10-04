const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const mongoose = require('mongoose');

const users = require('./users');

const User = require('./models/user');

const sandbox = sinon.sandbox.create();

describe('users', () => {
  let findStub;
  let sampleArgs;
  let sampleUser;

  beforeEach(() => {
    sampleUser = {
      id: 123,
      name: 'foo',
      email: 'foo@bar.com'
    }
    findStub = sandbox.stub(mongoose.Model, 'findById').resolves(sampleUser);
  });

  afterEach(() => {
    sandbox.restore();
  });

  context('get', () => {
    it('Should check for an ID', (done) => {
      users.get(null, (err, result) => {
        expect(err).to.exist;
        expect(err.message).to.equal('Invalid ID');
        done();
      });
    });

    it('Should call findUserById with Id and return result', (done) => {
      sandbox.restore();
      let stub = sandbox.stub(mongoose.Model, 'findById').yields(null, {name: 'foo'});

      users.get(22, (err, result) => {
        expect(result.name).to.equal('foo');
        expect(stub).to.have.been.calledOnce;
        done();
      });
    });

  });
})