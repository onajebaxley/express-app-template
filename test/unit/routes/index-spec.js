'use strict';

const _config = require('@vamship/config').configure('app-server').getConfig();
const _chai = require('chai');
const expect = _chai.expect;
const _routes = require('../../../src/routes');

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
            _routes.setup(setupInspector);
        });
    });
});

