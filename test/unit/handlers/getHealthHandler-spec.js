'use strict';

const _chai = require('chai');
const _sinon = require('sinon');
_chai.use(require('sinon-chai'));
_chai.use(require('chai-as-promised'));
const expect = _chai.expect;
const _rewire = require('rewire');
const { ObjectMock } = require('@vamship/test-utils');

const getHealthHandler = _rewire('../../../src/handlers/getHealthHandler');

describe('getHealthHandler', function() {
    let _loggerMock = null;

    beforeEach('Inject dependencies', () => {
        _loggerMock = new ObjectMock().addMock('trace');
        getHealthHandler.__set__('_logger', _loggerMock.instance);
    });

    it('should export the handler function', () => {
        expect(getHealthHandler).to.be.a('function');
    });

    it('should successfully invoke callback with "ok" message', () => {
        let cbSpy = _sinon.spy();
        expect(cbSpy).to.not.have.been.called;

        getHealthHandler({}, {}, cbSpy);

        expect(cbSpy).to.have.been.called;
        expect(cbSpy).to.have.been.calledWithExactly(null, 'ok');
    });

    // it('should reject Promise if readdir fails', (done) => {
    //     const aBuilder = _createBuilder();

    //     const traceMethod = _loggerMock.mocks.trace;

    //     const built = aBuilder.build();

    //     const callback = traceMethod.stub.args[0][1];
    //     callback('Something went wrong');

    //     expect(built).to.be.rejected.and.notify(done);
    // });
});

