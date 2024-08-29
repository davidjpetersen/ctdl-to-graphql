import { files } from '../../utils/index.js';
async function retrieveSchemas(schemas) {
  const schemaPromises = Object.entries(schemas).map(async ([, schemaItem]) => {
    // Check if file exists
    if (!files.checkFileExists(schemaItem.path)) {
      throw new Error(`Schema file not found: ${schemaItem.path}`);
    }
    let schemaData = await files.readFile(schemaItem.path);

    // Parse the JSON string into a JavaScript object
    schemaData = JSON.parse(schemaData);
    return schemaData;
  });

  // Combine the parsed schema data from all files
  const allSchemaItems = (await Promise.all(schemaPromises)).flat();
  return allSchemaItems;
}
export default retrieveSchemas;
