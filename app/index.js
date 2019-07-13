#!/usr/bin/env node

const [...args] = process.argv

const Helper = require('./helper');
const Constant = require('./constant');

const basePath = process.cwd();

const inputFoldersName = Helper.getInputFoldersName(basePath);
const inputFilesPath = Helper.getInputFilesPath(basePath, inputFoldersName);

const outputFolderName = Constant.IO.outputFolderName;
const outputFileName = Constant.IO.outputFileName;

let generateOutputFile = false;

let packageProcessed = 0;
let dependencyJson = [];
if (Array.isArray(inputFilesPath) && inputFilesPath.length > 0) {
  inputFilesPath.forEach(packagePath => {
    console.log(Constant.COLOR.magenta, `\n>>> processing ${packagePath}`, Constant.COLOR.reset);

    try {
      const data = require(packagePath);
      const packageName = data && data.name ? data.name.toString().toLowerCase() : 'NA';
      const prodDependency = data && data.dependencies;
      const devDependency = data && data.devDependencies;

      const prodDependencyInfo = Helper.extractDependencyInfo(dependencyJson, packageProcessed, prodDependency, packageName);
      dependencyJson = prodDependencyInfo.dependencyJson;
      packageProcessed = prodDependencyInfo.packageProcessed;
        
      const devDependencyInfo = Helper.extractDependencyInfo(dependencyJson, packageProcessed, devDependency, packageName);
      dependencyJson = devDependencyInfo.dependencyJson;
      packageProcessed = devDependencyInfo.packageProcessed;
      
      generateOutputFile = true;
    } catch (err) {
      console.log(Constant.COLOR.red, Constant.MESSAGE.fileReadException + err, Constant.COLOR.reset);
    }
  })
} else {
  console.log(Constant.COLOR.red, Constant.MESSAGE.invalidInputFileName + basePath, Constant.COLOR.reset);
}

if (generateOutputFile) {
  Helper.generateOutputFolder(basePath, outputFolderName);
  console.log('\n');

  const sortedDependencyJson = dependencyJson.sort((a, b) => { return a.name > b.name ? 1 : -1; });
  Helper.generateJsonFile(sortedDependencyJson, basePath, outputFolderName, outputFileName);
  Helper.generateCsvFile(sortedDependencyJson, basePath, outputFolderName, outputFileName);
}
