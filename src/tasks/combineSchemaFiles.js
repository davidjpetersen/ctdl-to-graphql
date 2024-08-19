import fs from 'fs';

const combineSchemaFiles = (schemaFiles) => {
	return schemaFiles.reduce((acc, file) => {
		try {
			const fileContent = fs.readFileSync(file, 'utf8');
			return acc + fileContent + '\n';
		} catch (error) {
			console.error(`Error reading file ${file}: ${error.message}`);
			return acc;
		}
	}, '');
};

export default combineSchemaFiles;
