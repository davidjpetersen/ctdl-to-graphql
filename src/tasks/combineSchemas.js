import fs from 'fs';

const combineSchemaFiles = async (schemaFiles) => {
	const schemaContent = schemaFiles.reduce((acc, file) => {
		try {
			const fileContent = fs.readFileSync(file, 'utf8');
			return acc + fileContent + '\n';
		} catch (error) {
			console.error(`Error reading file ${file}: ${error.message}`);
			return acc;
		}
	}, '');

	await createFile(`${output.folderPath}/schema.graphql`, schemaContent);
};

export default combineSchemaFiles;
