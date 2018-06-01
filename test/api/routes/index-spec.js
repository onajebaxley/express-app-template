'use strict';

const _config = require('@vamship/config').configure('app-server').getConfig();
const chai = require('chai');
const _chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(_chaiHttp);

describe('_routes', () => {
    const endpoint = 'http://localhost:' + _config.get('app.defaultPort');
    const errorPath = _config.get('app.paths.error');

    it('should return a 404 for nonexistent paths', (done) => {
        let arbitraryPath = '/asdf';

        chai.request(endpoint)
            .get(`${arbitraryPath}`)
            .then((res) => {
                expect(res.statusCode).to.equal(404);
                expect(res.error).to.exist;

                done();
        }).catch((err) => {
            done(err);
        });
    });

    it('should return a 500 error for internal server errors', (done) => {
        chai.request(endpoint)
            .get(errorPath)
            .then((res) => {
                expect(res.statusCode).to.equal(500);
                expect(res.error).to.exist;
                expect(res.error.text).to.equal('Internal server error');

                done();
            }).catch((err) => {
                done(err);
            });
    });
});

