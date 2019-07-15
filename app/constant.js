const ARGS = {
  projectScanType: ['single', 'multi']
};

const COLOR = {
  black: '\x1b[30m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  yellow: '\x1b[33m'
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
  npmException: 'NPM exception: ',
  processingPackage: '>>> Processing',
  similarPackage: 'Similar package(s):',
  totalPackage: 'Total package(s):',
  uniquePackage: 'Unique package(s):',
  validatingUrl: 'validating ... ', 
};

const URL = {
  https: 'https://',
  licensePath: '/blob/master/LICENSE',
  licenseType: {
    license: 'license',
    repository: 'repository'
  }
};

module.exports = { ARGS, COLOR, CSV_FIELD, FILE_EXTENSION, IO, MESSAGE, URL };
