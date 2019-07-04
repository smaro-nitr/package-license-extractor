const path = require('path');
const fs = require("fs");
const Helper = require('./helper');
const Constant = require('./constant');

const baseFolderName = Constant.io.baseFolderName;

const inputFolderName = Constant.io.inputFolderName;
(() => fs.existsSync(path.join(__dirname, inputFolderName)) || fs.mkdirSync(path.join(__dirname, inputFolderName)))();
const inputFileName = Helper.getInputFileName(path.join(baseFolderName, inputFolderName));

const outputFolderName = Constant.io.outputFolderName;
(() => fs.existsSync(path.join(__dirname, outputFolderName)) || fs.mkdirSync(path.join(__dirname, outputFolderName)))();
const outputFileName = Constant.io.outputFileName;

let packageProcessed = 0;
let dependencyJson = [];
let generateFile = false;
if (Array.isArray(inputFileName) && inputFileName.length > 0) {
  inputFileName.forEach(eachFile => {
    const packagePath = path.join(__dirname, inputFolderName, `${eachFile}${Constant.fileExtension.json}`);
    console.log(Constant.color.magenta, `\n>>> processing ${packagePath}`, Constant.color.reset);

    try {
      const data = require(packagePath);
      const packageName = data && data.name ? data.name.toString().toLowerCase() : eachFile.toString();
      const prodDependency = data && data.dependencies;
      const devDependency = data && data.devDependencies;

      if (prodDependency === Object(prodDependency)) {
        const prodDependencyInfo = Helper.extractDependencyInfo(dependencyJson, packageProcessed, prodDependency, eachFile, packageName);
        dependencyJson = prodDependencyInfo.dependencyJson;
        packageProcessed = prodDependencyInfo.packageProcessed;
        generateFile = true;
      }

      if (devDependency === Object(devDependency)) {
        const devDependencyInfo = Helper.extractDependencyInfo(dependencyJson, packageProcessed, devDependency, eachFile, packageName);
        dependencyJson = devDependencyInfo.dependencyJson;
        packageProcessed = devDependencyInfo.packageProcessed;
        generateFile = true;
      }
    } catch (err) {
      console.log(Constant.color.red, Constant.textMessage.fileReadException + err, Constant.color.reset);
    }
  })
} else {
  console.log(Constant.color.red, Constant.textMessage.invalidInputFileName, Constant.color.reset);
}

const sortedDependencyJson = dependencyJson.sort((a, b) => { return a.name > b.name ? 1 : -1; });

generateFile && console.log('\n');
generateFile && Helper.generateJsonFile(sortedDependencyJson, outputFileName);
generateFile && Helper.generateCsvFile(sortedDependencyJson, outputFileName);
