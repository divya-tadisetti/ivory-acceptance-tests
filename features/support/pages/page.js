'use strict';
const winston = require('winston');
class Page {
    get url () {
        throw new Error('Page implementation does not override method url()');
    }

    open () {
        const self = this;
        winston.debug(`Opening url ${this.url}`);
        browser.url(self.url);
    }

    clickSomething (thingToClick) { // Based on http://webdriver.io/guide/usage/selectors.html
      browser.click(thingToClick);
    }

    enterFormText (formField, formInput) {
        const userInput = browser.element(formField);
        userInput.setValue(formInput);
        winston.info('Entering form text: ' + formInput.toString() + ' in field: ' + formField.toString());
    }

    isOpen () {
        return browser.getUrl().includes(this.url);
    }

    checkOpen () {
        if (!this.isOpen()) {
            winston.debug(`Page.checkOpen waiting for browser URL ${browser.getUrl()} to match ${this.url}`);
            const fn = this.isOpen.bind(this);
            const url = this.url;
            try {
                browser.waitUntil(fn, browser.options.waitforTimeout, `Expected URL '${browser.getUrl()}' to contain '${url}'`, 1000);
            } catch (e) {
                winston.error('Error checking if page is open ', e);
                throw e;
            }
        }
        winston.debug(`Page.checkOpen - checking for ${this.url} completed successfully`);
    }

    openElementText (textToFind, elementToFind, offset) { // Click an element of type elementToFind (such as div or a) containing textToFind with an offset in pixels
        offset = parseInt(offset); // scroll() only works with numbers
        winston.info('Attempting to open a "' + elementToFind + '" containing "' + textToFind + '" with offset ' + offset.toString() + ' in browser ' + browser.desiredCapabilities.browserName);
        // Specify which element you're searching for text in: http://webdriver.io/guide/usage/selectors.html
        browser.waitUntil(function () { // Check element exists
            const matchingResult = browser.element(elementToFind + '*=' + textToFind); // *= is a wildcard
            return matchingResult.isExisting();
        }, browser.options.waitforTimeout, 'Couldn\'t find a ' + elementToFind + ' containing \'' + textToFind + '\' within the allowed time', browser.options.waitforInterval);
        const matchingResult = browser.element(elementToFind + '*=' + textToFind); // the element containing the text
        winston.info(browser.getText(elementToFind + '*=' + textToFind));
        // Check browser version, as 'scroll' doesn't work on mobile.
        if ((browser.desiredCapabilities.browserName != 'android') && (browser.desiredCapabilities.browserName != 'iPad')) {
          browser.scroll(0,0);
          matchingResult.scroll(offset, offset);
        }
        // On mobile, the scroll command seems unnecessary and doesn't work.
        matchingResult.click();
    }

    doesTextExistInUniqueElement (textToCheck,elementToCheck) {
        winston.info('Looking for text ' + textToCheck + " in " + elementToCheck);
        const thingToCheck = browser.getText(elementToCheck);
        thingToCheck.should.contain(textToCheck);
    }

    doesTextExistSomewhere (textToCheck,elementToCheck) {  // DRY alert: code almost duplicates openElementText.
      winston.info('Attempting to find a "' + elementToCheck + '" containing "' + textToCheck + '"');
      winston.info('elementToCheck + \'*=\' + textToCheck');
      browser.waitUntil(function () { // Check that the element exists first
          const matchingResult = browser.element(elementToCheck + '*=' + textToCheck); // *= is a wildcard
          if ((browser.desiredCapabilities.browserName != 'android') && (browser.desiredCapabilities.browserName != 'iPad')) {
            matchingResult.scroll(); // this doesn't work and is not needed on mobile
          }
          return matchingResult.isExisting();
      }, browser.options.waitforTimeout, 'Couldn\'t find a ' + elementToCheck + ' containing \'' + textToCheck + '\' within the allowed time', browser.options.waitforInterval);
      const matchingResult = browser.getText(elementToCheck + '*=' + textToCheck).toString();
      matchingResult.should.contain(textToCheck);
    }

    goToTab (serviceHandle) { // Adds a step to focus back on a browser window, in case the browser has opened a separate tab.
      winston.info('Attempting to switch to tab with handle: ' + serviceHandle.toString());
      browser.switchTab(serviceHandle);
    }

    checkEnvVariable (envVariable) { // Check a given environment variable
        winston.info('Environment variable is: ' + envVariable.toString());
    }

    changePassword (pw1, pw2, textToCheck, elementToCheck, switchBack) {
      // Enter a new password with values pw1/pw2, then check for textToCheck in elementToCheck, switching tab if switchBack=true.

      browser.enterFormText('[name="password"]',pw1.toString());
      browser.enterFormText('[name="confirm-password"]',pw2.toString());
      // For syntax, see http://webdriver.io/v3.4/guide/usage/selectors.html#Name-Attribute
      if (switchBack) {
        browser.goToTab(handle); // Include when Chrome opens settings tab
      }
      browser.clickSomething('.button-start');
      var errorText = browser.getText(elementToCheck.toString());
      console.log('Error summary text is: ' + errorText.toString());
      browser.doesTextExistInUniqueElement(textToCheck.toString(),elementToCheck.toString());
      
    }

}
module.exports = Page;
