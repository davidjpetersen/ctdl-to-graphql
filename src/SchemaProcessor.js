import cleanDirs from './tasks/cleanDirs.js';
import getGraphQLSchema from './tasks/process/getGraphQLSchema.js';
import loadSchemas from './tasks/loadSchemas.js';
import processClasses from './tasks/process/processClasses.js';
import validateSchema from './tasks/process/validateSchema.js';

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
    const { config, files, schema } = this;
    const { types, getOutputFilePath } = config;
    const { MERGED_FILE_PATH } = types;

    // Validate the schema
    await validateSchema(MERGED_FILE_PATH, files, schema);

    // Process the schema
    const processedClasses = await processClasses(schema, config, files);

    // Extract graphql classes from the schema
    // const graphQLClasses = getGraphQLSchema(processedSchema, config, files);
    // Write the graphql schema to a file
    const schemaPath = getOutputFilePath('classes.graphql');

    await files.createFile(schemaPath, processedClasses);
  }
}
