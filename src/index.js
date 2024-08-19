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
	combineSchemaFiles,
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
		title: 'Process schema data',
		task: async (ctx) => {
			if (!ctx.schema) return;

			ctx.types = JSON.stringify(extractTypes(ctx.schema), replacer, 2);
			ctx.properties = JSON.stringify(
				extractProperties(ctx.schema),
				replacer,
				2
			);

			await Promise.all([
				createFile(`${input.folderPath}/types.json`, ctx.types),
				createFile(`${input.folderPath}/properties.json`, ctx.properties),
			]);
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
			ctx.unions = unionPropertyTypes.join('\n');
			await createFile(`${output.folderPath}/unions.graphql`, ctx.unions);
		},
	},
	{
		title: 'Generate Types with Primitive Fields',
		task: async (ctx) => {
			const properties = JSON.parse(ctx.properties);
			ctx.primitives = properties
				.filter((property) => property.allowedValues.length === 1)

				.reduce((acc, { name, allowedValues }) => {
					acc[name] = allowedValues[0];
					return acc;
				}, {});
			await createFile(
				`${input.folderPath}/primitives.json`,
				JSON.stringify(ctx.primitives, replacer, 2)
			);
		},
	},
	{
		title: 'Generate GraphQL Schema',
		task: async (ctx) => {
			const types = generateTypes(JSON.parse(ctx.types) || '');
			await createFile(`${output.folderPath}/generatedTypes.graphql`, types);
			const schemaFiles = [
				`${input.folderPath}/customTypes.graphql`,
				`${output.folderPath}/generatedTypes.graphql`,
				`${output.folderPath}/unions.graphql`,
			];

			const schemaContent = combineSchemaFiles(schemaFiles);
			await createFile(`${output.folderPath}/schema.graphql`, schemaContent);
		},
	},
];

const listr = new Listr(tasks);

await listr.run();
