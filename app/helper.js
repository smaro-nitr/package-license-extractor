const execSync = require('child_process').execSync;
const fs = require("fs");
const { Parser } = require('json2csv');

const getNewObject = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

const extractDependencyInfo = (dependencyInfoInit, packageProcessedInit, dependency, eachFileName, package) => {
	const dependencyJson = getNewObject(dependencyInfoInit);
	let packageProcessed = packageProcessedInit;

	Object.keys(dependency).forEach(x => {
    console.log('\x1b[34m', `${packageProcessed} : ${eachFileName} - ${x}@${dependency[x]}`, '\u001B[0m');

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
        if (x === y.name && dependency[x] === y.version) {
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
	const beautifiedFinalJson = JSON.stringify(getNewObject(sortedDependencyJson), null, 4);

	fs.writeFile(`app/output/${outputFileName}.json`, beautifiedFinalJson, (err) => {
		if (err) console.log('\x1b[31m', err, '\u001B[0m');
		console.log('\x1b[32m', 'Successfully generated the JSON file', '\u001B[0m');
	});
};

const generateCsvFile = (sortedDependencyJson, outputFileName) => {
	const fields = [
		{ label: 'Name', value: 'name' },
		{ label: 'Version', value: 'version' },
		{ label: 'License', value: 'license' },
		{ label: 'Link', value: 'link' },
		{ label: 'Package', value: 'package' }
	];
	try {
		const json2csvParser = new Parser({ fields });
		const csv = json2csvParser.parse(sortedDependencyJson);
		fs.writeFile(`app/output/${outputFileName}.csv`, csv, (err) => {
			if (err) console.log('\x1b[31m', err, '\u001B[0m');
			console.log('\x1b[32m', 'Successfully generated the CSV file', '\u001B[0m');
		});
	} catch (err) {
		console.log('\x1b[31m', err, '\u001B[0m');
	}
};

module.exports = { extractDependencyInfo, generateJsonFile, generateCsvFile };