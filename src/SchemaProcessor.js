import downloadSchema from './tasks/downloadSchemas.js';
import mergeSchemas from './tasks/mergeSchemas.js';

export default class SchemaProcessor {
  constructor(config, files) {
    this.config = config;
    this.files = files;

    this.schema = { classes: [], properties: [] };
  }

  async cleanDirs() {
    console.log('Cleaning directories...');

    if (!this.config?.getInputFilePath || !this.config?.getOutputFilePath) {
      throw new Error(
        'Invalid config: getInputFilePath or getOutputFilePath is not defined or not a function'
      );
    }

    const { getInputFilePath, getOutputFilePath } = this.config;
    const { cleanDir } = this.files;

    await Promise.all([
      cleanDir(getInputFilePath('')),
      cleanDir(getOutputFilePath('')),
    ]);
  }

  async loadSchema() {
    try {
      const { MERGED_FILE_PATH } = this.config.types;

      const { checkFileExists, readFile, createFile } = this.files;
      const { schemas } = this.config;

      if (await checkFileExists(MERGED_FILE_PATH)) {
        this.schema = JSON.parse(await readFile(MERGED_FILE_PATH));
        return;
      }

      console.log(
        'Merged file does not exist. Processing individual schemas...'
      );

      await Promise.all(
        schemas.map(async schema => {
          if (!(await checkFileExists(schema.path))) {
            console.log(`Downloading schema file: ${schema.name}`);
            await downloadSchema(schema);
          }
        })
      );

      const schemaContents = await Promise.all(
        schemas.map(async schema => JSON.parse(await readFile(schema.path)))
      );

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

  async mergeSchemas(schemas) {
    try {
      this.schema = await mergeSchemas(schemas);
    } catch (error) {
      console.error('Error merging schema:', error.message);
      throw error;
    }
  }
}
