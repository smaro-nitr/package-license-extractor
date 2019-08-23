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

const getRepositoryUrl = (link) => {
  let repositoryUrl = Constant.URL.https + link.substring(link.indexOf('github.com'), link.length);
  if (repositoryUrl.indexOf('\'') > 0)
    repositoryUrl = repositoryUrl.substring(0, repositoryUrl.indexOf('\''));
  if (repositoryUrl.indexOf('.git') === (repositoryUrl.length - 4))
    repositoryUrl = repositoryUrl.substring(0, repositoryUrl.length - 4);
  return repositoryUrl;
};

const isValidUrl = (link) => {
  if (link) {
    console.log(Constant.COLOR.dim, Constant.COLOR.cyan, `${Constant.MESSAGE.validatingUrl}${link}`, Constant.COLOR.reset);
    const request = new XMLHttpRequest();
    request.open('GET', link, false);
    request.send(null);
    if (request.status === 200) return true;
  }
  return false;
};

const getLinkDetail = (dependencyName, exactDependencyVersion) => {
  const exactVersionDependency = `npm view ${dependencyName}@${exactDependencyVersion} npm repository.url --silent`;
  const exactVersionLink = execSync(exactVersionDependency).toString('utf8').trim();

  const latestVersionDependency = `npm view ${dependencyName} npm repository.url --silent`;
  const latestVersionLink = execSync(latestVersionDependency).toString('utf8').trim();

  let linkDetail = { type: Constant.MESSAGE.unknown, url: Constant.MESSAGE.na };

  const isValidExactVersionLink = exactVersionLink.includes('github.com');
  const exactVersionRepositoryUrl = isValidExactVersionLink && getRepositoryUrl(exactVersionLink);
  const exactVersionUppercaseLicenseUrl = exactVersionRepositoryUrl && (exactVersionRepositoryUrl + Constant.URL.uppercaseLicensePath);
  const exactVersionCapitalizeLicenseUrl = exactVersionRepositoryUrl && (exactVersionRepositoryUrl + Constant.URL.capitalizeLicensePath);
  const exactVersionLicenseUrlWithMdExtension = exactVersionUppercaseLicenseUrl && (exactVersionRepositoryUrl + Constant.URL.licensePathWithMdExtension);

  const isValidLatestVersionLink = latestVersionLink.includes('github.com');
  const latestVersionRepositoryUrl = isValidLatestVersionLink && getRepositoryUrl(latestVersionLink);
  const latestVersionUppercaseLicenseUrl = latestVersionRepositoryUrl && (latestVersionRepositoryUrl + Constant.URL.uppercaseLicensePath);
  const latestVersionCapitalizeLicenseUrl = latestVersionRepositoryUrl && (latestVersionRepositoryUrl + Constant.URL.capitalizeLicensePath);
  const latestVersionLicenseUrlWithMdExtension = latestVersionUppercaseLicenseUrl && (latestVersionRepositoryUrl + Constant.URL.licensePathWithMdExtension);

  const registryUrl = Constant.URL.https + Constant.URL.npmRegistry + dependencyName + '/v/' + exactDependencyVersion;

  if (isValidUrl(exactVersionUppercaseLicenseUrl)) {
    linkDetail.url = exactVersionUppercaseLicenseUrl;
    linkDetail.type = Constant.URL.licenseType.license;
  } else if (isValidUrl(exactVersionLicenseUrlWithMdExtension)) {
    linkDetail.url = exactVersionLicenseUrlWithMdExtension;
    linkDetail.type = Constant.URL.licenseType.license;
  } else if (isValidUrl(exactVersionCapitalizeLicenseUrl)) {
    linkDetail.url = exactVersionCapitalizeLicenseUrl;
    linkDetail.type = Constant.URL.licenseType.license;
  } else if (isValidUrl(latestVersionUppercaseLicenseUrl)) {
    linkDetail.url = latestVersionUppercaseLicenseUrl;
    linkDetail.type = Constant.URL.licenseType.latestLicense;
  } else if (isValidUrl(latestVersionLicenseUrlWithMdExtension)) {
    linkDetail.url = latestVersionLicenseUrlWithMdExtension;
    linkDetail.type = Constant.URL.licenseType.latestLicense;
  }  else if (isValidUrl(latestVersionCapitalizeLicenseUrl)) {
    linkDetail.url = latestVersionCapitalizeLicenseUrl;
    linkDetail.type = Constant.URL.licenseType.latestLicense;
  } else if (isValidUrl(exactVersionRepositoryUrl)) {
    linkDetail.url = exactVersionRepositoryUrl;
    linkDetail.type = Constant.URL.licenseType.repository;
  } else if (isValidUrl(latestVersionRepositoryUrl)) {
    linkDetail.url = latestVersionRepositoryUrl;
    linkDetail.type = Constant.URL.licenseType.latestRepository;
  } else if (isValidUrl(registryUrl)) {
    linkDetail.url = registryUrl;
    linkDetail.type = Constant.URL.licenseType.registry;
  }

  return linkDetail;
}

const getExactDependecyVersion = (dependencyVersion) => {
  if (dependencyVersion.indexOf('^') === 0 || dependencyVersion.indexOf('~') === 0) {
    return dependencyVersion.substring(1, dependencyVersion.length);
  }
  return dependencyVersion;
}

const getDependencyLicense = (dependencyName, dependencyVersion) => {
  const dependecyInfo = `npm view ${dependencyName}@${dependencyVersion} --silent`;
  const dependecyInfoString = execSync(dependecyInfo).toString('utf8');
  const nextLineSplitArray = dependecyInfoString.split('\n');
  const escapeSplitArray = nextLineSplitArray[1].split('\u001b');
  let license = escapeSplitArray[9].split('').splice(4, escapeSplitArray[9].length).join('');
  if (!license) license = escapeSplitArray[10].split('').splice(4, escapeSplitArray[10].length).join('');
  return license
}

const extractDependencyInfo = (dependencyInfoInit, packageProcessedInit, dependency, packageName) => {
  const dependencyJson = getNewObject(dependencyInfoInit);
  let packageProcessed = packageProcessedInit;
  if (dependency === Object(dependency)) {
    Object.keys(dependency).forEach(dependencyName => {
      const dependencyVersion = dependency[dependencyName];
      const exactDependencyVersion = getExactDependecyVersion(dependencyVersion);
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
            if (dependencyName === existingDependencyName && exactDependencyVersion === existingDependencyVersion) {
              pushToFinalObject = false;
              oldMatchingValue = existingDependency;
            }
          });

          if (pushToFinalObject) {
            const license = getDependencyLicense(dependencyName, exactDependencyVersion);
            const linkDetail = getLinkDetail(dependencyName, exactDependencyVersion);
            const linkType = linkDetail.type;
            const linkUrl = linkDetail.url;

            dependencyJson.push({
              name: dependencyName,
              version: exactDependencyVersion,
              license,
              linkType,
              linkUrl,
              packageName
            });

            pushToFinalObject = false;
          } else {
            const packageNameDoesnotExist = oldMatchingValue.packageName.indexOf(packageName) < 0;
            if (packageNameDoesnotExist) oldMatchingValue.packageName += `, ${packageName}`;
          }
        } else {
          throw Constant.MESSAGE.invalidNpmDependency;
        }
      } catch (err) {
        dependencyJson.push({
          name: dependencyName,
          version: exactDependencyVersion,
          license: Constant.MESSAGE.unknown,
          linkType:Constant.MESSAGE.unknown,
          linkUrl: Constant.MESSAGE.na,
          packageName
        });
        console.log(Constant.COLOR.red, Constant.MESSAGE.npmException + err, Constant.COLOR.reset);
      }
    });
  }

  return { dependencyJson, packageProcessed };
};

const generateOutputFolder = (basePath, outputFolderName) => {
  return fs.existsSync(path.join(basePath, outputFolderName)) || fs.mkdirSync(path.join(basePath, outputFolderName));
};

const getTotalTimeElapsed = (startTime, endTime) => {
  const totalTimeElasapsedInMs = endTime - startTime;
  let date, hour, minute, second;
  second = Math.floor(totalTimeElasapsedInMs / 1000);
  minute = Math.floor(second / 60);
  second = second % 60;
  hour = Math.floor(minute / 60);
  minute = minute % 60;
  date = Math.floor(hour / 24);
  hour = hour % 24;
  hour += date * 24;
  const totalTimeElasapsed = `${hour}h ${minute}m ${second}s`;
  return totalTimeElasapsed;
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
  getTotalTimeElapsed,
  generateJsonFile,
  generateCsvFile
};

module.exports = exportModule;
