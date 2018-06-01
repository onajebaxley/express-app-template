'use strict';

const logger = require('@vamship/logger').getLogger('forced-error-route');
const router = require('express').Router();

logger.trace('Registering forced error handler');
router.get('/', (req, res, next) => {
    throw new Error('Requested error being thrown.');
});

module.exports = router;

