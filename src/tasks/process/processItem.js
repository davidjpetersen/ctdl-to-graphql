import processRDFProperty from './processRDFProperty.js';
// Export all process-related tasks
import processRDFSClass from './processRDFSClass.js';
import skosConcept from './skosConcept.js';
import skosConceptScheme from './skosConceptScheme.js';

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
    // console.log('Unknown type', item.type); // If no processor is found, log the unknown type to the console
  }
};

export default processItem;
