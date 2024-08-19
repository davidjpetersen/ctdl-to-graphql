import { Listr } from 'listr2';

import config from './config.js';
import {
	createFile,
	createFolder,
	deleteFile,
	deleteFolder,
} from './tasks/files.js';
import {
	extractProperties,
	extractTypes,
	getURL,
	parseCSV,
} from './tasks/index.js';

const { input, output, replacer, schema } = config;
const tasks = [
	{
		title: 'Clean directories',
		task: async (ctx) => {
			deleteFile(config.output.filePath);
			deleteFolder(config.output.folderPath);
		},
	},
	{
		title: 'Download copy of schema',
		task: async (ctx) => {
			ctx.schema = await getURL(schema.json.schema);
			ctx.schema = ctx.schema['@graph'];
			createFolder(output.folderPath);
			createFile(`${input.folderPath}/schema.json`, JSON.stringify(ctx.schema));
		},
	},
	{
		title: 'Process Terms',
		task: async (ctx) => {
			if (ctx.schema) {
				// Convert schema to array of objects

				ctx.types = extractTypes(ctx.schema);
			}
		},
	},
	{
		title: 'Process Properties',
		task: async (ctx) => {
			if (ctx.schema) {
				ctx.properties = extractProperties(ctx.schema);
			}
		},
	},
	{
		title: 'Save schema to file',
		task: async (ctx) => {
			// Paths to the files
			const schemaPath = output.folderPath;
			const typePath = `${schemaPath}/types.json`;
			const propertyPath = `${schemaPath}/properties.json`;

			// Data to write to the files
			const types = ctx.types || '';
			const properties = ctx.properties || '';

			// Create the files
			createFile(typePath, JSON.stringify(types, replacer, 2));
			createFile(propertyPath, JSON.stringify(properties, replacer, 2));
		},
	},
];

const listr = new Listr(tasks);

await listr.run();
