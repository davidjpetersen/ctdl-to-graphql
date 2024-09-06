import mergeSchemas from './tasks/mergeSchemas.js';

export default class SchemaProcessor {
  constructor(config, files, http) {
    this.config = config;
    this.files = files;
    this.http = http;
    this.schema = { classes: [], properties: [] };
  }

  async cleanDirs() {
    const { freshStart, getInputFilePath, getOutputFilePath } = this.config;
    const { cleanDir } = this.files;

    if (!freshStart) {
      console.log('Skipping clean directories...');
      return;
    }

    console.log('Cleaning directories...');

    if (
      typeof getInputFilePath !== 'function' ||
      typeof getOutputFilePath !== 'function'
    ) {
      throw new Error(
        'Invalid config: getInputFilePath or getOutputFilePath is not a function'
      );
    }

    await Promise.all([
      cleanDir(getInputFilePath('')),
      cleanDir(getOutputFilePath('')),
    ]);

    console.log('Directories cleaned.');
  }

  /**
   * Loads the schema by first checking if a merged schema file exists, and if not, processing the individual schemas and merging them.
   *
   * @returns {Promise<void>} - A promise that resolves when the schema has been loaded.
   */
  async loadSchemas() {
    const { schemas, types } = this.config;
    const { MERGED_FILE_PATH } = types;
    const { checkFileExists, readFile, createFile } = this.files;

    try {
      if (await checkFileExists(MERGED_FILE_PATH)) {
        this.schema = JSON.parse(await readFile(MERGED_FILE_PATH));
        return;
      }

      console.log(
        'Merged file does not exist. Processing individual schemas...'
      );

      const schemaContents = await Promise.all(
        schemas.map(this.getSchema.bind(this))
      );

      this.schema = {
        classes: schemaContents.flatMap(schema => schema.classes ?? []),
        properties: schemaContents.flatMap(schema => schema.properties ?? []),
      };

      await createFile(MERGED_FILE_PATH, JSON.stringify(this.schema, null, 2));
      console.log('Schema merged successfully.');
    } catch (error) {
      console.error('Error loading schema:', error.message);
      throw error;
    }
  }

  /**
   * Processes a single schema by downloading the schema file from the provided URL and returning the parsed schema content.
   *
   * @param {Object} schema - The schema object containing the name and URL of the schema to process.
   * @param {string} schema.name - The name of the schema.
   * @param {string} schema.url - The URL of the schema file.
   * @returns {Promise<Object>} - The parsed schema content.
   */
  async getSchema(schema) {
    const { name, url } = schema;
    const { getInputFilePath, extensions } = this.config;
    const { checkFileExists, readFile, createFile } = this.files;

    const schemaPath = getInputFilePath(`${name}${extensions.JSON_EXTENSION}`);

    if (!(await checkFileExists(schemaPath))) {
      console.log(`Downloading schema file: ${name}`);
      const content = await this.http.getURL(url);
      await createFile(schemaPath, JSON.stringify(content, null, 2));
    }

    return JSON.parse(await readFile(schemaPath));
  }

  async processSchemas() {
    console.log('Processing schemas...');
  }
}
