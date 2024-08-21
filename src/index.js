import { Listr } from 'listr2';
import { config, files } from './utils/index.js';
import tasks from './tasks/index.js';

const { cleanDirs, createFile } = files;
const { remote, raw, input, output, replacer } = config;
const {
	downloadSchema,
	combineSchemas,
	getPrimitiveTypes,
	getTypesSchema,
	getUnionTypes,
} = tasks;
const queue = [
	{ title: 'Clean directories', task: cleanDirs },
	{ title: 'Download or load schemas', task: downloadSchema },
	{ title: 'Get Union Property Types', task: getUnionTypes },
	{ title: 'Get Primitive Fields', task: getPrimitiveTypes },
	{ title: 'Get GraphQL Types', task: getTypesSchema },
	{ title: 'Combine Schema Files', task: combineSchemas },
];

const listr = new Listr(queue);

await listr.run();
