import cleanDirs from './tasks/cleanDirs.js';
import loadSchemas from './tasks/loadSchemas.js';
import createProperty from './tasks/createProperties.js';
export default class SchemaProcessor {
  constructor(config, files, http) {
    this.config = config;
    this.files = files;
    this.http = http;
    this.schema = { classes: [], properties: [] };
  }

  async cleanDirs() {
    return await cleanDirs(this.config, this.files);
  }

  async loadSchemas() {
    this.schema = await loadSchemas(this.config, this.files, this.http);
    return true;
  }

  async processSchemas() {
    // Check if the merged file exists
    const {
      types: { MERGED_FILE_PATH, OUTPUT_FILE_PATH },
    } = this.config;

    const mergedFileExists = await this.files.checkFileExists(MERGED_FILE_PATH);

    if (!mergedFileExists) {
      throw new Error('Merged file does not exist. Please rerun.');
    }

    if (
      this.schema.classes?.length === 0 ||
      this.schema.properties?.length === 0
    ) {
      throw new Error('Schema is empty.');
    }

    console.log('Processing schemas...', this.schema.classes.length);

    const processedSchema = await Promise.all(
      this.schema.classes.map(async classItem => {
        const { uri, label, description, comment, optional, required } =
          classItem;

        let fieldsObject = await Promise.all(
          [...optional, ...required].map(async field => {
            const termName = field.split(':')[1];
            const propertyConfig = this.schema.properties.find(
              prop => prop.uri === field
            );

            const property = await createProperty(
              propertyConfig,
              this.config,
              this.files
            );
            return [termName, property];
          })
        );

        fieldsObject = Object.fromEntries(fieldsObject);

        return {
          name: uri.split(':')[1],
          label: label?.['en-US'] || null,
          description: description?.['en-US'] || null,
          comment: comment?.['en-US'] || null,
          fields: fieldsObject,
        };
      })
    );

    await this.files.createFile(
      OUTPUT_FILE_PATH,
      JSON.stringify(processedSchema, null, 2)
    );
  }
}
