'use strict';

const logger = require('@vamship/logger').getLogger('health-check-routes');
const router = require('express').Router();
const _rewire = require('../handlers').rewire;
const _getHealthHandler = require('../handlers').getHealthHandler;

logger.trace('Registering health check handler');
router.get('/', _rewire(_getHealthHandler));

module.exports = router;

