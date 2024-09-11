import { config } from '../utils/index.js';
const { getNameFromURI } = config;

const parseProperty = (parsedSchema, item) => {
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
};

export default parseProperty;
