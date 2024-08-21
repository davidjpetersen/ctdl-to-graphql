import { Listr } from 'listr2';
import config from './config.js';
import { cleanDirectories, createFile } from './tasks/files.js';
import {
	combineSchemaFiles,
	downloadSchema,
	generateTypes,
} from './tasks/index.js';
1;
const { remote, raw, input, output, replacer } = config;

const generateUnionPropertyTypes = async (ctx) => {
	const properties = JSON.parse(ctx.properties);
	const unionPropertyTypes = properties
		.filter((property) => property.allowedValues.length > 1)
		.map(
			({ name, allowedValues }) =>
				`union ${name}Union = ${allowedValues.join(' | ')}`
		);
	ctx.unions = unionPropertyTypes.join('\n');
	await createFile(`${input.folderPath}/graphql/unions.graphql`, ctx.unions);
};

const processPrimitives = async (ctx) => {
	const properties = JSON.parse(ctx.properties);
	ctx.primitives = properties
		.filter((property) => property.allowedValues.length === 1)
		.reduce((acc, { name, allowedValues }) => {
			acc[name] = allowedValues[0];
			return acc;
		}, {});

	const primitiveTypesContent = JSON.stringify(ctx.primitives, null, 2);
	await createFile(
		`${input.folderPath}/json/primitiveTypes.json`,
		primitiveTypesContent
	);
};

const generateGraphQLTypesSchema = async (ctx) => {
	const types = JSON.parse(ctx.types);
	const primitiveMappings = ctx.primitives;
	const generatedTypes = await generateTypes(types, primitiveMappings);
	await createFile(
		`${input.folderPath}/graphql/generatedTypes.graphql`,
		generatedTypes
	);
};

const combineSchemas = async () => {
	const schemaFiles = [];
	const schemaContent = combineSchemaFiles(schemaFiles);
	await createFile(`${output.folderPath}/schema.graphql`, schemaContent);
};

const tasks = [
	{ title: 'Clean directories', task: cleanDirectories },
	{ title: 'Download or load schemas', task: downloadSchema },
	// { title: 'Generate Union Property Types', task: generateUnionPropertyTypes },
	// { title: 'Generate Primitive Fields', task: processPrimitives },
	// { title: 'Generate GraphQL Types', task: generateGraphQLTypesSchema },
	// { title: 'Combine Schema Files', task: combineSchemas },
];

const listr = new Listr(tasks);

await listr.run();
