import { Listr } from 'listr2';

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
			ctx.csv = await getURL(config.schema.csv);
			createFolder(config.output.folderPath);
			createFile(config.input.completePath, ctx.csv);
		},
	},
	{
		title: 'Parse CSV',
		task: async (ctx) => {
			ctx.results = await parseCSV(config.input.completePath);
			createFile(
				config.output.completePath,
				JSON.stringify(ctx.results, null, 2)
			);
		},
	},
	{
		title: 'Process CSV data',
		task: async (ctx) => {
			if (ctx.results) {
				ctx.types = extractTypes(ctx.results);
				ctx.properties = extractProperties(ctx.results);
			}
		},
	},
	{
		title: 'Save schema to file',
		task: async (ctx) => {
			const schemaPath = config.output.completePath;
			const types = ctx.types || '';
			const properties = ctx.properties || '';

			createFile(schemaPath, JSON.stringify(types, null, 2));
			createFile(schemaPath, JSON.stringify(properties, null, 2));
		},
	},
];

const listr = new Listr(tasks);

await listr.run();
