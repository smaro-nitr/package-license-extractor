const ARGS = {
  projectScanType: ['single', 'multi']
};

const COLOR = {
  black: '\x1b[90m',
  blue: '\x1b[94m',
  cyan: '\x1b[96m',
  dim: '\x1b[2m',
  green: '\x1b[92m',
  magenta: '\x1b[95m',
  red: '\x1b[91m',
  reset: '\x1b[0m',
  yellow: '\x1b[93m'
};

const CSV_FIELD = [
  { label: 'Name', value: 'name' },
  { label: 'Version', value: 'version' },
  { label: 'License', value: 'license' },
  { label: 'Url Type', value: 'linkType' },
  { label: 'Url', value: 'linkUrl' },
  { label: 'Package Name', value: 'packageName' }
];

const FILE_EXTENSION = {
  json: '.json',
  csv: '.csv'
};

const IO = {
  baseFolderName: '',
  inputFolderName: '',
  inputFileName: 'package',
  outputFolderName: 'extracted_license',
  outputFileName: 'extracted_license'
};

const MESSAGE = {
  csvSuccess: 'Successfully generated the CSV file',
  fileReadException: 'File read exception: ',
  invalidInputFileName: 'No package.json file is available to scan',
  invalidNpmDependency: 'Local dependency file',
  invalidPackageJson: 'Invalid package.json',
  jsonSuccess: 'Successfully generated the JSON file',
  na: 'NA',
  npmException: 'NPM exception: ',
  processingPackage: '>>> Processing',
  similarPackage: 'Similar package(s):',
  totalPackage: 'Total package(s):',
  totalTimeElapsed: 'Total time elapsed:',
  uniquePackage: 'Unique package(s):',
  unknown: 'Unknown',
  validatingUrl: 'validating... ', 
};

const URL = {
  https: 'https://',
  npmRegistry: 'www.npmjs.com/package/',
  uppercaseLicensePath: '/blob/master/LICENSE',
  capitalizeLicensePath: '/blob/master/License',
  lowercaseLicensePath: '/blob/master/license',
  licensePathWithMdExtension: '/blob/master/LICENSE.md',
  licensePathWithTxtExtension: '/blob/master/LICENSE.txt',
  licenseType: {
    license: 'exact-version-license',
    repository: 'exact-version-repository',
    registry: 'exact-version-registry',
    latestLicense : 'latest-version-license',
    latestRepository : 'latest-version-repository'
  }
};

module.exports = { ARGS, COLOR, CSV_FIELD, FILE_EXTENSION, IO, MESSAGE, URL };
