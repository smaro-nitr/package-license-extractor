const io = {
	inputFileName: ['insights', 'WebModules'], //need to be an input array
	outputFileName: 'final'
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
	{ label: 'Package', value: 'package' }
];

const successText = {
	json: 'Successfully generated the Json file',
	csv: 'Successfully generated the Csv file'
};

module.exports = { io, color, fileExtension, csvField, successText };


