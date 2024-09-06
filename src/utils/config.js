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
    'xsd:integer': 'GraphQLInt',
    'xsd:string': 'GraphQLString',
    'xsd:boolean': 'GraphQLBoolean',
    'xsd:anyURI': 'GraphQLString',
    'xsd:date': 'GraphQLString',
    'xsd:dateTime': 'GraphQLString',
    'xsd:time': 'GraphQLString',
    'xsd:decimal': 'GraphQLFloat',
    'xsd:double': 'GraphQLFloat',
    'xsd:float': 'GraphQLFloat',
    'xsd:language': 'GraphQLString',
    'rdf:langString': 'GraphQLString',
    'skos:Concept': 'GraphQLString',
    'ceasn:CriterionLevel': 'ceasn_CriterionLevel',
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
};

export default config;
