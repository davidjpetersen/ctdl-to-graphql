import { config, files, http } from '../utils/index.js';

const { regex, schemas } = config;
const { checkFileExists, createFile } = files;
const { getURL } = http;
const { COLON_REGEX } = regex;

function renameKeys(obj, renameFn) {
  if (Array.isArray(obj)) {
    return obj.map(item => renameKeys(item, renameFn));
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = renameFn(key);
      acc[newKey] = renameKeys(obj[key], renameFn);
      return acc;
    }, {});
  } else {
    return obj;
  }
}

function renameKeyTerms(key) {
  // List of specific terms to replace
  const replacements = {
    '@type': 'type',
    '@id': 'id',
    'meta:domainFor': 'fields',
    'schema:rangeIncludes': 'acceptedValues',
    'rdfs:label': 'label',
    'rdfs:comment': 'comment',
    'dct:description': 'description',
    'owl:equivalentProperty': 'equivalentProperty',
    'vann:usageNote': 'usageNote',
    'vs:term_status': 'status',
    'meta:changeHistory': 'changeHistory',
    'schema:domainIncludes': 'usedBy',
    'rdfs:subPropertyOf': 'subPropertyOf',
    'rdfs:subClassOf': 'subClassOf',
    'owl:equivalentClass': 'equivalentClass',
    'skos:prefLabel': 'prefLabel',
    'skos:definition': 'definition',
    'skos:broader': 'broader',
    'skos:narrower': 'narrower',
    'skos:inScheme': 'inScheme',
    'skos:topConceptOf': 'topConceptOf',
    'skos:narrowMatch': 'narrowMatch',
    'skos:relatedMatch': 'relatedMatch',
  };

  // Check for specific term replacements
  if (replacements[key]) {
    key = replacements[key];
  }

  return key;
}

const isEnUSLangString = value => value?.['en-US'] !== undefined;

const stripLangStrings = obj => {
  if (Array.isArray(obj)) {
    return obj.map(stripLangStrings);
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (isEnUSLangString(value)) {
        acc[key] = value['en-US']; // Flatten to the "en-US" value
      } else {
        acc[key] = stripLangStrings(value); // Recursively handle other objects/arrays
      }
      return acc;
    }, {});
  } else {
    return obj;
  }
};
const addNameProperty = arr => {
  return arr.map(obj => ({
    ...obj,
    name: obj.id.split(':')[1],
    fullName: obj.id.replace(':', '_'),
  }));
};

const downloadSchemas = async schemas => {
  for (const schema of Object.values(schemas)) {
    const { name, url, path } = schema;

    const content = await http.getURL(url);
    const cleanedContent = renameKeys(content['@graph'], renameKeyTerms);
    const langFreeContent = stripLangStrings(cleanedContent);
    const namedContent = addNameProperty(langFreeContent);

    const jsonContent = JSON.stringify(namedContent, null, 2);

    await files.createFile(path, jsonContent);
  }
};

export default downloadSchemas;
