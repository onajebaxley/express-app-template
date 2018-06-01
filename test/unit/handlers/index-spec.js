'use strict';

const chai = require('chai');
const expect = chai.expect;
const _index = require('../../../src/handlers');

describe('_handlers', () => {
    it('should expose the desired public methods and properties', () => {
        expect(_index).to.be.an('object');
        expect(_index.rewire).to.be.a('function');
        expect(_index.getHealthHandler).to.be.a('function');
    });
});
