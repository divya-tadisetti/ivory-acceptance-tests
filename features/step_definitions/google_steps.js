'use strict';
const winston = require('winston');
const MyPage = require('../support/pages/generic.page.js');

module.exports = function () {
    this.Given('I go to google', function (element, text, offset) {
        MyPage.open()
        browser.pause(process.env.WAIT_TIME);
    });
};
