import { config } from '../../utils/index.js';
const { getNameFromURI } = config;

const parseConceptScheme = (parsedSchema, item) => {
  const {
    '@type': schemeType = '',
    '@id': schemeId = '',
    'rdfs:label': { 'en-US': schemeLabel } = { 'en-US': '' },
    'rdfs:comment': { 'en-US': schemeComment } = { 'en-US': '' },
    'vs:term_status': schemeTermStatus = '',
    'meta:changeHistory': schemeChangeHistory = '',
    'meta:hasConcept': schemeConcepts = [],
    'skos:hasTopConcept': schemeTopConcepts = [],
  } = item;

  const name = getNameFromURI(schemeId);
  const annotation = [
    schemeLabel,
    schemeTermStatus,
    schemeComment,
    schemeChangeHistory ? `Change history: ${schemeChangeHistory}` : false,
  ]
    .filter(Boolean)
    .join(' - ');

  const scheme = {
    type: schemeType,
    id: schemeId,
    name,
    annotation,
    concepts: schemeConcepts,
    topConcepts: schemeTopConcepts,
  };

  parsedSchema.conceptSchemes.push(scheme);
};

export default parseConceptScheme;
