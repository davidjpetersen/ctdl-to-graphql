import {
  parseClass,
  parseConcept,
  parseConceptScheme,
  parseProperty,
} from './parsers/index.js';
// Take either asn or ctdl and categorize each object.

const parsedSchema = {
  classes: {
    parentClasses: [],
    childClasses: [],
  },
  properties: {
    objectProperties: [],
    unionProperties: [],
  },
  concepts: [],
  conceptSchemes: [],
};

const parseSchema = async schema => {
  for (const item of schema) {
    switch (item['@type']) {
      case 'rdf:Property':
        parseProperty(parsedSchema, item);
        break;
      case 'rdfs:Class':
        parseClass(parsedSchema, item);
        break;
      case 'skos:Concept':
        parseConcept(parsedSchema, item);
        break;
      case 'skos:ConceptScheme':
        parseConceptScheme(parsedSchema, item);
        break;
      default:
        console.log('Unidentified flying object.');
        break;
    }
  }

  return parsedSchema;
};

export default parseSchema;
