const execSync = require('child_process').execSync;
const fs = require("fs");
const path = require('path');
const { Parser } = require('json2csv');
const Constant = require('./constant');

const getNewObject = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

const extractDependencyInfo = (dependencyInfoInit, packageProcessedInit, dependency, eachFileName, package) => {
	const dependencyJson = getNewObject(dependencyInfoInit);
	let packageProcessed = packageProcessedInit;

	Object.keys(dependency).forEach(x => {
    console.log(Constant.color.blue, `${packageProcessed} : ${eachFileName} - ${x}@${dependency[x]}`, Constant.color.reset);

    if (dependency[x].length <= 10) {
      const dependecyInfo = `npm view ${x}@${dependency[x]}`;
      const dependecyInfoString = execSync(dependecyInfo).toString('utf8');
      packageProcessed++;

      const nextLineSplitArray = dependecyInfoString.split('\n');
      const escapeSplitArray = nextLineSplitArray[1].split('\u001b');

      const name = escapeSplitArray[3].split('').splice(4, escapeSplitArray[3].length).join('');
      const version = escapeSplitArray[5].split('').splice(4, escapeSplitArray[5].length).join('');
      const license = escapeSplitArray[9].split('').splice(4, escapeSplitArray[9].length).join('');
      const link = nextLineSplitArray[3].split('').splice(5, nextLineSplitArray[3].length - 10).join('');

      const dependecyInfoObject = { name, version, license, link, package };

      let pushToFinalObject = true;
      let oldMatchingValue = {};
      dependencyJson.forEach(y => {
        if (x.trim().toString() === y.name.trim().toString() &&
          dependency[x].trim().toString() === y.version.trim().toString()) {
          pushToFinalObject = false;
          oldMatchingValue = y;
        }
      });
      
      if (pushToFinalObject) {
        dependencyJson.push(dependecyInfoObject);
      } else {
        oldMatchingValue.package += ` ,${package}`;
      }
    } else {
      dependencyJson.push({ name: x, version: dependency[x], license: 'UNKNOWN', link: 'NA', package });
    }
	});
	
	return { dependencyJson, packageProcessed };
};

const generateJsonFile = (sortedDependencyJson, outputFileName) => {
  const filePath = path.join('app', 'output', `${outputFileName}${Constant.fileExtension.json}`);
	const beautifiedFinalJson = JSON.stringify(getNewObject(sortedDependencyJson), null, 4);
	fs.writeFile(filePath, beautifiedFinalJson, (err) => {
		if (err) console.log(Constant.color.red, err, Constant.color.reset);
		console.log(Constant.color.green, Constant.successText.json, Constant.color.reset);
	});
};

const generateCsvFile = (sortedDependencyJson, outputFileName) => {
	try {
    const filePath = path.join('app', 'output', `${outputFileName}${Constant.fileExtension.csv}`);
		const json2csvParser = new Parser({ fields: Constant.csvField });
		const csvParsedData = json2csvParser.parse(sortedDependencyJson);
		fs.writeFile(filePath, csvParsedData, (err) => {
			if (err) console.log(Constant.color.red, err, Constant.color.reset);
			console.log(Constant.color.green, Constant.successText.json, Constant.color.reset);
		});
	} catch (err) {
		console.log(Constant.color.red, err, Constant.color.reset);
	}
};

module.exports = { extractDependencyInfo, generateJsonFile, generateCsvFile };