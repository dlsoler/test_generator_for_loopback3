
'use strict';
const path = require('path');

const _ = require('lodash');

const helper = require('./lib/helper');
const settings = require( path.join(__dirname,'./settings.json'));


function plopFunction (plop) {
  plop.setHelper('bodyParams', function(parameters) {
    if (!parameters) {
      return '';
    }
    const postParams = parameters.filter((param) => param.in === 'body');
    const sendStrings = postParams.map(
      (param) => `    .send(${param.name})`
    );
    if (_.isEmpty(sendStrings)) {
      return '';
    }
    return `\n${sendStrings.join('\n')}`;
  });

  plop.setHelper('queryParams', function(parameters) {
    if (!parameters) {
      return '';
    }
    const postParams = parameters.filter((param) => param.in === 'query');
    const queryStrings = postParams.map(
      (param) => `    .query(${param.name})`
    );
    if (_.isEmpty(queryStrings)) {
      return '';
    }
    return `\n${queryStrings.join('\n')}`;
  });

  plop.setHelper('dataConstants', function(parameters) {
    if (!parameters || _.isEmpty(parameters)) {
      return '';
    }
    const constantsStrings = parameters.map(
      (param) => {
        let value;
        switch (param.name) {
          case 'credentials':
            value = '{ username: usersData.users[1].username, password: usersData.users[1].password }';
            break;
          case 'data':
            value = '{}';
            break;
          case 'filter': 
            value = '{}';
            break;
          case 'fk':
            value = '\'fake fk\'';
            break;
          case 'id':
            value = 'userId';
            break;
          case 'include':
            value = '{}';
            break;
          case 'newPassword':
            value = '\'Fake new user password\'';
            break;
          case 'oldPassword':
            value = '\'Fake old user password\'';
            break;
          case 'options': 
            value = '{}';
            break;
          case 'redirect':
            value = '\'wrong redirect URL\'';
            break;
          case 'token':
            value = '\'wrong token\'';
          case 'where':
            value = '{}';
            break;
          default:
            value = '\'\'';
        }
        return `    const ${param.name} = ${value};`
      }
    );
    return `${constantsStrings.join('\n')}\n`;
  });

  plop.setHelper('sendFormdata', function(parameters) {
    if (!parameters || _.isEmpty(parameters)) {
      return '';
    }
    const inFormDataParams = parameters.filter(
      (param) => param.in === 'formData'
    );
    if (_.isEmpty(inFormDataParams)) {
      return '';
    }
    const sendFormData = inFormDataParams.map(
      (data) => `    .send(${data.name})`
    );
    return `\n    .type('form')\n${sendFormData.join('\n')}`;
  });

  plop.setHelper('url', function(path) {
    const apiUrlPrefix = '${API_URL_PREFIX}';
    const regExp = new RegExp('\{', 'g');
    return `\`${apiUrlPrefix}${path.replace(regExp, '${')}\``;
  });

  plop.setHelper('it', function(summary, path) {
    // eslint-disable-next-line max-len
    return `Cannot ${summary.charAt(0).toLowerCase()}${summary.slice(1)} URI: ${path}`;
  });

  // generators
  plop.setGenerator('Not signed in testing', {
    description: 'Create a test suite for not signed in tests',
    prompts: [
      {
        type: 'input',
        name: 'suiteName',
        message: 'Test Suite name?',
      },
      {
        type: 'input',
        name: 'regExp',
        message: 'URL regular expression to filter the paths?',
      },
    ],
    actions: function(data) {

      if(!settings.specs_pathname) {
        throw 'The specs_pathname value is empty in settings.json. Please, fill it out with the path name to your JSON API specs.';
      }

      const testData = [];
      const specsPathname = path.join(__dirname, settings.specs_pathname)
      const testDefs = helper.getTestDefs(data.regExp, specsPathname);
      _.forIn(testDefs, (value, path) => { // iterate over the paths
        _.forIn(value, (v, method) => { // Iterate over the methods in each path
          testData.push(
            {
              path,
              method,
              summary: v.summary,
              operationId: v.operationId,
              parameters: v.parameters,
            }
          );
        });
      });
      // Get the helper function
      const kebabCase = plop.getHelper('kebabCase');
      const filename = helper.getOutputFilename(settings.output_directory, data.suiteName, 'not-signedin-test', kebabCase);

      data.testData = testData;

      data.apiUrlPrefix = settings.api_url_prefix;
      data.testTimeout = settings.test_timeout;

      // eslint-disable-next-line max-len
      const outputPath = path.join(__dirname, `${settings.output_directory}`, `./{{suiteName}}/${filename}`);
      return [
        {
          type: 'add',
          path: outputPath,
          templateFile: 'plop-templates/remote_method_test/index_not_signedin.hbs',
        },
      ];
    },
  });

  plop.setGenerator('Signed in testing', {
    description: 'Create a test suite to signed in tests',
    prompts: [
      {
        type: 'input',
        name: 'suiteName',
        message: 'Test Suite name?',
      },
      {
        type: 'input',
        name: 'regExp',
        message: 'URL regular expression to filter the paths?',
      },
    ],
    actions: function(data) {

      if(!settings.specs_pathname) {
        throw 'The specs_pathname value is empty in settings.json. Please, fill it out with the path name to your JSON API specs.';
      }
      
      const testData = [];
      const specsPathname = path.join(__dirname, settings.specs_pathname)
      const testDefs = helper.getTestDefs(data.regExp, specsPathname);

      _.forIn(testDefs, (value, path) => { // iterate over the paths
        _.forIn(value, (v, method) => { // Iterate over the methods in each path
          testData.push(
            {
              path,
              method,
              summary: v.summary,
              operationId: v.operationId,
              parameters: v.parameters,
            }
          );
        });
      });
      data.testData = testData;

      data.apiUrlPrefix = settings.api_url_prefix;
      data.testTimeout = settings.test_timeout;

      // Get the helper function
      const kebabCase = plop.getHelper('kebabCase');
      const filename = helper.getOutputFilename(settings.output_directory, data.suiteName, 'signedin-test', kebabCase);

      // eslint-disable-next-line max-len
      const outputPath = path.join(__dirname, `${settings.output_directory}`, `./{{suiteName}}/${filename}`);
      return [
        {
          type: 'add',
          path: outputPath,
          templateFile: 'plop-templates/remote_method_test/index_signedin.hbs',
        },
      ];
    },
  });
};


module.exports = plopFunction;