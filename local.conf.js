'use strict';
const lodash = require('lodash');
const commonConfig = require('./common.conf').config;

const localConfig = {
    // ============
    // Capabilities
    // ============
    // Maximum instances to run in parallel.  Can be overridden on a per-browser basis by adding maxInstances option under each capability.
    maxInstances: 3,
    capabilities: [
        {
            browserName: 'chrome',
            maxInstances: 3
        }
    ],

    // ===================
    // Test Configurations
    // ===================
    // Set a base URL in order to shorten url command calls. If your url parameter starts
    // with "/", then the base url gets prepended.
    // If authentication is required then add a username and password between https:// and the rest of the URL.  Separate username and password with : and replace any spaces with %20.

    baseUrl: process.env.SERVICE_URL || 'http://www.google.com',

    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    services: ['selenium-standalone'],
    seleniumLogs: './logs/selenium',
    seleniumArgs: {
        version: '3.4.0'
    }, // latest is 3.8.1 but this can cause issues
    seleniumInstallArgs: {
        version: '3.4.0'
    }
};
exports.config = lodash.defaultsDeep(localConfig, commonConfig);
