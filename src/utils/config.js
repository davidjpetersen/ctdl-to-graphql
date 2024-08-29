import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const vars = process.env;
const {
  ASN_SCHEMA_URL,
  CTDL_SCHEMA_URL,
  INPUT_FOLDER_PATH,
  OUTPUT_FOLDER_PATH,
} = vars;

const getInputFilePath = filename => {
  return path.join(INPUT_FOLDER_PATH, filename);
};

// Configuration object by stage
const config = {
  extensions: {
    JSON_EXTENSION: '.json',
    GRAPHQL_EXTENSION: '.graphql',
  },
  regex: {
    COLON_REGEX: /:/g,
  },
  schemas: [
    {
      name: 'ctdl',
      url: CTDL_SCHEMA_URL,
      path: getInputFilePath('/raw/ctdl.json'),
    },
    {
      name: 'asn',
      url: ASN_SCHEMA_URL,
      path: getInputFilePath('/raw/asn.json'),
    },
  ],
  types: {
    RDFS_CLASS_FOLDER: getInputFilePath('/rdfs/Class'),
    RDF_PROPERTY_FOLDER: getInputFilePath('/rdf/Property'),
    ctdl: getInputFilePath('/ctdl/Types.json'),
    asn: getInputFilePath('/asn/Types.json'),
  },
  properties: {
    ctdl: getInputFilePath('/ctdl/Props.json'),
    asn: getInputFilePath('/asn/Props.json'),
  },
  output: {
    folderPath: OUTPUT_FOLDER_PATH,
  },
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
  getInputFilePath,
};

export default config;
