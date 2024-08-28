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
  remote: {
    ctdl: CTDL_SCHEMA_URL,
    asn: ASN_SCHEMA_URL,
  },
  raw: {
    ctdl: getInputFilePath('/raw/ctdl.json'),
    asn: getInputFilePath('/raw/asn.json'),
  },
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
    xsd_integer: 'GraphQLInt',
    xsd_string: 'GraphQLString',
    xsd_boolean: 'GraphQLBoolean',
    xsd_anyURI: 'GraphQLString',
    xsd_date: 'GraphQLString',
    xsd_dateTime: 'GraphQLString',
    xsd_time: 'GraphQLString',
    xsd_decimal: 'GraphQLFloat',
    xsd_double: 'GraphQLFloat',
    xsd_float: 'GraphQLFloat',
    rdf_langString: 'GraphQLString',
    skos_Concept: 'GraphQLString',
  },
  getInputFilePath,
};

export default config;
