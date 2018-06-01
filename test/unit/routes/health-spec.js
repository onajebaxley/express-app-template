'use strict';

const chai = require('chai');
const expect = chai.expect;
const _health = require('../../../src/routes/health');

describe('routes/health', () => {
    it('should expose the desired methods and properties', () => {
        expect(_health).to.be.a('function');
        expect(_health.get).to.be.a('function');
    });
});

