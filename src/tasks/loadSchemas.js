/**
 * Loads the schema by first checking if a merged schema file exists, and if not, processing the individual schemas and merging them.
 *
 * @param {Object} config - Configuration object
 * @param {Object} files - File operations object
 * @param {Object} http - HTTP operations object
 * @returns {Promise<Object>} - A promise that resolves to the loaded schema
 */
const loadSchemas = async (config, files, http) => {
  const {
    schemas,
    types: { MERGED_FILE_PATH },
  } = config;
  const { checkFileExists, readFile, createFile } = files;

  try {
    if (await checkFileExists(MERGED_FILE_PATH)) {
      return JSON.parse(await readFile(MERGED_FILE_PATH));
    }

    console.log('Merged file does not exist. Processing individual schemas...');

    const schemaContents = await Promise.all(
      schemas.map(schema => http.getSchema(schema, config, files))
    );

    const schema = {
      classes: schemaContents.flatMap(schema => schema.classes || []),
      properties: schemaContents.flatMap(schema => schema.properties || []),
    };

    await createFile(MERGED_FILE_PATH, JSON.stringify(schema, null, 2));

    console.log('Schema merged successfully.');
    return schema;
  } catch (error) {
    console.error('Error loading schema:', error.message);
    throw error;
  }
};

export default loadSchemas;
