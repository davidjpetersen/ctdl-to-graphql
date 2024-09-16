import { config } from '../../utils/index.js';
const { getNameFromURI } = config;

const parseProperty = (parsedSchema, item) => {
  const {
    '@type': type = '',
    '@id': id = '',
    'rdfs:label': { 'en-US': label } = { 'en-US': '' },
    'rdfs:comment': { 'en-US': comment } = { 'en-US': '' },
    'vann:usageNote': { 'en-US': usageNote } = { 'en-US': '' },
    'vs:term_status': termStatus = '',
    'meta:changeHistory': changeHistory = '',
    'rdfs:subPropertyOf': subPropertyOf = [],
    'schema:domainIncludes': usedBy = [],
    'schema:rangeIncludes': options = [],
    'meta:targetScheme': targetScheme = [],
  } = item;

  const name = getNameFromURI(id);
  const annotation = [
    label,
    termStatus,
    comment,
    usageNote ? `Usage Node: ${usageNote}` : false,
    changeHistory ? `Change history: ${changeHistory}` : false,
  ]
    .filter(Boolean)
    .join(' - ');

  const processedProp = {
    type,
    id,
    name,
    annotation,
    extends: subPropertyOf,
    options,
    usedBy,
    targetScheme,
  };

  if (options.length === 0) {
    console.log('No options found for property:', name);
  }
  if (options.length === 1) {
    parsedSchema.properties.objectProperties.push(processedProp);
  }
  if (options.length > 1) {
    parsedSchema.properties.unionProperties.push(processedProp);
  }
};

export default parseProperty;
