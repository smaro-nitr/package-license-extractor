const IO = {
	baseFolderName: '',
	inputFolderName: '',
	inputFileName: 'package',
	outputFolderName: 'extracted_license',
	outputFileName: 'extracted_license'
};

const COLOR = {
	reset: "\x1b[0m",
	black: "\x1b[30m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m"
};

const FILE_EXTENSION = {
	json: '.json',
	csv: '.csv'
};

const CSV_FIELD = [
	{ label: 'Name', value: 'name' },
	{ label: 'Version', value: 'version' },
	{ label: 'License', value: 'license' },
	{ label: 'Link', value: 'link' },
	{ label: 'Package', value: 'packageName' }
];

const MESSAGE = {
	invalidInputFileName: 'No package.json file is availiable in sub folder (project folder) at ',
	fileReadException: 'File read exception: ',
	invalidPackageJson: 'Invalid package.json',
	npmException: 'NPM exception: ',
	invalidNpmDependency: 'Local dependency file',
	jsonSuccess: 'Successfully generated the JSON file',
	csvSuccess: 'Successfully generated the CSV file'
};

const URL = {
	https: 'https://',
	licensePath: '/blob/master/LICENSE'
};

module.exports = { IO, COLOR, FILE_EXTENSION, CSV_FIELD, MESSAGE, URL };
