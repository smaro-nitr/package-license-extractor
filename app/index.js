const Helper = require('./helper');

const inputFileName = ['WebModules'];
const outputFileName = 'final';

let packageProcessed = 0;
let dependencyJson = [];
inputFileName.forEach(eachFile => {
  const packagePath = `app/input/${eachFile}.json`;
  console.log('\x1b[35m', `\n\n>>> processing ${packagePath}`, '\x1b[0m');

  const data = require(packagePath);
  const package = data.name.toLowerCase();
  const prodDependency = data.dependencies;
  const devDependency = data.devDependencies;

  const prodDependencyInfo = Helper.extractDependencyInfo(dependencyJson, packageProcessed, prodDependency, eachFile, package);
  dependencyJson = prodDependencyInfo.dependencyJson;
  packageProcessed = prodDependencyInfo.packageProcessed;

  const devDependencyInfo = Helper.extractDependencyInfo(dependencyJson, packageProcessed, devDependency, eachFile, package);
  dependencyJson = devDependencyInfo.dependencyJson;
  packageProcessed = devDependencyInfo.packageProcessed;
});

const sortedDependencyJson = dependencyJson.sort((a, b) => { return a.name > b.name ? 1 : -1; });

Helper.generateJsonFile(sortedDependencyJson, outputFileName);
Helper.generateCsvFile(sortedDependencyJson, outputFileName);
