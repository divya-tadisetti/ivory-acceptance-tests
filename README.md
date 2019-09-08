# README for Water Abstraction Acceptance Tests (water-abs-acceptance-tests)

## Description

This Node.JS repository is not currently being maintained.  It is replaced by:
https://github.com/DEFRA/water-abstraction-acceptance-tests which uses Ruby, Capybara and SitePrism.

This is a basic automated test suite for Water Abstraction using Node.JS, Webdriver.io, Selenium, Browserstack and Cucumber.  It borrows heavily from Data Returns Acceptance Tests.

### Prerequisites (for Mac)

* XCODE (Integrated development environment for Mac)
* XCODE Command Line Tools
* Homebrew (package manager used to help with installs)
* A script editor such as Atom, SublimeText or IntelliJ Idea.
* Github account
* Developer access to https://github.com/defra
* Github installed and configured in Terminal
* Java JDK v8
* NodeJS
* NPM (Node Package Manager)
* Cucumber `npm install -g cucumber`

#### Optional

* SelectorGadget Chrome extension

## Installation (via Terminal)

First, clone the project from GitHub

```bash
$ git clone https://github.com/EnvironmentAgency/water-abs-acceptance-tests.git
```

To install key project dependencies, open terminal inside the root folder of git repository and run:

```bash
$ npm install
```

## Execution

To run tests from the Terminal, navigate to the project root folder and type

```bash
$ npm run test
```

### Select specific features to run

Go to `common.conf.js` and edit `exports.config`.  Features to be run are included in `specs`, and features to be excluded are in `exclude`.

To run all tests, include the following in `specs`:

```javascript
'./features/**/*.feature'
```

## Project Structure

The core tests are structured as follows:

### 1. Features

Stored as `/features/[featurename].feature`.

The top-level features contain scenarios written in Gherkin format (given/when/then).

For any prerequisites, prefix the scenario with a Background.

### 2. Step Definitions

Stored as `/features/[I_do_an_action].js`.

Step definitions represent a single action such as selecting a link or clicking a button.  Each one corresponds to a line within one or more scenarios.  These call the relevant Javascript code to run the feature.

The text in `this.defineStep` must exactly match what’s in the feature file, or include regular expressions where the data may vary.

### 3. Supporting Javascript

`features/support/pages/page.js` is the master file containing any common Javascript functions, such as opening a page or checking for text in page components.

To avoid clutter, for any code specific to a single page, add a new `[page.name].page.js` file.  Copy the format from an existing `something.page.js` file.

A key part of writing tests is to detect unique page elements via their CSS (Cascading Style Sheet) properties.  A useful tool to help with this is the SelectorGadget Chrome extension.

## Browserstack (work in progress)

Browserstack is a tool used to simulate testing on multiple browsers.

To run on Browserstack, additional configuration files are required:

**/browserstacklocal.json**

Configuration settings for the BrowserStackLocal binary.  This agent allows browserstack.com to route traffic via the local machine and
requires settings as per the example below. "key" is the only required argument but "forcelocal" is likely always needed to allow traffic to
route via the local host.  For a full guide to the different options see  the [BrowserStackLocal Modifiers Guide](https://www.browserstack.com/local-testing#modifiers)
and the [browserstack-local NPM package](https://www.npmjs.com/package/browserstack-local)

```json
{
  "key": "BROWSERSTACK_ACCESS_KEY",
  "force": "true",
  "forcelocal": "true",
  "only": "nonsslserver.domain,80,0,sslserver.domain:443,1",
  "onlyAutomate": true,
  "forceproxy": "true",
  "proxyHost": "proxyserver.domain",
  "proxyPort": "3128",
  "proxyUser": "username",
  "proxyPass": "password"
}
```

## Contributing to this project

If you have an idea you'd like to contribute please log an issue.  All contributions should be submitted via a pull request.

## References:

- [API](http://webdriver.io/api.html)
- [Writing selectors](http://webdriver.io/guide/usage/selectors.html)
- [Data Returns Acceptance Tests](https://github.com/DEFRA/data-returns-acceptance-tests)

## LICENCE

Copyright (c) 2017 Environment Agency

Contains public sector information licensed under the Open Government Licence v3.

This source code is licensed under the Open Government Licence v3.0. To view this licence, visit www.nationalarchives.gov.uk/doc/open-government-licence/version/3 or write to the Information Policy Team, The National Archives, Kew, Richmond, Surrey, TW9 4DU.

## About the licence

The Open Government Licence (OGL) was developed by the Controller of Her Majesty's Stationery Office (HMSO) to enable information providers in the public sector to license the use and re-use of their information under a common open licence.

It is designed to encourage use and re-use of information freely and flexibly, with only a few conditions.
