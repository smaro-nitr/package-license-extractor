const path = require('path');
const fs = require("fs");
const Helper = require('./helper');
const Constant = require('./constant');

const inputFileName = Constant.io.inputFileName;
const outputFileName = Constant.io.outputFileName;

let packageProcessed = 0;
let dependencyJson = [];
inputFileName.forEach(eachFile => {
  const packagePath = path.join(__dirname, 'input', `${eachFile}${Constant.fileExtension.json}`);
  console.log(Constant.color.magenta, `\n\n>>> processing ${packagePath}`, Constant.color.reset);
  const data = require(packagePath);
  const packageName = data.name.toLowerCase();
  const prodDependency = data.dependencies;
  const devDependency = data.devDependencies;

  const prodDependencyInfo = Helper.extractDependencyInfo(dependencyJson, packageProcessed, prodDependency, eachFile, packageName);
  dependencyJson = prodDependencyInfo.dependencyJson;
  packageProcessed = prodDependencyInfo.packageProcessed;

  const devDependencyInfo = Helper.extractDependencyInfo(dependencyJson, packageProcessed, devDependency, eachFile, packageName);
  dependencyJson = devDependencyInfo.dependencyJson;
  packageProcessed = devDependencyInfo.packageProcessed;
});

const sortedDependencyJson = dependencyJson.sort((a, b) => { return a.name > b.name ? 1 : -1; });

(() => fs.existsSync(path.join(__dirname, 'output')) || fs.mkdirSync(path.join(__dirname, 'output')))();
Helper.generateJsonFile(sortedDependencyJson, outputFileName);
Helper.generateCsvFile(sortedDependencyJson, outputFileName);
