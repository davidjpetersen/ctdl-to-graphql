import { Listr } from 'listr2';

import config from './config.js';
import { createFile, createFolder, deleteFile, deleteFolder } from './tasks/files.js';
import { generateSchema, parseCSV, processCSVData, saveSchemaToFile } from './tasks/index.js';

const tasks = [
	{
		title: 'Clean directories',
		task: async (ctx) => {
			deleteFile(config.output.filePath);
			deleteFolder(config.output.folderPath);
			createFolder(config.output.folderPath);
			createFile(config.output.filePath, '');
		},
	},
	{
		title: 'Parsing CSV file',
		task: async (ctx) => {
			ctx.results = await parseCSV(config.input.completePath);
		},
	},
	{
		title: 'Processing CSV data',
		task: async (ctx) => {
			const { schemaTypes, fieldTypes } = processCSVData(ctx.results);
			ctx.schemaString = generateSchema({ schemaTypes, fieldTypes });
		},
	},
	{
		title: 'Saving GraphQL schema to file',
		task: async (ctx) => {
			saveSchemaToFile(ctx.schemaString, outputFilePath);
		},
	},
];

const listr = new Listr(tasks);
await listr.run();
