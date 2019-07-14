# package-license-extractor

## About
To find the license of all npm dependency used in your project. Henceforth avoiding all legal challenges ahead.

Advantages:
* It doesn`t require node_modules to extract package's license details.
* All dependency with similar name and version are merged together.
* Doesn`t need to be installed along with your project dependency.
<br/>&nbsp;

## Installation
Global installation
```shell
npm install package-license-extractor -g
```
Note: Doesn`t required to be installed in your project
<br/>&nbsp;

## Flags Available
<table>
  <tr>
    <td>Flag</td>
    <td>&nbsp;</td>
    <td>Possible Value</td>
    <td>&nbsp;</td>
    <td>Default Value</td>
  <tr>
  <tr>
    <td><b>--projectScanType</b></td>
    <td>&nbsp;</td>
    <td>multi, single</td>
    <td>&nbsp;</td>
    <td>single</td>
  </tr>
</table>
<br/>&nbsp;

## Usage
Once globally installed. Based on your requirement, it can be used in following ways:

* If you want to scan a <b>single project</b>, then open the project folder and run the below command -
```shell
extract-license
```

* If you want to scan a <b>multiple project</b>, then open the parent folder containing all projects and run the below command -
```shell
extract-license --projectScanType=multi
```

Example (multiple project):
<br/>- Folder Structure: C > My_All_Projects > Project_One, Project_Two, So on ..
<br/>- Run the command in My_All_Projects folder to get the license detail of Project_One, Project_Two, So on ..
<br/>&nbsp;

## Output
* Find the output in a newly created folder "extracted_license".
* Output will be in CSV as well as JSON format.
* Output will have following field: name, version, licencse, license url, package name (sorted by name).
<br/>&nbsp;

## Note
Internet connection is a must to make it work and time required to fetch depends upon the no of dependency and your connection speed.
<br/>&nbsp;

## Contact
* Author: Subhendu Kumar Sahoo
* Email: smaro.nitr@gmail.com
* Website: https://smaro-nitr.github.io
* Always welcome for bugfix, feature suggestion and feedback
