'use strict';

const _config = require('@vamship/config').configure('app-server').getConfig();
const { ObjectMock } = require('@vamship/test-utils');
const _rewire = require('rewire');
// const _sinon = require('sinon');
const _chai = require('chai');
_chai.use(require('sinon-chai'));
_chai.use(require('chai-as-promised'));
const expect = _chai.expect;

const _routes = _rewire('../../../src/routes');

describe('_routes', () => {
    it('should expose the desired methods and properties', () => {
        expect(_routes).to.be.an('object');
        expect(_routes.setup).to.be.a('function');
    });

    describe('setup()', () => {
        let pathsObj = _config.get('app.paths');
        let validPaths = [];

        Object.keys(pathsObj).forEach((prop) => {
            validPaths.push(pathsObj[prop]);
        });

        let _loggerMock;

        beforeEach('Inject dependencies', () => {
            _loggerMock = new ObjectMock();
            _loggerMock.addMock('trace');
            _loggerMock.addMock('error');
            _loggerMock.addMock('info');
            _routes.__set__('_logger', _loggerMock.instance);
        });

        const setupInspector = {
            use: (somePath, someHandler) => {
                if (somePath && someHandler) {
                    expect(somePath).to.be.a('string');
                    expect(validPaths).to.include(somePath);
                } else {
                    someHandler = somePath; // no path was specified
                }

                expect(someHandler).to.be.a('function');
            }
        };

        it('should perform the necessary setup on the specified express app', () => {
            expect(_loggerMock.mocks.trace.stub).to.not.have.been.called;
            expect(_loggerMock.mocks.info.stub).to.not.have.been.called;

            _routes.setup(setupInspector);

            expect(_loggerMock.mocks.trace.stub).to.have.been.called;
            expect(_loggerMock.mocks.info.stub).to.have.been.called;
        });
    });
});

