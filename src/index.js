'use strict';

const config = require('@vamship/config')
    .configure('app-server')
    .setApplicationScope(process.env.NODE_ENV)
    .getConfig();

const logger = require('@vamship/logger')
    .configure('app-server', {
        level: config.get('app.logLevel'),
        extreme: false
    })
    .getLogger('main');

logger.trace('Logger initialized');
logger.trace('Application configuration', {
    app: config.get('app')
});

const express = require('express');
const app = express();

logger.trace('Registering Express JSON body parser');
app.use(express.json());
const routes = require('./routes');

// ----------  Application routes ----------
logger.trace('Registering routes and handlers');
routes.setup(app);

// ----------  Launch web server ----------
logger.trace('Extracting port from environment');
let port = process.env.PORT;
logger.debug('Configured port', {
    port
});

if (!port) {
    port = config.get('app.defaultPort');
    logger.debug('Using default port', {
        port
    });
}
app.listen(port, () => {
    logger.info('Server listening on port', {
        port
    });
});
