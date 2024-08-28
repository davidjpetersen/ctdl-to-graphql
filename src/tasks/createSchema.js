import { GraphQLObjectType, printType } from 'graphql';
import { config, files } from '../utils/index.js';

import rdf_Property from './process/rdfProperty.js';
import rdfsClass from './process/rdfsClass.js';
import skos_Concept from './process/skosConcept.js';
import skos_ConceptScheme from './process/skosConceptScheme.js';

const { extensions, raw } = config;
const { RDFS_CLASS_FOLDER } = raw;
const { GRAPHQL_EXTENSION } = extensions;

const getProperty = (propertyName, schema) =>
  schema.find(item => item['@id'] === propertyName);

const getPropertyType = (propertyName, acceptedValues) => {
  if (acceptedValues.length > 1) {
    return new GraphQLUnionType({
      name: `${propertyName}Union`,
      types: acceptedValues.map(
        typeName => new GraphQLObjectType({ name: typeName, fields: {} })
      ),
      resolveType: () => null,
    });
  }
  if (acceptedValues.length === 1) {
    return mappings[acceptedValues[0]];
  }
  return GraphQLString;
};

const destructureClass = item => {
  const classId = item['@id'];
  const className = item['@id'].split('_')[1];
  const classDescription = item['dct_description']?.['en-US'] ?? '';
  const classFields = item['meta_domainFor'] ?? [];
  const subClassOf = item['rdfs_subClassOf'] ?? [];

  return { classId, className, classDescription, classFields, subClassOf };
};

const destructureProperty = property => {
  const { '@id': propertyName, schema_rangeIncludes: acceptedValues } =
    property;
  return { propertyName, acceptedValues };
};
const getPropertyDescription = property =>
  [
    property['@id']?.split('_')[1],
    property['@id'],
    property['dct_description']?.['en-US'],
    property['rdfs_comment']?.['en-US'],
  ]
    .filter(Boolean)
    .join(' - ');

const createSchema = async () => {
  const ctdl = JSON.parse(await files.readFile(raw.ctdl));
  const asn = JSON.parse(await files.readFile(raw.asn));

  // Join the two schemas into one
  const combined = [...ctdl, ...asn];
  for (const item of combined) {
    const itemType = item['@type'];

    switch (itemType) {
      case 'rdfs_Class':
        rdfsClass(item, combined, {
          destructureClass,
          getProperty,
          getPropertyType,
          getPropertyDescription,
          RDFS_CLASS_FOLDER,
          GRAPHQL_EXTENSION,
        });

        break;
      case 'rdf_Property':
        rdf_Property(item, combined);
        break;
      case 'skos_ConceptScheme':
        skos_ConceptScheme(item, combined);
        break;
      case 'skos_Concept':
        skos_Concept(item, combined);
        break;
      default:
        console.log('Unknown type', itemType, combined);
        break;
    }
  }
};

export default createSchema;
