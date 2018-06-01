'use strict';

const _logger = require('@vamship/logger').getLogger('get-health-handler');

module.exports = (event, context, callback) => {
    _logger.trace('getHealthHandler processing...');

    return callback(null, 'ok');
};
