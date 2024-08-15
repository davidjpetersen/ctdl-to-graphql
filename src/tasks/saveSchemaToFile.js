import fs from 'fs';
const saveSchemaToFile = (schema, outputFilePath) => {
	fs.writeFileSync(outputFilePath, schema);
	console.log(`GraphQL schema generated and saved to ${outputFilePath}`);
};
export default saveSchemaToFile;
