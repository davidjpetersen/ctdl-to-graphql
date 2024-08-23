import { GraphQLObjectType, GraphQLScalarType, printType } from 'graphql';
import { config, files } from '../utils/index.js';

const rdfsClass = async () => {
	const rdfsClassFolder = config.getInputFilePath('rdfs/Class');
	const jsonFiles = await files.getFolderFiles(rdfsClassFolder);

	for (const file of jsonFiles.filter((file) => file.endsWith('.json'))) {
		const contents = await files.readFile(file);
		const {
			'@id': id = '',
			'@type': typeName = '',
			'rdfs:label': { 'en-US': label = '' } = {},
			'rdfs:comment': { 'en-US': comment = '' } = {},
			'rdfs:subClassOf': baseType = [],
			'meta:domainFor': classFields = [],
		} = JSON.parse(contents);

		const typeNameToWrite = id?.replace(':', '_') ?? '';
		const commentToWrite = comment?.replace(':', '_') ?? '';
		// const extendsToWrite = baseType.length
		// 	? baseType.map((type) => type.replace(':', '_')).join(' & ')
		// 	: '';

		// const isTypeOfFunction = baseType.length
		// 	? (obj) => obj['@type'] && obj['@type'].includes(baseType[0])
		// 	: undefined;

		const fields = {};
		classFields.forEach((field) => {
			const fieldName = field.split(':').pop();
			fields[fieldName] = {
				type: new GraphQLScalarType({
					name: fieldName,
					description: field['rdfs:comment']?.['en-US'] || '',
				}),
			};
		});
		const MyType = new GraphQLObjectType({
			name: typeNameToWrite,
			description: commentToWrite,
			// isTypeOf: isTypeOfFunction,
			fields,
		});

		const schemaString = printType(MyType);
		const filePath = file.replace('.json', '.graphql');
		files.createFile(filePath, schemaString);
	}
};

export default rdfsClass;
