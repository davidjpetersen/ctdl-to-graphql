import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const vars = process.env;
const {
  FRESH_START,
  ASN_MAPPING_URL,
  CTDL_MAPPING_URL,
  INPUT_FOLDER_PATH,
  OUTPUT_FILE_PATH,
  OUTPUT_FOLDER_PATH,
} = vars;

const getInputFilePath = filename => {
  return path.join(INPUT_FOLDER_PATH, filename);
};

const getOutputFilePath = filename => {
  return path.join(OUTPUT_FOLDER_PATH, filename);
};

const getNameFromURI = uri => (uri ? uri.split(':')[1]?.trim() || '' : '');

// Configuration object by stage
const config = {
  freshStart: FRESH_START,
  schemas: [
    {
      name: 'ctdl',
      url: CTDL_MAPPING_URL,
    },
    {
      name: 'asn',
      url: ASN_MAPPING_URL,
    },
  ],
  extensions: {
    JSON_EXTENSION: '.json',
    GRAPHQL_EXTENSION: '.graphql',
  },
  regex: {
    COLON_REGEX: /:/g,
  },
  types: {
    CLASSES_FOLDER: getInputFilePath('/classes'),
    PROPERTIES_FOLDER: getInputFilePath('/properties'),
    MERGED_FILE_PATH: getInputFilePath('merged.json'),
    OUTPUT_FILE_PATH: getOutputFilePath('schema.graphql'),
  },
  properties: {
    ctdl: getInputFilePath('/ctdl/Props.json'),
    asn: getInputFilePath('/asn/Props.json'),
  },
  output: OUTPUT_FILE_PATH,
  mappings: {
    'xsd:integer': 'Int',
    'xsd:string': 'String',
    'xsd:boolean': 'Boolean',
    'xsd:anyURI': 'String',
    'xsd:date': 'String',
    'xsd:dateTime': 'String',
    'xsd:time': 'String',
    'xsd:decimal': 'Float',
    'xsd:double': 'Float',
    'xsd:float': 'Float',
    'xsd:language': 'String',
    'rdf:langString': 'String',
    'skos:Concept': 'String',
  },
  // List of replacements for downloadSchemas.js to clean the schema data.
  replacements: {
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
  },
  getInputFilePath,
  getOutputFilePath,
  getNameFromURI,
};

export default config;
