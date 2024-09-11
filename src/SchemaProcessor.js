import classProcessor from './processors/classProcessor.js';
import cleanDirs from './tasks/cleanDirs.js';
import getGraphQLSchema from './processors/getGraphQLSchema.js';
import loadSchemas from './tasks/loadSchemas.js';
import validateSchema from './processors/validateSchema.js';

/**
 * @typedef {Object} Config
 * @property {Object} types - The type information, including MERGED_FILE_PATH.
 * @property {Function} getOutputFilePath - Function to get the output file path.
 */

/**
 * @typedef {Object} Files
 * @property {Function} createFile - Function to create a new file.
 */

/**
 * @typedef {Object} HttpClient
 * - Placeholder for potential HTTP operations.
 */

export default class SchemaProcessor {
  /**
   * @param {Config} config - Configuration for the schema processor.
   * @param {Files} files - File operations handler.
   * @param {HttpClient} http - HTTP client for potential future use.
   */
  constructor(config, files, http) {
    this.config = config;
    this.files = files;
    this.http = http;
    this.schema = { classes: [], properties: [] };
  }

  /**
   * Cleans directories based on the config and files.
   * @returns {Promise<void>}
   */
  async cleanDirs() {
    try {
      await cleanDirs(this.config, this.files);
    } catch (error) {
      console.error('Error cleaning directories:', error);
      throw error; // Re-throw to ensure proper error propagation
    }
  }

  /**
   * Loads schemas and updates the schema property.
   * @returns {Promise<void>}
   */
  async loadSchemas() {
    try {
      const newSchema = await loadSchemas(this.config, this.files, this.http);
      this.schema = { ...newSchema };
    } catch (error) {
      console.error('Error loading schemas:', error);
      throw error;
    }
  }

  /**
   * Processes schemas, validates them, and writes the result to a file.
   * @returns {Promise<void>}
   */
  async processSchemas() {
    const { config, files } = this;
    const {
      types: { MERGED_FILE_PATH },
      getOutputFilePath,
    } = config;

    try {
      console.log(this.schema);
      //   await validateSchema(MERGED_FILE_PATH, files, this.schema);
      //   const processedClasses = await classProcessor(this.schema, config, files);
      //   const schemaPath = getOutputFilePath('classes.graphql');
      //   await files.createFile(schemaPath, processedClasses);
    } catch (error) {
      console.error('Error processing schemas:', error);
      throw error;
    }
  }
}
