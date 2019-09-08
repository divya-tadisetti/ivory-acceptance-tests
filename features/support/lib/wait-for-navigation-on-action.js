'use strict';
// This file is copied from data-returns-acceptance-tests.
// It may contain elements which do not exist in the water abstraction project.
const winston = require('winston');
const util = require('util');
util.inspect.defaultOptions = {depth: null, colors: true};

module.exports = function (action) {
    // Page Id element is embedded on each page by the frontend layout.html
    const oldPageId = browser.isExistingSafe('#pgid') ? browser.getValue('#pgid') : 'NO_OLD_PAGE_ID_FOUND';
    let currentPageId = null;
    try {
        action();
        browser.waitUntil(function () {
            try {
                currentPageId = browser.getValue('#pgid');
            } catch (e) {
                currentPageId = null;
            }

            const hasChanged = (currentPageId !== null && currentPageId !== oldPageId);
            if (!hasChanged) {
                winston.info(`Waiting for page to load (loaded: ${hasChanged}).  [Old page id: ${util.inspect(oldPageId)}, current page id: ${util.inspect(currentPageId)}]`);
            }
            return hasChanged;
        }, browser.options.waitforTimeout, 'expected page id to change as result of action', browser.options.waitforInterval);
    } catch (e) {
        winston.error(`Expected page id (${oldPageId}) to change within ${browser.options.waitforTimeout}ms of navigation.  Current page id is ${currentPageId}`, e);
        throw e;
    }
    winston.info(`Page load complete.  [Old page id: ${util.inspect(oldPageId)}, current page id: ${util.inspect(currentPageId)}]`);
};
