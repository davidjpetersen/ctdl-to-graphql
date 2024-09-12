import { config } from '../../utils/index.js';
const { getNameFromURI } = config;

const parseConcept = (parsedSchema, item) => {
  const {
    '@type': conceptType = '',
    '@id': conceptId = '',
    'skos:prefLabel': { 'en-US': conceptLabel } = { 'en-US': '' },
    'skos:definition': { 'en-US': conceptDefinition } = { 'en-US': '' },
    'dct:description': { 'en-US': conceptDescription } = { 'en-US': '' },
    'vs:term_status': conceptTermStatus = '',
    'meta:changeHistory': conceptChangeHistory = '',
    'skos:inScheme': conceptInScheme = [],
    'skos:topConceptOf': conceptTopConceptOf = [],
  } = item;

  const name = getNameFromURI(conceptId);
  const annotation = [
    conceptLabel,
    conceptTermStatus,
    conceptDefinition,
    conceptDescription,
    conceptChangeHistory ? `Change history: ${conceptChangeHistory}` : false,
  ]
    .filter(Boolean)
    .join(' - ');

  const concept = {
    type: conceptType,
    id: conceptId,
    name,
    annotation,
    inScheme: conceptInScheme,
    topConceptOf: conceptTopConceptOf,
  };

  parsedSchema.concepts.push(concept);
};

export default parseConcept;
