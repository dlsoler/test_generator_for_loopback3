const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const numeral = require('numeral');

/**
 * Returns the filtered test definitions
 * @param {*} regExpString Regular expression to filter the api paths
 * @param {*} apiSpecsPathname Pathname to the JSON file containing the Swagger specs
 */
function getTestDefs(regExpString, apiSpecsPathname) {
  
  if(!fs.existsSync(apiSpecsPathname)) {
    throw `The file ${apiSpecsPathname} does not exist.`
  }


  // The Swagger Api definition
  const apiDef = require(apiSpecsPathname);

  // Regular expression to filter the paths
  const regex = new RegExp(regExpString);

  // Filter the customer paths
  const filteredPaths = _.keys(apiDef.paths)
  .filter((path) => regex.test(path));

  // Check if there is any filtered path
  if (_.isEmpty(filteredPaths)) {
    return []; // Could not find any path
  }

  // Return only the objects for the found paths
  return _.pick(apiDef.paths, filteredPaths);
}

/**
 * Returns the output filename
 * @param {sting} outputDirectory
 * @param {string} suiteName 
 * @param {string} postfix 
 * @param {function} helperFunct 
 */
function getOutputFilename(outputDirectory, suiteName, postfix, helperFunct) {
  
  const transformedSuitName = helperFunct(suiteName);

  const suiteDir = path.join(outputDirectory, `./${suiteName}/`);
  
  let filenames;
  try {
    filenames = fs.readdirSync(suiteDir);
  } catch(e) {
    return `0001-${transformedSuitName}-${postfix}.js`;
  }

  if (filenames.length === 0) { // There is only 2 entries: . and ..
    return `0001-${transformedSuitName}-${postfix}.js`;
  }

  let num = 0;

  filenames.forEach((value, index) => {

    const parts = value.split('-');
    
    const tmp = parseInt(parts[0]);

    if (isNaN(tmp) || tmp < num) {
      return;
    }
    num = tmp + 1;
  });

  return `${numeral(num).format('0000')}-${transformedSuitName}-${postfix}.js`;

}


function Helper() {};


Helper.prototype.getTestDefs = getTestDefs;
Helper.prototype.getOutputFilename = getOutputFilename;

module.exports = new Helper();


