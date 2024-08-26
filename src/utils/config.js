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
    'asn:': 'asn_',
    'ceasn:': 'ceasn_',
    'ceterms:': 'ceterms_',
    'dct:': 'dct_',
    'owl:': 'owl_',
    'qdata:': 'qdata_',
    'rdf:': 'rdf_',
    'rdfs:': 'rdfs_',
    'schema:': 'schema_',
    'skos:': 'skos_',
    'xsd:': 'xsd_',
    'xsd:string': 'String',
    'xsd:anyURI': 'AWSURL',
    'xsd:date': 'Date',
    'xsd:dateTime': 'DateTime',
    'xsd:float': 'Float',
    'xsd:boolean': 'Boolean',
    'xsd:integer': 'Int',
    'xsd:language': 'String',
    'skos:Concept': 'skosConcept',
    'rdf:langString': 'String',
    'qdata:percentage': 'Float',
    'schema:description': 'String',
    'schema:maxValue': 'Float',
    'schema:minValue': 'Float',
    'schema:unitText': 'String',
    'schema:value': 'String',
    'rdfs:Resource': 'AWSURL',
    'schema:Duration': 'String',
    'schema:QuantitativeValue': 'String',
    'schema:Text': 'String',
    'ceasn:Rubric': 'String',
    'rdf:Statement': 'String',
    'xsd:decimal': 'Float',
    'schema:WebPage': 'AWSURL',
  },
  replacer: (key, value) => {
    // if (typeof value === 'string') {
    // 	return Object.keys(config.mappings).reduce((acc, match) => {
    // 		return acc.replace(new RegExp(match, 'g'), config.mappings[match]);
    // 	}, value);
    // }
    return value;
  },
  getInputFilePath,
};

export default config;
