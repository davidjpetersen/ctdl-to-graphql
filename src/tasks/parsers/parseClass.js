import { config } from '../../utils/index.js';
const { getNameFromURI } = config;

const parseClass = (parsedSchema, item) => {
  const {
    '@type': type = '',
    '@id': id = '',
    'rdfs:label': { 'en-US': label } = { 'en-US': '' },
    'rdfs:comment': { 'en-US': comment } = { 'en-US': '' },
    'dct:description': { 'en-US': description } = { 'en-US': '' },
    'vs:term_status': termStatus = '',
    'meta:changeHistory': changeHistory = '',
    'rdfs:subClassOf': subClassOf = [],
    'meta:domainFor': fields = [],
  } = item;

  const name = getNameFromURI(id);
  const annotation = [
    label,
    termStatus,
    description,
    comment,
    changeHistory ? `Change history: ${changeHistory}` : false,
  ]
    .filter(Boolean)
    .join(' - ');

  const processedItem = {
    type,
    id,
    name,
    annotation,
    extends: subClassOf,
    fields,
  };

  if (subClassOf.length > 0) {
    parsedSchema.classes.childClasses.push(processedItem);
  } else {
    parsedSchema.classes.parentClasses.push(processedItem);
  }
};

export default parseClass;
