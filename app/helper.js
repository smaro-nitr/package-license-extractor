const execSync = require('child_process').execSync;
const fs = require("fs");
const path = require('path');
const { Parser } = require('json2csv');
const Constant = require('./constant');
const getNewObject = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};
const httpsAppend = "https://";

const extractDependencyInfo = (dependencyInfoInit, packageProcessedInit, dependency, eachFileName, package) => {
  const dependencyJson = getNewObject(dependencyInfoInit);
	let packageProcessed = packageProcessedInit;
  if(dependency){
    Object.keys(dependency).forEach(x => {
      console.log(Constant.color.blue, `${packageProcessed} : ${eachFileName} - ${x}@${dependency[x]}`, Constant.color.reset);
  
      if (dependency[x].length <= 10 && !dependency[x].includes("file")) {
        const dependecyInfo = `npm view ${x}@${dependency[x]}`;
        try {
          const dependecyInfoString = execSync(dependecyInfo).toString('utf8');
          packageProcessed++;
          const nextLineSplitArray = dependecyInfoString.split('\n');
          const escapeSplitArray = nextLineSplitArray[1].split('\u001b');
          const name = escapeSplitArray[3].split('').splice(4, escapeSplitArray[3].length).join('');
          const version = escapeSplitArray[5].split('').splice(4, escapeSplitArray[5].length).join('');
          const license = escapeSplitArray[9].split('').splice(4, escapeSplitArray[9].length).join('');
          
          const urlVersionDependency = `npm view ${x}@^${dependency[x]} npm repository.url`;
          let link = execSync(urlVersionDependency).toString('utf8').trim();
          link = getHttpsUrl(link);
          const dependecyInfoObject = { name, version, license, link, package };
          let pushToFinalObject = true;
          let oldMatchingValue = {};
         
          dependencyJson.forEach(y => {         
            if (x.trim() === y.name.trim() && dependency[x].trim() === y.version.trim()) {
              pushToFinalObject = false;
              oldMatchingValue = y;
            }
          });
          
          if (pushToFinalObject) {
            dependencyJson.push(dependecyInfoObject);
            pushToFinalObject = false;
          } 
          else {
            oldMatchingValue.package += ` ,${package}`;
          }
        }
        catch(err) {
          console.log("NPM throws exception" + err);
        }     
      
      } 
      else {
        dependencyJson.push({ name: x, version: dependency[x], license: 'UNKNOWN', link: 'NA', package });
      }
    });
  }
	
	
	return { dependencyJson, packageProcessed };
};

const getHttpsUrl = (link) => {
  if(link.startsWith("git+")) {
    link  = link.substring(4);
  }
  if(link.endsWith(".git")) {
    link  = link.substring(0,link.length - 4);
  }
  if(link.startsWith("git:")) {
    link = link.substring(6);
    link = httpsAppend + link;
  }
  if(link.startsWith("ssh:")) {
    link = link.substring(6);
    link = httpsAppend + link;
  }
  if(link.startsWith("git@")) {
    link = link.substring(4);
    link = httpsAppend + link;
  }
  return link;
}

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
			console.log(Constant.color.green, Constant.successText.csv, Constant.color.reset);
		});
	} catch (err) {
		console.log(Constant.color.red, err, Constant.color.reset);
	}
};

module.exports = { extractDependencyInfo, generateJsonFile, generateCsvFile };