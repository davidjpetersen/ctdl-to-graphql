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

    const schemaContents = await Promise.all(
      schemas.map(async schema => {
        const fullSchema = await http.getSchema(schema, config, files);
        return fullSchema['@graph'];
      })
    );
    console.log('Schema contents:', schemaContents);
    const schema = {
      classes: schemaContents.flatMap(schemaContent =>
        schemaContent.filter(item => item['@type'] === 'rdfs:Class')
      ),
      properties: schemaContents.flatMap(schemaContent =>
        schemaContent.filter(item => item['@type'] === 'rdf:Property')
      ),
    };
    await createFile(MERGED_FILE_PATH, JSON.stringify(schema, null, 2));

    return schema;
  } catch (error) {
    console.error('Error loading schema:', error.message);
    throw error;
  }
};

export default loadSchemas;
