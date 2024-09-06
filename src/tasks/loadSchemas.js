/**
 * Loads the schema by first checking if a merged schema file exists, and if not, processing the individual schemas and merging them.
 *
 * @returns {Promise<void>} - A promise that resolves when the schema has been loaded.
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
      classes: schemaContents.flatMap(schema => schema.classes ?? []),
      properties: schemaContents.flatMap(schema => schema.properties ?? []),
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
