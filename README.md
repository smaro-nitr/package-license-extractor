# package-license-extractor

## About
To find the license of all npm dependency used in your project. Henceforth avoiding all legal challenges ahead.

## Installation
Global installation
```shell
npm install package-license-extractor -g
```

## Usage
Once globally installed, run below command at the parent folder level
```shell
extract-license
```

Example
* Folder Structure: C > My_All_Projects > Project_One, Project_Two
* Run the command in My_All_Projects folder to get the license detail of Project_One, Project_Two

## Output
* Find the output in a newly created folder "extracted_license"
* Output will be in CSV and JSON format
* Output will have following field: name, version, licencse, license/project url, package.json (sorted by name)

## Note
This package doesn`t require node_module in project to find license like other packages availiable in market. Hence internet connection is a must to make it work and time required to fetch depends upon the no of dependency and internet speed.

## Contact
* Author: Subhendu Kumar Sahoo
* Email: smaro.nitr@gmail.com
* Website: https://smaro-nitr.github.io
* Always welcome for bugfix, feature suggestion and feedback
