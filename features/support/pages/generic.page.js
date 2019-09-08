'use strict';
// Set up for any activities that are not specific to a page.
const winston = require('winston');
const Page = require('./page');
class MyPage extends Page {
      get url () {
          return '#';
      }
}

module.exports = new MyPage();
