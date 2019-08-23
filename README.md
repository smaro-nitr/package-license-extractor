# package-license-extractor

## About
To find the license of all npm dependency used in your project.
<br/>Henceforth avoiding all legal challenges ahead, that may arise out of license conflict.

Feature:
* It doesn`t require node_modules to extract package's license details.
* All dependency with similar name and version are merged together (duplication avoided).
* Doesn`t need to be installed along with your project dependency.
* Fetch actual license URL from a repository (if available), else provide repository URL.

Learn more on license: https://opensource.org/licenses
<br/>&nbsp;

## Installation
Global installation
```shell
npm install package-license-extractor -g
```
Note: Doesn`t require to be installed as a dependency in your project
<br/>&nbsp;

## Flags Available
<table>
  <tr>
    <td>Flag</td>
    <td>Possible Value</td>
    <td>Default Value</td>
  <tr>
  <tr>
    <td><b>--projectScanType</b></td>
    <td>multi, single</td>
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

* If you want to scan for <b>multiple projects</b>, then open the parent folder containing all projects and run the below command -
```shell
extract-license --projectScanType=multi
```

Example (multiple projects):
* Folder Structure: C > All_Projects > Project_One, Project_Two, So on ..
* Run the command in All_Projects folder to get the license detail of Project_One, Project_Two, So on ..
<br/>&nbsp;

## Output
* Find the output in a newly created folder "extracted_license".
* Output will be in CSV as well as JSON format.
* Output will have following field: name, version, licencse, url type, url, package name (sorted by name).
* In console, you will get processed package`s summary detail.
* Output's url type keyword meaning to its corresponding url are as follows -
> <b>exact-version-license</b>: url will take you to the exact version's license file <br/>
> <b>latest-version-license</b>: url will take you to the latest version's license file <br/>
> <b>exact-version-repository</b>: url will take you to the exact version's git repository <br/>
> <b>latest-version-repository</b>: url will take you to the latest version's git repository <br/>
> <b>exact-version-registry</b>: url will take you to the exact version's npm registry <br/>

Note: Even though there is some programmatic limitation in finding URL, We try our best to make you arrive as closest as possible to the license URL. URL will be decided based on the validation order mentioned above. Once a particular URL is found and validated programmatically, further search for URL will stop. So higher the order, closest is the link.
<br/>&nbsp;

## Note
Internet connection is required to make use of this package.<br/>
Total time required to depend on no of dependency info is being fetched and also on your internet connection speed.
<br/>&nbsp;

## Contact
* Author: Subhendu Kumar Sahoo
* Email: smaro.nitr@gmail.com
* Website: https://smaro-nitr.github.io
* Always welcome for a bugfix, feature suggestion, and feedback