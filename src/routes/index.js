'use strict';

const _config = require('@vamship/config').getConfig();
const _logger = require('@vamship/logger').getLogger('routes');

/**
 * Module that mounts the sub routes for the application.
 */
const routes = {
    /**
     * Initializes and mounts the routes for the application.
     *
     * @param {Object} app An initialized express application.
     */
    setup: (app) => {
        let healthPath = _config.get('app.paths.health');

        // ----------  Routers ----------
        _logger.info('Mounting health check routes', {
            path: healthPath
        });
        app.use(healthPath, require('./health'));

        // ----------  Error routes ----------
        _logger.trace('Setting up 404 error handlers');
        app.use((req, res) => {
            res.status(404).send('Resource not found');
        });

        _logger.trace('Setting up catch all error handlers');
        app.use((err, req, res, next) => {
            _logger.error(err);
            const message = 'Internal server error';
            res.status(500).send(message);
        });
    }
};

module.exports = routes;
