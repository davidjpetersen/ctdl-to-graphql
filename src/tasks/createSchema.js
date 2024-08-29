import processItem from './process/processItem.js';
import retrieveSchemas from './process/retrieveSchemas.js';
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
const createSchema = async schemas => {
  try {
    // Check if the schemas object is valid and not empty
    if (typeof schemas !== 'object' || Object.keys(schemas).length === 0) {
      throw new Error('Invalid or empty schemas object');
    }

    // Read and parse schema data from each file
    const allSchemaItems = await retrieveSchemas(schemas);

    // console.log('all:', allSchemaItems);
    // Loop through all items of both schemas and process them
    allSchemaItems.forEach(item => processItem(item, allSchemaItems));
  } catch (error) {
    console.error('Error creating schema:', error);
    throw error;
  }
};

export default createSchema;
