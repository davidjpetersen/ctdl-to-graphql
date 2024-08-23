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

const getInputFilePath = (filename) => {
	return path.join(INPUT_FOLDER_PATH, filename);
};

// Configuration object by stage
const config = {
	remote: {
		ctdl: CTDL_SCHEMA_URL,
		asn: ASN_SCHEMA_URL,
	},
	raw: {
		ctdl: getInputFilePath('/raw/ctdl.json'),
		asn: getInputFilePath('/raw/asn.json'),
	},
	types: {
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
		xsd_string: 'String',
		xsd_anyURI: 'AWSURL',
		xsd_date: 'Date',
		xsd_dateTime: 'DateTime',
		xsd_float: 'Float',
		xsd_boolean: 'Boolean',
		xsd_integer: 'Int',
		xsd_language: 'String',
		rdf_langString: 'String',
		qdata_percentage: 'Float',
		schema_description: 'String',
		schema_maxValue: 'Float',
		schema_minValue: 'Float',
		schema_unitText: 'String',
		schema_value: 'String',
		rdfs_Resource: 'AWSURL',
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
