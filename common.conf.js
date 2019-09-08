'use strict';
const util = require('util');
const path = require('path');
const winston = require('winston');
const fs = require('fs-extra');

// Selenium logging verbosity: silent | verbose | command | data | result | error
const seleniumLogLevel = process.env.SELENIUM_LOG_LEVEL || 'error';
// Winston log level (used by step definitions) (defaults to 'info', see winston for options)
const winstonLogLevel = process.env.WINSTON_LOG_LEVEL || 'info';

// Ensure logs folder exists
const logDir = path.resolve(__dirname, 'logs');
fs.ensureDirSync(logDir);

exports.config = {
    // ==================
    // Specify Test Files
    // ==================
    specs: [
      './features/google.feature'
    ],
    //exclude: [
      //'./features/**/google.feature',
      //'./features/**/checklinks.feature'
    //],

    //
    // ===================
    // Test Configurations
    // ===================
    // By default WebdriverIO commands are executed in a synchronous way using the wdio-sync package.
    sync: true,
    // Selenium logging verbosity: silent | verbose | command | data | result | error
    logLevel: seleniumLogLevel,
    // Wdio debugging (use node inspector)
    debug: false,
    // Enables colors for log output.
    coloredLogs: true,
    // Saves a screenshot to a given path if a command fails.
    screenshotPath: './logs/errorShots/',
    // Take screenshots if the selenium driver crashes
    screenshotOnReject: true,
    // Default timeout for all waitFor* commands.
    waitforTimeout: 15000,
    // Default interval for all waitFor* commands (number of ms between checks to see if the runner should stop waiting)
    waitforInterval: 500,

    /**
     * Project-specific configuration options
     *
     * Add any project-specific configuration options here (keep things separate from the standard wdio config)
     *
     */
    _projectConfiguration: {
        // Winston log level (used by step definitions) (defaults to 'info', see winston for options)
        winstonLogLevel: winstonLogLevel,
        // timeout that specifies a time to wait for the implicit element location strategy when locating elements using the element or elements commands
        implicitTimeout: 0,
        // time to wait for the page loading to complete
        pageTimeout: 30000,
        // time to wait for asynchronous scripts to run
        scriptTimeout: 30000
    },

    // Default timeout in milliseconds for request
    // if Selenium Grid doesn't send response
    connectionRetryTimeout: 90000,
    // Default request retries count
    connectionRetryCount: 3,
    // Framework to run specs with.
    framework: 'cucumber',
    // Test reporter for stdout.
    reporters: ['spec', 'junit'],
    reporterOptions: {
        junit: {
            outputDir: './logs/junit'
        }
    },

    // If you are using Cucumber you need to specify the location of your step definitions.
    cucumberOpts: {
        require: ['./features/step_definitions'], // <string[]> (file/dir) require files before executing features
        backtrace: true, // <boolean> show full backtrace for errors
        compiler: [], // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
        dryRun: false, // <boolean> invoke formatters without executing steps
        failFast: true, // <boolean> abort the run on first failure
        format: ['pretty'], // <string[]> (type[:path]) specify the output format, optionally supply PATH to redirect formatter output (repeatable)
        colors: true, // <boolean> disable colors in formatter output
        snippets: false, // <boolean> hide step definition snippets for pending steps
        source: true, // <boolean> hide source uris
        profile: [], // <string[]> (name) specify the profile to use
        strict: true, // <boolean> fail if there are any undefined or pending steps
        tags: [], // <string[]> (expression) only execute the features or scenarios with tags matching the expression
        timeout: 60000, // <number> timeout for step definitions
        ignoreUndefinedDefinitions: false // <boolean> Enable this config to treat undefined definitions as warnings.
    },

    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.
    //
    // Gets executed once before all workers get launched.
    onPrepare: function (config, capabilities) {
        const prettyConfig = util.inspect(config, {depth: null, colors: true});
        const prettyCapabilities = util.inspect(capabilities, {depth: null, colors: true});
        winston.info(`Running tests with configuration: \nCapabilities: ${prettyCapabilities}}\n\nConfiguration:${prettyConfig}`);
    },

    //
    // Gets executed before test execution begins. At this point you can access all global
    // variables, such as `browser`. It is the perfect place to define custom commands.
    before: function (capabilities, specs) {
        // Setup the Chai assertion framework
        const chai = require('chai');

        global.expect = chai.expect;
        global.assert = chai.assert;
        global.should = chai.should();

        // reference to configuration object
        const cfg = this;
        // reference to the current session identifier
        const testSessionId = browser.session().sessionId;

        // Set up project specific timeout configuration settings
        browser.timeouts('implicit', cfg._projectConfiguration.implicitTimeout);
        browser.timeouts('script', cfg._projectConfiguration.scriptTimeout);
        browser.timeouts('page load', cfg._projectConfiguration.pageTimeout);

        /**
         * Safe version of the browser.isExisting() functionality
         *
         * Safari driver on browserstack likes to throw exceptions when you call isExisting on an element which doesn't exist.
         * This function protects against this.
         */
        browser.addCommand('isExistingSafe', function (selector) {
            try {
                return browser.isExisting(selector);
            } catch (e) {
                winston.warn('Ignoring exception thrown on isExisting call.');
                return false;
            }
        });

        /**
         * Configure winston logging
         */
        winston.configure({
            transports: [
                new (winston.transports.Console)({
                    'level': cfg._projectConfiguration.winstonLogLevel || 'info',
                    'colorize': true,
                    'silent': false,
                    'timestamp': true,
                    'json': false,
                    'showLevel': true,
                    'handleExceptions': false,
                    'humanReadableUnhandledException': false
                })
            ],
            filters: [
                function (level, msg, meta) {
                    const sessionTxt = testSessionId ? testSessionId + ': ' : '';
                    const cap = browser.desiredCapabilities;
                    // let env = `${cap.os} ${cap.os_version} ${cap.browserName} ${cap.browser_version}`;
                    const env = `${cap.browserName || 'Unknown'} ${cap.browser_version || ''}`;

                    return `[0;35m[${sessionTxt}${env}][0;39m ${msg}`;
                }
            ]
        });
    },
    //
    // Hook that gets executed before the suite starts
    // beforeSuite: function (suite) {
    // },
    //
    // Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
    // beforeEach in Mocha)
    // beforeHook: function () {
    // },
    //
    // Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
    // afterEach in Mocha)
    // afterHook: function () {
    // },
    //
    // Function to be executed before a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
    // beforeTest: function (test) {
    // },
    //
    // Runs before a WebdriverIO command gets executed.
    // beforeCommand: function (commandName, args) {
    // },
    //
    // Runs after a WebdriverIO command gets executed
    // afterCommand: function (commandName, args, result, error) {
    // },
    //
    // Function to be executed after a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
    // afterTest: function (test) {
    // },
    //
    // Hook that gets executed after the suite has ended
    // afterSuite: function (suite) {
    // },
    //
    // Gets executed after all tests are done. You still have access to all global variables from
    // the test.
    // after: function (result, capabilities, specs) {
    // },
    //
    // Gets executed after all workers got shut down and the process is about to exit. It is not
    // possible to defer the end of the process using a promise.
    // onComplete: function(exitCode) {
    // }

    // Cucumber specific hooks
    beforeFeature: function (feature) {
        winston.info(`Running feature: ${feature.getName()}`);
    },
    beforeScenario: function (scenario) {
        winston.info(`Running scenario: ${scenario.getName()}`);
    }
    // beforeStep: function (step) {
    // },
    // afterStep: function (stepResult) {
    // },
    // afterScenario: function (scenario) {
    // },
    // afterFeature: function (feature) {
    // }
};
