import { files } from '../utils/index.js';
import processClass from './process/processClass.js';
const { readFile } = files;
/**
 * Asynchronously creates a schema by reading and parsing schema data from multiple files.
 *
 * This function takes an object of schema names and their corresponding file paths, reads the schema data from each file, and then processes each item in the combined schema data using the `processItem` function.
 *
 * If the `schemas` object is invalid or empty, the function will throw an error. If any errors occur during the schema creation process, the function will log the error and re-throw it.
 *
 * @param {Object} schemas - An object of schema names and their corresponding file paths.
 * @returns {Promise<void>} - A Promise that resolves when the schema creation process is complete.
 */
const createSchema = async filePath => {
  try {
    const schema = JSON.parse(await readFile(filePath));
    const { classes, properties } = schema;

    classes.forEach(item => processClass(item, schema));
  } catch (error) {
    console.error('Error creating schema:', error.message);
    throw error;
  }
};

export default createSchema;
