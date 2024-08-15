import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const config = {
	input: {
		folderPath: process.env.INPUT_FOLDER_PATH,
		filePath: process.env.INPUT_FILE_PATH,
		completePath: path.join(
			process.env.INPUT_FOLDER_PATH,
			process.env.INPUT_FILE_PATH
		),
	},
	output: {
		folderPath: process.env.OUTPUT_FOLDER_PATH,
		filePath: process.env.OUTPUT_FILE_NAME,
		completePath: path.join(
			process.env.OUTPUT_FOLDER_PATH,
			process.env.OUTPUT_FILE_NAME
		),
	},
};

export default config;
