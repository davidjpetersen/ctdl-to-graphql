import { files, schema } from '../utils/index.js';
import {
  processRDFProperty,
  processRDFSClass,
  skosConcept,
  skosConceptScheme,
} from './process/index.js';

const {
  destructureClass,
  getPropertyFromSchema,
  getPropertyType,
  getPropertyDescription,
} = schema;

/**
 * Processes an item from the combined CTDL and ASN schemas.
 *
 * This function dispatches the processing of the item to the appropriate
 * processor based on the item's `@type` property. The processors are defined
 * in the `processors` object, and each processor is responsible for handling
 * a specific type of item.
 *
 * If the item's `@type` is not recognized, the function logs the unknown type
 * to the console.
 *
 * @param {Object} item - The item to be processed.
 * @param {Object[]} schema - The combined CTDL and ASN schemas.
 */
const processItem = (item, schema) => {
  // console.log(`Processing ${item} of type ${item.type}`); // Log the type being processed
  // Define the processors for different types of items
  const processors = {
    'rdfs:Class': () => processRDFSClass(item, schema),
    'rdf:Property': () => processRDFProperty(item, schema),
    'skos:ConceptScheme': () => skosConceptScheme(item, schema),
    'skos:Concept': () => skosConcept(item, schema),
  };

  // Dispatch the processing of the item to the appropriate processor
  const processor = processors[item.type];

  if (processor) {
    // console.log(`Processing ${item.id} of type ${item.type}`); // Log the type being processed
    processor(); // If a processor is found, execute it
  } else {
    console.log('Unknown type', item.type); // If no processor is found, log the unknown type to the console
  }
};

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
    const schemaPromises = Object.entries(schemas).map(
      async ([, schemaItem]) => {
        // Check if file exists
        if (!files.checkFileExists(schemaItem.path)) {
          throw new Error(`Schema file not found: ${schemaItem.path}`);
        }
        let schemaData = await files.readFile(schemaItem.path);

        // Parse the JSON string into a JavaScript object
        schemaData = JSON.parse(schemaData);
        // schemaData = schemaData['graph'];
        return schemaData;
      }
    );

    // Combine the parsed schema data from all files
    const allSchemaItems = (await Promise.all(schemaPromises)).flat();

    // console.log('all:', allSchemaItems);
    // Loop through all items of both schemas and process them
    allSchemaItems.forEach(item => processItem(item, allSchemaItems));
  } catch (error) {
    console.error('Error creating schema:', error);
    throw error;
  }
};

export default createSchema;
