import { config, files } from '../utils/index.js';
const { getFolderFiles, readFile, createFile } = files;
const { getInputFilePath } = config;

const createGraphQLSchema = (input) => {
	// Extract necessary fields from the input object
	const {
		'@id': id,
		'rdfs:comment': { 'en-US': comment },
		'rdfs:comment': { 'en-US': description },
		'meta:changeHistory': changeHistory,
		'meta:domainFor': fields,
	} = JSON.parse(input);

	// Start building the GraphQL schema as a string
	let schema = `"""
  ${comment?.['en-US']}
  ${description?.['en-US']}
  Change history: ${changeHistory}
  """
  type ${id} {\n`;

	// Add each field to the schema
	fields?.forEach((field) => {
		schema += `  ${field.replace('ceasn_', '')}: String\n`;
	});

	// Close the type definition
	schema += `}`;

	return schema;
};
const convertClasses = async () => {
	// Read the rdfs_Class folder and convert each file to a GraphQL type
	const rdfs_ClassFolder = getInputFilePath('rdfs_Class');
	let files = await getFolderFiles(rdfs_ClassFolder);

	// Filter only the .json files
	files = files.filter((file) => file.endsWith('.json'));

	for (const file of files) {
		// Read the file
		const filePath = `${rdfs_ClassFolder}/${file}`;
		const contents = await readFile(filePath);

		// Convert the file to a GraphQL type
		const graphql = createGraphQLSchema(contents);

		// Write the GraphQL type to a file
		const graphqlFilePath = `${filePath.replace('.json', '')}.graphql`;
		await createFile(graphqlFilePath, graphql);
	}
};

export default convertClasses;
