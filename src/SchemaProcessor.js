import downloadSchema from './tasks/downloadSchemas.js';
import mergeSchemas from './tasks/mergeSchemas.js';

export default class SchemaProcessor {
  constructor(config, files) {
    this.config = config;
    this.files = files;

    this.schema = { classes: [], properties: [] };
  }

  /**
   * Cleans the input and output directories specified in the configuration object.
   * This method is responsible for removing any existing files or directories in the input and output paths.
   * It is skipped if the `freshStart` config option is falsy, which can be used to avoid unnecessary directory cleaning.
   */
  async cleanDirs() {
    /**
     * Skips cleaning the input and output directories if the `freshStart` config option is falsy.
     * This can be used to avoid unnecessary directory cleaning when the application is not starting from scratch.
     */
    const { freshStart, getInputFilePath, getOutputFilePath } = this.config;
    const { cleanDir } = this.files;

    if (!freshStart) {
      console.log('Skipping clean directories...');
      return;
    }
    console.log('Cleaning directories...');

    /**
     * Checks that the `getInputFilePath` and `getOutputFilePath` functions are defined in the configuration object.
     * If either function is not defined or not a function, an error is thrown.
     */
    if (!getInputFilePath || !getOutputFilePath) {
      throw new Error(
        'Invalid config: getInputFilePath or getOutputFilePath is not defined or not a function'
      );
    }

    /**
     * Cleans the input and output directories specified in the configuration object.
     * This method is responsible for removing any existing files or directories in the input and output paths.
     * It is skipped if the `freshStart` config option is falsy, which can be used to avoid unnecessary directory cleaning.
     */
    await Promise.all([
      cleanDir(getInputFilePath('')),
      cleanDir(getOutputFilePath('')),
    ]);
    console.log('Directories cleaned.');
  }

  async loadSchema() {
    try {
      const { schemas } = this.config;
      const { MERGED_FILE_PATH } = this.config.types;
      const { checkFileExists, readFile, createFile } = this.files;

      if (await checkFileExists(MERGED_FILE_PATH)) {
        this.schema = JSON.parse(await readFile(MERGED_FILE_PATH));
        return;
      }

      console.log(
        'Merged file does not exist. Processing individual schemas...'
      );

      /**
       * Loads the schema contents by downloading and parsing the individual schema files.
       * This method is responsible for fetching the schema files, either from the file system
       * or by downloading them if they don't exist locally.
       *
       * @returns {Promise<{ classes: any[], properties: any[] }>} The merged schema contents.
       */
      const schemaContents = await Promise.all(
        schemas.map(async schema => {
          const { name } = schema;
          const { getInputFilePath } = this.config;
          const { GRAPHQL_EXTENSION } = this.config.extensions;
          const schemaPath = getInputFilePath(`${name}${GRAPHQL_EXTENSION}`);

          if (!(await checkFileExists(schemaPath))) {
            console.log(`Downloading schema file: ${schema.name}`);
            await downloadSchema(schema);
          }

          return JSON.parse(await readFile(schemaPath));
        })
      );

      /**
       * Merges the individual schema contents into a single schema object.
       * The merged schema contains the combined classes and properties from all the individual schemas.
       */
      this.schema = {
        classes: schemaContents.flatMap(schema => schema.classes || []),
        properties: schemaContents.flatMap(schema => schema.properties || []),
      };

      await createFile(MERGED_FILE_PATH, JSON.stringify(this.schema, null, 2));
      console.log('Schema merged successfully.');
    } catch (error) {
      console.error('Error loading schema:', error.message);
      throw error;
    }
  }

  async processSchemas() {
    console.log('Process the schemas.');
    return;
  }

  async mergeSchemas(schemas) {
    try {
      this.schema = await mergeSchemas(schemas);
    } catch (error) {
      console.error('Error merging schema:', error.message);
      throw error;
    }
  }
}
