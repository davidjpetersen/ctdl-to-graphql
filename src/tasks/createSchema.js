import { config, files, schema } from '../utils/index.js';
import {
  rdfProperty,
  rdfsClass,
  skosConcept,
  skosConceptScheme,
} from './process/index.js';

const {
  destructureClass,
  getPropertyFromSchema,
  getPropertyType,
  getPropertyDescription,
} = schema;

const { extensions, raw } = config;
const { RDFS_CLASS_FOLDER } = raw;
const { GRAPHQL_EXTENSION } = extensions;

const createSchema = async () => {
  const ctdl = JSON.parse(await files.readFile(raw.ctdl));
  const asn = JSON.parse(await files.readFile(raw.asn));

  // Join the two schemas into one
  const combined = [...ctdl, ...asn];
  for (const item of combined) {
    const itemType = item['@type'];

    switch (itemType) {
      case 'rdfs_Class':
        const destructuredClass = destructureClass(item);
        rdfsClass(destructuredClass, combined, {
          getPropertyFromSchema,
          getPropertyType,
          getPropertyDescription,
          RDFS_CLASS_FOLDER,
          GRAPHQL_EXTENSION,
        });

        break;
      case 'rdf_Property':
        rdfProperty(item, combined);
        break;
      case 'skos_ConceptScheme':
        skosConceptScheme(item, combined);
        break;
      case 'skos_Concept':
        skosConcept(item, combined);
        break;
      default:
        console.log('Unknown type', itemType, combined);
        break;
    }
  }
};

export default createSchema;
