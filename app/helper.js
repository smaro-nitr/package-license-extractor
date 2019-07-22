const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

const Constant = require('./constant');

const getCustomArgs = (args) => {
  const customArgs = {};

  Array.isArray(args) && args.forEach(eachArg => {
    const customArgEqualToIndex = eachArg.indexOf('=');
    const removeCustomArgFlagNotion = eachArg.replace(/^--+/i, '');
    if (customArgEqualToIndex > 0 && removeCustomArgFlagNotion) {
      const argsKey = eachArg.substring(2, customArgEqualToIndex);
      const argsValue = eachArg.substring(customArgEqualToIndex + 1, eachArg.length);
      customArgs[argsKey] = argsValue;
    }
  });

  return customArgs;
};

const getInputFoldersName = (basePath, projectScanType) => {
  let inputFoldersName = [];

  if (projectScanType === Constant.ARGS.projectScanType[1]) {
    inputFoldersName = fs.readdirSync(basePath).filter(fileName => {
      return !fs.lstatSync(fileName).isFile();
    });
  } else {
    inputFoldersName.push('');
  }

  return inputFoldersName;
};

const getInputFilesPath = (basePath, inputFoldersName) => {
  const inputFilesPath = [];

  inputFoldersName.forEach(folderName => {
    const projectPath = path.join(basePath, folderName);
    fs.readdirSync(projectPath).forEach(file => {
      const fileName = path.parse(file).name;
      const FILE_EXTENSION = path.parse(file).ext;
      if (fileName === Constant.IO.inputFileName && FILE_EXTENSION === Constant.FILE_EXTENSION.json) {
        inputFilesPath.push(path.join(projectPath, file));
      }
    });
  });

  return inputFilesPath;
}

const getNewObject = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

const isValidUrl = (link) => {
  console.log(Constant.COLOR.dim, Constant.COLOR.cyan, `${Constant.MESSAGE.validatingUrl}${link}`, Constant.COLOR.reset);
  const request = new XMLHttpRequest();
  request.open('GET', link, false);
  request.send(null);
  if (request.status === 200) return true;
  return false;
};

const getLinkDetail = (link) => {
  let linkDetail = { type: 'UNKNOWN', url: 'NA' };
  if (link) {
    let repositoryUrl = Constant.URL.https + link.substring(link.indexOf('github.com'), link.length);
    if (repositoryUrl.indexOf('\'') > 0)
      repositoryUrl = repositoryUrl.substring(0, repositoryUrl.indexOf('\''));
    if (repositoryUrl.indexOf('.git') === (repositoryUrl.length - 4))
      repositoryUrl = repositoryUrl.substring(0, repositoryUrl.length - 4);

    const licenseUrl = repositoryUrl + Constant.URL.licensePath;

    if (isValidUrl(licenseUrl)) {
      linkDetail.url = licenseUrl;
      linkDetail.type = Constant.URL.licenseType.license;
    } else if (isValidUrl(repositoryUrl)) {
      linkDetail.url = repositoryUrl;
      linkDetail.type = Constant.URL.licenseType.repository;
    }
  }
  return linkDetail;
}

const getExactDependecyVersion = (dependencyVersion) => {
  if (dependencyVersion.indexOf('^') === 0 || dependencyVersion.indexOf('~') === 0) {
    return dependencyVersion.substring(1, dependencyVersion.length);
  }
  return dependencyVersion;
}

const extractDependencyInfo = (dependencyInfoInit, packageProcessedInit, dependency, packageName) => {
  const dependencyJson = getNewObject(dependencyInfoInit);
  let packageProcessed = packageProcessedInit;
  if (dependency === Object(dependency)) {
    Object.keys(dependency).forEach(dependencyName => {
      const dependencyVersion = dependency[dependencyName];
      packageProcessed++;
      console.log(Constant.COLOR.cyan, `${packageProcessed}: ${dependencyName}@${dependencyVersion}`, Constant.COLOR.reset);

      const isNpmDependency = dependencyVersion.toString().toLowerCase().indexOf('file') < 0;
      try {
        if (isNpmDependency) {
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

            const exactDependencyVersion = getExactDependecyVersion(dependencyVersion);
            const urlVersionDependency = `npm view ${dependencyName}@${dependencyVersion} npm repository.url --silent`;
            const linkDetail = getLinkDetail(execSync(urlVersionDependency).toString('utf8').trim());
            const linkType = linkDetail.type;
            const linkUrl = linkDetail.url;

            dependencyJson.push({ name: dependencyName, version: dependencyVersion, license, linkType, linkUrl, packageName });
            pushToFinalObject = false;
          } else {
            const packageNameDoesnotExist = oldMatchingValue.packageName.indexOf(packageName) < 0;
            if (packageNameDoesnotExist) oldMatchingValue.packageName += `, ${packageName}`;
          }
        } else {
          throw Constant.MESSAGE.invalidNpmDependency;
        }
      } catch (err) {
        dependencyJson.push({ name: dependencyName, version: dependencyVersion, license: 'UNKNOWN', linkType:'UNKNOWN', linkUrl: 'NA', packageName });
        console.log(Constant.COLOR.red, Constant.MESSAGE.npmException + err, Constant.COLOR.reset);
      }
    });
  }

  return { dependencyJson, packageProcessed };
};

const generateOutputFolder = (basePath, outputFolderName) => {
  return fs.existsSync(path.join(basePath, outputFolderName)) || fs.mkdirSync(path.join(basePath, outputFolderName));
};

const generateJsonFile = (sortedDependencyJson, outputFilePath, outputFolderName, outputFileName) => {
  const filePath = path.join(outputFilePath, outputFolderName, `${outputFileName}${Constant.FILE_EXTENSION.json}`);
  const beautifiedFinalJson = JSON.stringify(getNewObject(sortedDependencyJson), null, 4);
  fs.writeFile(filePath, beautifiedFinalJson, (err) => {
    if (err) {
      console.log(Constant.COLOR.red, err, Constant.COLOR.reset);
      return;
    }
    console.log(Constant.COLOR.green, Constant.MESSAGE.jsonSuccess, Constant.COLOR.reset);
  });
};

const generateCsvFile = (sortedDependencyJson, outputFilePath, outputFolderName, outputFileName) => {
  const filePath = path.join(outputFilePath, outputFolderName, `${outputFileName}${Constant.FILE_EXTENSION.csv}`);
  try {
    const json2csvParser = new Parser({ fields: Constant.CSV_FIELD });
    const csvParsedData = json2csvParser.parse(sortedDependencyJson);
    fs.writeFile(filePath, csvParsedData, (err) => {
      if (err) {
        console.log(Constant.COLOR.red, err, Constant.COLOR.reset);
        return;
      }
      console.log(Constant.COLOR.green, Constant.MESSAGE.csvSuccess, Constant.COLOR.reset);
    });
  } catch (err) {
    console.log(Constant.COLOR.red, err, Constant.COLOR.reset);
  }
};

const exportModule = {
  getCustomArgs,
  getInputFoldersName,
  getInputFilesPath,
  extractDependencyInfo,
  generateOutputFolder,
  generateJsonFile,
  generateCsvFile
};

module.exports = exportModule;
