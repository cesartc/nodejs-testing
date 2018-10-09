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
  let deleteStub;
  let sampleArgs;
  let sampleUser;

  beforeEach(() => {
    sampleUser = {
      id: 123,
      name: 'foo',
      email: 'foo@bar.com'
    }
    findStub = sandbox.stub(mongoose.Model, 'findById').resolves(sampleUser);
    deleteStub = sandbox.stub(mongoose.Model, 'remove').resolves('fake_remove_result');
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

    it('Should catch error if there is one', () => {
      sandbox.restore();
      let stub = sandbox.stub(mongoose.Model, 'findById').yields(new Error('fake'));

      users.get(123, (err, result) => {
        expect(result).to.not.exist;
        expect(err).to.exist;
        expect(err).to.be.instanceOf(Error);
      });
    });
  });

  context('delete user', () => {
    it('Should check for an ID useing return', (done) => {
      users.delete().then((result) => {
        throw new Error('unexpected success');
      }).catch((err) => {
        expect(err).to.exist;
        expect(err).to.be.instanceOf(Error);
        expect(err.message).to.equal('Invalid ID');
        done();
      });
    });

    it('Should check for errors using eventually', () => {
      return expect(users.delete()).to.eventually.be.rejectedWith('Invalid ID');
    });
  });

  context('create user', () => {
    it('Should reject invalid args', async () => {
      expect(users.create()).to.eventually.be.rejectedWith('Invalid arguments');
      expect(users.create({email: 'user@new.com'})).to.eventually.be.rejectedWith('Invalid arguments');
    });
  });
})
