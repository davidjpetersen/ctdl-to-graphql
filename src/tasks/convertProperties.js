import { config, files } from '../utils/index.js';
const { getFolderFiles, readFile, createFile } = files;
const { getInputFilePath } = config;

const createGraphQLSchema = (obj) => {
	const {
		'@id': schemaId,
		'rdfs:label': { 'en-US': labelText } = { 'en-US': '' },
		'rdfs:comment': { 'en-US': commentText } = { 'en-US': '' },
		'meta:changeHistory': changeHistory = '',
		'schema:rangeIncludes': fields = [],
		'rdfs:subPropertyOf': [parents] = [],
	} = obj;

	// Generate the GraphQL type
	let schema = `# ${labelText}\n# ${commentText}{`;

	// Iterate over rangeIncludes to add fields

	fields?.forEach((range) => {
		schema += `# ${labelText}\n    ${schemaId}: ${range}\n`;
	});

	schema += `}`;

	return schema;
};
const convertProperties = async () => {
	// Read the rdf_Property folder and convert each file to a GraphQL type
	const rdf_PropertyFolder = getInputFilePath('rdf_Property');
	let files = await getFolderFiles(rdf_PropertyFolder);

	// Filter only the .json files
	files = files.filter((file) => file.endsWith('.json'));

	for (const file of files) {
		// Read the file
		const filePath = `${rdf_PropertyFolder}/${file}`;
		const contents = await readFile(filePath);
		const json = JSON.parse(contents);

		// Convert the file to a GraphQL type
		const graphql = createGraphQLSchema(json);

		// Write the GraphQL type to a file
		const graphqlFilePath = `${filePath.replace('.json', '')}.graphql`;
		await createFile(graphqlFilePath, graphql);
	}
};

export default convertProperties;
