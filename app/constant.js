const io = {
	baseFolderName: '',
	inputFolderName: '',
	inputFileName: 'package',
	outputFolderName: 'extracted_license',
	outputFileName: 'extracted_license'
};

const color = {
	reset: "\x1b[0m",
	black: "\x1b[30m",
	red: "\x1b[31m",
	green: "\x1b[32m",
	blue: "\x1b[34m",
	magenta: "\x1b[35m"
};

const fileExtension = {
	json: '.json',
	csv: '.csv'
};

const csvField = [
	{ label: 'Name', value: 'name' },
	{ label: 'Version', value: 'version' },
	{ label: 'License', value: 'license' },
	{ label: 'Link', value: 'link' },
	{ label: 'Package', value: 'packageName' }
];

const textMessage = {
	invalidInputFileName: 'No package.json file is availiable in sub folder (project folder) at ',
	fileReadException: 'File read exception: ',
	invalidPackageJson: 'Invalid package.json',
	npmException: 'NPM exception: ',
	invalidNpmDependency: 'Local dependency file',
	jsonSuccess: 'Successfully generated the JSON file',
	csvSuccess: 'Successfully generated the CSV file'
};

const https = 'https://';

module.exports = { io, color, fileExtension, csvField, textMessage, https };
