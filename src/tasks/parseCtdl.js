import config from '../utils/config.js';
const { getNameFromURI } = config;

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
        const {
          '@type': propType = '',
          '@id': propId = '',
          'rdfs:label': { 'en-US': propLabel } = { 'en-US': '' },
          'rdfs:comment': { 'en-US': propComment } = { 'en-US': '' },
          'vann:usageNote': { 'en-US': propUsageNote } = { 'en-US': '' },
          'vs:term_status': propTermStatus = '',
          'meta:changeHistory': propChangeHistory = '',
          'rdfs:subPropertyOf': propSubPropertyOf = [],
          'schema:domainIncludes': propOptions = [],
          'schema:rangeIncludes': propUsedBy = [],
          'meta:targetScheme': propTargetScheme = [],
        } = item;

        const name = getNameFromURI(propId);
        const annotation = [
          propLabel,
          propComment,
          propUsageNote ? `Usage Node: ${propUsageNote}` : false,
          propChangeHistory ? `Change history: ${propChangeHistory}` : false,
        ]
          .filter(Boolean)
          .join(' - ');

        const processedProp = {
          type: propType,
          id: propId,
          name,
          annotation,
          extends: propSubPropertyOf,
          options: propOptions,
          usedBy: propUsedBy,
          targetScheme: propTargetScheme,
        };

        if (propOptions.length === 0) {
          parsedSchema.properties.objectProperties.push(processedProp);
        }
        if (propOptions.length > 0) {
          parsedSchema.properties.unionProperties.push(processedProp);
        }

        break;
      case 'rdfs:Class':
        const {
          '@type': classType = '',
          '@id': classId = '',
          'rdfs:label': { 'en-US': classLabel } = { 'en-US': '' },
          'rdfs:comment': { 'en-US': classComment } = { 'en-US': '' },
          'dct:description': { 'en-US': classDescription } = { 'en-US': '' },
          'vs:term_status': classTermStatus = '',
          'meta:changeHistory': classChangeHistory = '',
          'rdfs:subClassOf': classSubClassOf = [],
          'meta:domainFor': classDomainFor = [],
        } = item;

        const processedItem = {
          classType,
          classId,
          classLabel,
          classComment,
          classDescription,
          classTermStatus,
          classChangeHistory,
          classSubClassOf,
          classDomainFor,
        };

        parsedSchema.classes.push(processedItem);
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
