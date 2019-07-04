const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const Constant = require('./constant');

const getInputFileName = (dirPath) => {
  const inputFileName = [];

  fs.readdirSync(dirPath).forEach(filename => {
    const fileName = path.parse(filename).name;
    const fileExtension = path.parse(filename).ext;
    if (fileExtension === Constant.fileExtension.json) inputFileName.push(fileName);
  });

  return inputFileName;
}

const getNewObject = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

const getHttpsUrl = (link) => {
  let httpsUrl = Constant.https + link.substring(link.indexOf('github.com'), link.length);
  return httpsUrl;
}

const extractDependencyInfo = (dependencyInfoInit, packageProcessedInit, dependency, eachFileName, packageName) => {
  const dependencyJson = getNewObject(dependencyInfoInit);
  let packageProcessed = packageProcessedInit;
  if (dependency) {
    Object.keys(dependency).forEach(dependencyName => {
      const dependencyVersion = dependency[dependencyName];
      packageProcessed++;
      console.log(Constant.color.blue, `${packageProcessed} : ${eachFileName} - ${dependencyName}@${dependencyVersion}`, Constant.color.reset);
      
      const isNpmDependency = dependencyVersion.toString().toLowerCase().indexOf('file') < 0;
      try {
        if(isNpmDependency) {
          let pushToFinalObject = true;
          let oldMatchingValue = {};
          dependencyJson.forEach(existingDependency => {
            const existingDependencyName = existingDependency.name;
            const existingDependencyVersion = existingDependency.version;
            if (dependencyName === existingDependencyName && dependencyVersion === existingDependencyVersion) {
              pushToFinalObject = false;
              oldMatchingValue = existingDependency;
            }
          });

          if (pushToFinalObject) {
            const dependecyInfo = `npm view ${dependencyName}@${dependencyVersion}`;
            const dependecyInfoString = execSync(dependecyInfo).toString('utf8');
            const nextLineSplitArray = dependecyInfoString.split('\n');
            const escapeSplitArray = nextLineSplitArray[1].split('\u001b');
            const license = escapeSplitArray[9].split('').splice(4, escapeSplitArray[9].length).join('');

            const urlVersionDependency = `npm view ${dependencyName}@^${dependencyVersion} npm repository.url`;
            const link = getHttpsUrl(execSync(urlVersionDependency).toString('utf8').trim());

            dependencyJson.push({ name: dependencyName, version: dependencyVersion, license, link, packageName });
            pushToFinalObject = false;
          } else {
            oldMatchingValue.packageName += `, ${packageName}`;
          }
        } else {
          throw Constant.textMessage.invalidNpmDependency;
        }
      } catch (err) {
        dependencyJson.push({ name: dependencyName, version: dependencyVersion, license: 'UNKNOWN', link: 'NA', packageName: 'NA' });
        console.log(Constant.color.red, Constant.textMessage.npmException + err, Constant.color.reset);
      }
    });
  }

  return { dependencyJson, packageProcessed };
};

const generateJsonFile = (sortedDependencyJson, outputFileName) => {
  const filePath = path.join('app', 'output', `${outputFileName}${Constant.fileExtension.json}`);
  const beautifiedFinalJson = JSON.stringify(getNewObject(sortedDependencyJson), null, 4);
  fs.writeFile(filePath, beautifiedFinalJson, (err) => {
    if (err) console.log(Constant.color.red, err, Constant.color.reset);
    console.log(Constant.color.green, Constant.textMessage.jsonSuccess, Constant.color.reset);
  });
};

const generateCsvFile = (sortedDependencyJson, outputFileName) => {
  try {
    const filePath = path.join('app', 'output', `${outputFileName}${Constant.fileExtension.csv}`);
    const json2csvParser = new Parser({ fields: Constant.csvField });
    const csvParsedData = json2csvParser.parse(sortedDependencyJson);
    fs.writeFile(filePath, csvParsedData, (err) => {
      if (err) console.log(Constant.color.red, err, Constant.color.reset);
      console.log(Constant.color.green, Constant.textMessage.csvSuccess, Constant.color.reset);
    });
  } catch (err) {
    console.log(Constant.color.red, err, Constant.color.reset);
  }
};

module.exports = { getInputFileName, extractDependencyInfo, generateJsonFile, generateCsvFile };