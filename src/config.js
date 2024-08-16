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
};

export default config;
