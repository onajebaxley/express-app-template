'use strict';

// const _config = require('@vamship/config').getConfig();
// const _logger = require('@vamship/logger').getLogger('handlers');

/**
 * Module that provides handlers and handler wrappers for the application.
 */
const handlers = {
    getHealthHandler: require('./getHealthHandler'),

    /**
     * Rewires the specified lambda-style handler into an express handler
     * consumable by express app routers.
     *
     * @param {function} func An initialized Lambda-style handler.
     */
    rewire: function(func) {
        return (req, res, next) => {
            const callback = (error, aResponse) => {
                if (error) {
                    return next(error);
                }

                if (typeof aResponse === 'string') {
                    return res.send(aResponse);
                } else if (typeof aResponse === 'object') {
                    return res.json(aResponse);
                }
            };

            const event = {
                Body: req.body,
                Params: req.params,
                Query: req.query,
                Path: req.path,
                BaseUrl: req.baseUrl,
                Cookies: req.cookies,
                Hostname: req.hostname,
                Ip: req.ip
            };

            const context = { Response: res };

            func(event, context, callback);
        };
    }
};

module.exports = handlers;

