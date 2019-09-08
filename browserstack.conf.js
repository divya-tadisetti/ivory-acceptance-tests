'use strict';
const os = require('os');
const lodash = require('lodash');
const commonConfig = require('./common.conf').config;

const browserstackUser = process.env.BROWSERSTACK_USERNAME;
const browserstackKey = process.env.BROWSERSTACK_ACCESS_KEY;

if (!(browserstackUser || browserstackKey)) {
    throw new Error('Please ensure that the BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY environment variables are defined.');
}

const setupCapabilities = function (capabilitiesArray) {
    let buildTimestamp = new Date().toISOString();
    buildTimestamp = buildTimestamp.substring(0, buildTimestamp.length - 8);
    return capabilitiesArray.map(cap => lodash.defaultsDeep(cap, {
        'build': `${process.env.USER}@${os.hostname()} ${buildTimestamp}`.replace(/[^A-Za-z0-9 :._@]/g, '_'),
        'maxInstances': 1,
        'project': 'Water Abstraction',
        'browserstack.local': true,
        'browserstack.debug': true,
        'browserstack.video': true,
        'browserstack.timezone': 'London',
        'browserstack.javascriptEnabled': true,
        'pageLoadStrategy': 'normal',
        'browserstack.maskSendKeys': true,
        'acceptSslCerts': true
    }));
};

let browserStackProxyOpts = {};
if (process.env.BROWSER_PROXY_HOST) {
    browserStackProxyOpts = {
        forceProxy: true,
        proxyHost: process.env.BROWSER_PROXY_HOST,
        proxyPort: process.env.BROWSER_PROXY_PORT || 3128
    };
}

const browserStackConfig = {
    // ==================
    // Browserstack selenium host/port
    // ==================
    host: 'hub-cloud.browserstack.com',
    port: 80,
    path: '/wd/hub',

    //
    // =================
    // Browserstack options
    // =================
    user: browserstackUser,
    key: browserstackKey,
    browserstackLocal: true,

    browserstackOpts: lodash.defaultsDeep(browserStackProxyOpts, {
        logFile: './logs/local.log',
        force: true,
        forceLocal: true
    }),
    // Default timeout for all waitFor* commands.
    waitforTimeout: 90000,

    // Disable screenshots when used with browserstack.  Usually of little use on the test runner side.
    // Browserstack video and screenshots are more useful.
    screenshotPath: null,
    screenshotOnReject: false,

    /**
     * Project-specific configuration options
     *
     * Add any project-specific configuration options here (keep things separate from the standard wdio config)
     *
     */
    _projectConfiguration: {
        // Winston log level (used by step definitions) (defaults to 'info', see winston for options)
        winstonLogLevel: 'info',
        // timeout that specifies a time to wait for the implicit element location strategy when locating elements using the element or elements commands
        implicitTimeout: 0,
        // time to wait for the page loading to complete (allow much longer when running on browserstack)
        pageTimeout: 90000,
        // time to wait for asynchronous scripts to run
        scriptTimeout: 30000
    },

    // ============
    // Capabilities
    // ============
    maxInstances: 3,
    capabilities: setupCapabilities([ // Comment out the browsers you don't want to run.
        {
            'os': 'Windows',
            'os_version': '7',
            'browserName': 'ie',
            'browser_version': '8.0'
        },
        {
            'os': 'Windows',
            'os_version': '7',
            'browserName': 'ie',
            'browser_version': '11.0',
            // 'browserstack.debug': true
        },
        {
            'os': 'Windows',
            'os_version': '10',
            'browser': 'Edge',
            'browser_version': '15.0',
            'resolution': '1024x768'
        },
        {
            'os': 'Windows',
            'os_version': '10',
            'browser': 'Chrome',
            'browser_version': '61.0',
            'resolution': '1024x768'
        },
        {
            'os': 'Windows',
            'os_version': '10',
            'browser': 'Firefox',
            'browser_version': '56.0',
            'resolution': '1024x768'
        },
        {
            'os': 'OS X',
            'os_version': 'El Capitan',
            'browser': 'Chrome',
            'browser_version': '61.0',
            'resolution': '1024x768'
        },
        {
            'os': 'OS X',
            'os_version': 'El Capitan',
            'browser': 'Firefox',
            'browser_version': '56.0',
            'resolution': '1024x768'
        },
        {
            'browserName': 'android',
            'platform': 'ANDROID',
            'device': 'Samsung Galaxy S5'
            //'realMobile': 'true'
            // The automation driver for this browser does support file uploads - use data returns preloading to load data and establish sessions.
            //'preloadFiles': true
        },
        {
            'os': 'OS X',
            'os_version': 'Sierra',
            'browser': 'Safari',
            'browser_version': '10.1',
            'resolution': '1024x768',
            'browserstack.safari.allowAllCookies': true,
            // The automation driver for this browser does support file uploads - use data returns preloading to load data and establish sessions.
            'preloadFiles': true
        },
        {
            'browserName': 'iPad',
            'platform': 'MAC',
            'device': 'iPad Mini 4'
        },
        {
            'browserName': 'iPhone',
            'platform': 'MAC',
            'device': 'iPhone 5'
        }
    ]),

    // ===================
    // Test Configurations
    // ===================

    // Set a base URL in order to shorten url command calls. If your url parameter starts
    // with "/", then the base url gets prepended.
    baseUrl: process.env.SERVICE_URL || 'https://water-abstractions-qa.aws-int.defra.cloud/',

    // Test runner services
    services: ['browserstack'],

    cucumberOpts: {
        // Configure cucumberjs to ignore any features marked with browserstackIgnore.
        tags: ['~@browserstackIgnore'],
        // Increase step timeout on browserstack (things just seem to take longer!)
        timeout: 240000
    }

};
exports.config = lodash.defaultsDeep(browserStackConfig, commonConfig);
