'use strict';

const chai = require('chai');
const expect = chai.expect;
const _error = require('../../../src/routes/error');

describe('routes/error', () => {
    it('should expose the desired methods and properties', () => {
        expect(_error).to.be.a('function');
        expect(_error.get).to.be.a('function');
    });
});

