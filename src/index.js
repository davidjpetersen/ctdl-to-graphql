import { Listr } from 'listr2';
import fs from 'fs/promises';
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
	generateTypes,
} from './tasks/index.js';

const { input, output, replacer, schema } = config;

const tasks = [
	{
		title: 'Clean directories',
		task: async () => {
			await Promise.all([
				deleteFile(output.filePath),
				deleteFolder(output.folderPath),
			]);
			await createFolder(output.folderPath);
		},
	},
	{
		title: 'Download or load schema',
		task: async (ctx) => {
			const schemaFilePath = `${input.folderPath}/schema.json`;
			try {
				ctx.schema = JSON.parse(await fs.readFile(schemaFilePath, 'utf8'));
			} catch {
				ctx.schema = (await getURL(schema.json.schema))['@graph'];
				await fs.writeFile(schemaFilePath, JSON.stringify(ctx.schema));
			}
		},
	},
	{
		title: 'Process Terms with type rdfs:Class and save as types.json',
		task: async (ctx) => {
			ctx.types = ctx.schema ? extractTypes(ctx.schema) : null;
			ctx.types = JSON.stringify(ctx.types, replacer, 2) || '';
			await createFile(`${output.folderPath}/types.json`, ctx.types);
		},
	},
	{
		title:
			'Process Properties with type rdf:Property and save as properties.json',
		task: async (ctx) => {
			ctx.properties = ctx.schema ? extractProperties(ctx.schema) : null;
			ctx.properties = JSON.stringify(ctx.properties, replacer, 2) || '';
			await createFile(`${output.folderPath}/properties.json`, ctx.properties);
		},
	},
	{
		title: 'Generate Union Property Types',
		task: async (ctx) => {
			const properties = JSON.parse(ctx.properties);
			const unionPropertyTypes = properties
				.filter((property) => property.allowedValues.length > 1)
				.map(
					({ name, allowedValues }) =>
						`union ${name}Union = ${allowedValues.join(' | ')}`
				);
			await createFile(
				`${output.folderPath}/unions.graphql`,
				unionPropertyTypes.join('\n')
			);
		},
	},
	{
		title: 'Generate Types that use Primitive Fields',
		task: async (ctx) => {
			const properties = JSON.parse(ctx.properties);
			const primitivePropertyTypes = properties
				.filter((property) => property.allowedValues.length === 1)
				.map(({ name, allowedValues }) => `${name}: ${allowedValues}`);
			await createFile(
				`${output.folderPath}/primitiveProperties.graphql`,
				primitivePropertyTypes.join('\n')
			);
		},
	},
	{
		title: 'Generate GraphQL Schema',
		task: async ({ types }) => {
			const parsedTypes = JSON.parse(types) || '';
			const schema = generateTypes(parsedTypes);
			await createFile(`${output.folderPath}/schema.graphql`, schema);
		},
	},
];

const listr = new Listr(tasks);

await listr.run();
