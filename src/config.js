import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const config = {
	schema: {
		csv: process.env.SCHEMA_CSV_URL || '',
		json: {
			schema: process.env.JSON_SCHEMA_URL || '',
			context: process.env.JSON_CONTEXT_URL || '',
		},
	},
	input: {
		folderPath: process.env.INPUT_FOLDER_PATH || '',
		filePath: process.env.INPUT_FILE_PATH || '',
		completePath: path.join(
			process.env.INPUT_FOLDER_PATH || '',
			process.env.INPUT_FILE_PATH || ''
		),
	},
	output: {
		folderPath: process.env.OUTPUT_FOLDER_PATH || '',
		filePath: process.env.OUTPUT_FILE_NAME || '',
		completePath: path.join(
			process.env.OUTPUT_FOLDER_PATH || '',
			process.env.OUTPUT_FILE_NAME || ''
		),
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
		if (typeof value === 'string') {
			return Object.keys(config.mappings).reduce((acc, match) => {
				return acc.replace(new RegExp(match, 'g'), config.mappings[match]);
			}, value);
		}
		return value;
	},
};

export default config;
