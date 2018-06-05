'use strict';

const chai = require('chai');
const _sinon = require('sinon');
chai.use(require('sinon-chai'));
const expect = chai.expect;
const _index = require('../../../src/handlers');
const { testValues: _testValues } = require('@vamship/test-utils');

describe('_handlers', () => {

    it('should expose the desired public methods and properties', () => {
        expect(_index).to.be.an('object');
        expect(_index.rewire).to.be.a('function');
        expect(_index.getHealthHandler).to.be.a('function');
    });

    describe('rewire()', () => {

        const rewireInspector = (event, context, callback) => {
            expect(callback).to.be.a('function');
            expect(event).to.be.an('object');
            expect(context).to.be.an('object');
            expect(context).to.have.property('Response');
            expect(context.Response).to.be.an('object');
            expect(event.Body).to.be.an('object');
            expect(event.Params).to.be.an('object');
            expect(event.Query).to.be.an('object');
            expect(event.Path).to.be.an('object');
            expect(event.Cookies).to.be.an('object');
        };

        it('should expose the necessary Express interfaces to the resulting handler', () => {
            _index.rewire(rewireInspector);
        });

        it('should not invoke the resulting handler', () => {
            let cbSpy = _sinon.spy();
            expect(cbSpy).to.not.have.been.called;

            _index.rewire(cbSpy);

            expect(cbSpy).to.not.have.been.called;
        });

        it('should invoke res.send upon text success', () => {
            const successInspector = (event, context, callback) => {
                expect(callback).to.be.a('function');

                callback(null, 'ok');
            };

            let cbSpy = _sinon.spy();
            expect(cbSpy).to.not.have.been.called;

            let wrappedHandler = _index.rewire(successInspector);
            wrappedHandler(cbSpy, { send: cbSpy }, cbSpy);

            expect(cbSpy).to.have.been.calledOnce;
        });

        it('should invoke res.json upon object success', () => {
            const successInspector = (event, context, callback) => {
                expect(callback).to.be.a('function');

                callback(null, {});
            };

            let cbSpy = _sinon.spy();
            expect(cbSpy).to.not.have.been.called;

            let wrappedHandler = _index.rewire(successInspector);
            wrappedHandler(cbSpy, { json: cbSpy }, cbSpy);

            expect(cbSpy).to.have.been.calledOnce;
        });

        it('should invoke res.json upon array success', () => {
            const successInspector = (event, context, callback) => {
                expect(callback).to.be.a('function');

                callback(null, [ 0, _testValues.getString('somestring') ]);
            };

            let cbSpy = _sinon.spy();
            expect(cbSpy).to.not.have.been.called;

            let wrappedHandler = _index.rewire(successInspector);
            wrappedHandler(cbSpy, { json: cbSpy }, cbSpy);

            expect(cbSpy).to.have.been.calledOnce;
        });

        it('should invoke next upon failure', () => {
            const lambdaFailure = (event, context, callback) => {
                expect(callback).to.be.a('function');

                callback('This lambda failed for some reason');
            };

            let cbSpy = _sinon.spy();
            expect(cbSpy).to.not.have.been.called;

            let wrappedHandler = _index.rewire(lambdaFailure);
            wrappedHandler(cbSpy, cbSpy, cbSpy);

            expect(cbSpy).to.have.been.calledOnce;
        });
    });


});
