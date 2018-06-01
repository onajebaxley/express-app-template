'use strict';

const _logger = require('@vamship/logger').getLogger('routes-spec');
const _config = require('@vamship/config').getConfig();
const _chaiHttp = require('chai-http');
const _chai = require('chai');
_chai.use(_chaiHttp);

describe('_routes', () => {
    const endpoint = 'http://localhost:' + _config.get('app.defaultPort');

    it('should return a 404', (done) => {
        let arbitraryPath = '/asdf';

        _chai.request(endpoint)
            .get(`http://localhost:3000${arbitraryPath}`)
            .then((res) => {
                _chai.expect(res.statusCode).to.equal(404);
                done();
        }).catch((err) => {
            _logger.error(err);
            done(err);
        });
    });
});

describe('Protractor Demo App', function() {
    it('should have a title', function() {
        browser.get('http://juliemr.github.io/protractor-demo/');

        expect(browser.getTitle()).toEqual('Super Calculator');
    });
});

