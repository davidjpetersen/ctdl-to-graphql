import { GraphQLObjectType, GraphQLScalarType, printType } from 'graphql';
import { config, files } from '../utils/index.js';

const rdfsClass = async () => {
	// Get all the files in the rdfs/Class folder
	const rdfsClassFolder = config.getInputFilePath('rdfs/Class');

	// Get all the json files
	let jsonFiles = await files.getFolderFiles(rdfsClassFolder);
	jsonFiles = jsonFiles.filter((file) => file.endsWith('.json'));

	// Loop through each file and create a new GraphQLObjectType for each
	for (const file of jsonFiles) {
		// Get the contents of the file
		const contents = await files.readFile(file);

		// Parse the JSON
		const {
			'@id': id = '',
			'rdfs:comment': { 'en-US': comment = '' } = {},
			'meta:domainFor': classFields = [],
		} = JSON.parse(contents);

		// Get the type name and comment
		const typeNameToWrite = id.replace(':', '_');
		const commentToWrite = comment.replace(':', '_');

		const fields = classFields.reduce((acc, field) => {
			const fieldName = field.replace(':', '_');
			acc[fieldName.replace('ceterms_', '')] = {
				type: new GraphQLScalarType({
					name: fieldName,
					description: JSON.stringify(field),
				}),
			};
			return acc;
		}, {});

		const description = `${typeNameToWrite}\n${commentToWrite}`;

		const newType = new GraphQLObjectType({
			name: typeNameToWrite,
			description,
			fields,
		});

		const filePath = file.replace('.json', '.graphql');
		const schemaString = printType(newType);

		// Write the file
		await files.createFile(filePath, schemaString);
	}
};

export default rdfsClass;
