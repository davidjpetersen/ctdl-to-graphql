import parseClass from './parseClass.js';
import parseProperty from './parseProperty.js';

// Take either asn or ctdl and categorize each object.
const parseSchema = async schema => {
  const parsedSchema = {
    classes: [],
    properties: {
      objectProperties: [],
      unionProperties: [],
    },
  };

  for (const item of schema) {
    switch (item['@type']) {
      case 'rdf:Property':
        parseProperty(parsedSchema, item);
        break;
      case 'rdfs:Class':
        parseClass(parsedSchema, item);
        break;
      case 'skos:Concept':
        console.log('Concept:', item['@id'], 'is a concept');
        break;
      case 'skos:ConceptScheme':
        console.log('ConceptScheme:', item['@id'], 'is a concept scheme');
        break;
      default:
        console.log('Unknown type:', item['@type']);
        break;
    }
  }

  return parsedSchema;
};
const parseCtdl = async ctdlData => {
  const parsedSchema = {};
  for (const schemaItem of ctdlData) {
    const { name, schema } = schemaItem;
    console.log('Parsing schema:', name);
    // Parse each schema

    parsedSchema[name] = await parseSchema(schema);
  }

  return parsedSchema;
};

export default parseCtdl;
