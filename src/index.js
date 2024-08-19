import { Listr } from 'listr2';
import path from 'path';
import config from './config.js';
import {
	createFile,
	createFolder,
	deleteFile,
	deleteFolder,
} from './tasks/files.js';

import {
	extractTypes,
	extractProperties,
	getURL,
	parseCSV,
} from './tasks/index.js';

const { input, output, schema } = config;
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
			ctx.csv = await getURL(schema.csv);
			createFolder(output.folderPath);
			createFile(input.completePath, ctx.csv);
		},
	},
	{
		title: 'Parse CSV',
		task: async (ctx) => {
			ctx.results = await parseCSV(input.completePath);
			createFile(output.completePath, JSON.stringify(ctx.results, null, 2));
		},
	},
	{
		title: 'Process Terms',
		task: async (ctx) => {
			if (ctx.results) {
				ctx.types = extractTypes(ctx.results);
			}
		},
	},
	{
		title: 'Process Properties',
		task: async (ctx) => {
			if (ctx.results) {
				ctx.properties = extractProperties(ctx.results);
			}
		},
	},
	{
		title: 'Save schema to file',
		task: async (ctx) => {
			const schemaPath = output.folderPath;
			const typePath = path.join(schemaPath, 'types.json');
			const propertyPath = path.join(schemaPath, 'properties.json');
			const types = ctx.types || '';
			const properties = ctx.properties || '';

			createFile(typePath, JSON.stringify(types, null, 2));
			createFile(propertyPath, JSON.stringify(properties, null, 2));
		},
	},
];

const listr = new Listr(tasks);

await listr.run();
