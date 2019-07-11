const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const Constant = require('./constant');

const getInputFilesPath = (basePath, inputFoldersName) => {
  const inputFilesPath = [];

  inputFoldersName.forEach(folderName => {
    const projectPath = path.join(basePath, folderName);
    fs.readdirSync(projectPath).forEach(file => {
      const fileName = path.parse(file).name;
      const fileExtension = path.parse(file).ext;
      if (fileName === Constant.io.inputFileName && fileExtension === Constant.fileExtension.json) {
        inputFilesPath.push(path.join(projectPath, file));
      }
    });
  })

  return inputFilesPath;
}

const getNewObject = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

const getHttpsUrl = (link) => {
  let httpsUrl = link ? Constant.https + link.substring(link.indexOf('github.com'), link.length) : 'NA';
  return httpsUrl;
}

const extractDependencyInfo = (dependencyInfoInit, packageProcessedInit, dependency, packageName) => {
  const dependencyJson = getNewObject(dependencyInfoInit);
  let packageProcessed = packageProcessedInit;
  if (dependency === Object(dependency)) {
    Object.keys(dependency).forEach(dependencyName => {
      const dependencyVersion = dependency[dependencyName];
      packageProcessed++;
      console.log(Constant.color.blue, `${packageProcessed} : ${dependencyName}@${dependencyVersion}`, Constant.color.reset);
      
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
            const dependecyInfo = `npm view ${dependencyName}@${dependencyVersion} --silent`;
            const dependecyInfoString = execSync(dependecyInfo).toString('utf8');
            const nextLineSplitArray = dependecyInfoString.split('\n');
            const escapeSplitArray = nextLineSplitArray[1].split('\u001b');
            let license = escapeSplitArray[9].split('').splice(4, escapeSplitArray[9].length).join('');
            if (!license) license = escapeSplitArray[10].split('').splice(4, escapeSplitArray[10].length).join('');

            const urlVersionDependency = `npm view ${dependencyName}@^${dependencyVersion} npm repository.url --silent`;
            const link = getHttpsUrl(execSync(urlVersionDependency).toString('utf8').trim());

            dependencyJson.push({ name: dependencyName, version: dependencyVersion, license, link, packageName });
            pushToFinalObject = false;
          } else {
            const packageNameDoesnotExist = oldMatchingValue.packageName.indexOf(packageName) < 0;
            if (packageNameDoesnotExist) oldMatchingValue.packageName += `, ${packageName}`;
          }
        } else {
          throw Constant.textMessage.invalidNpmDependency;
        }
      } catch (err) {
        dependencyJson.push({ name: dependencyName, version: dependencyVersion, license: 'UNKNOWN', link: 'NA', packageName });
        console.log(Constant.color.red, Constant.textMessage.npmException + err, Constant.color.reset);
      }
    });
  }

  return { dependencyJson, packageProcessed };
};

const generateJsonFile = (sortedDependencyJson, outputFilePath, outputFileName) => {
  const filePath = path.join(outputFilePath, `${outputFileName}${Constant.fileExtension.json}`);
  const beautifiedFinalJson = JSON.stringify(getNewObject(sortedDependencyJson), null, 4);
  fs.writeFile(filePath, beautifiedFinalJson, (err) => {
    if (err) {
      console.log(Constant.color.red, err, Constant.color.reset);
      return;
    }
    console.log(Constant.color.green, Constant.textMessage.jsonSuccess, Constant.color.reset);
  });
};

const generateCsvFile = (sortedDependencyJson, outputFilePath, outputFileName) => {
  const filePath = path.join(outputFilePath, `${outputFileName}${Constant.fileExtension.csv}`);
  try {
    const json2csvParser = new Parser({ fields: Constant.csvField });
    const csvParsedData = json2csvParser.parse(sortedDependencyJson);
    fs.writeFile(filePath, csvParsedData, (err) => {
      if (err) {
        console.log(Constant.color.red, err, Constant.color.reset);
        return;
      }
      console.log(Constant.color.green, Constant.textMessage.csvSuccess, Constant.color.reset);
    });
  } catch (err) {
    console.log(Constant.color.red, err, Constant.color.reset);
  }
};

module.exports = { getInputFilesPath, extractDependencyInfo, generateJsonFile, generateCsvFile };