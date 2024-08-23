import { Listr } from 'listr2';
import tasks from './tasks/index.js';
const {
	cleanDirs,
	convertRDFSClass,
	convertProperties,
	downloadSchema,
	splitSchema,
} = tasks;

const queue = [
	{ title: 'Clean directories', task: cleanDirs },
	{ title: 'Download or load schemas', task: downloadSchema },
	{ title: 'Split Schema', task: splitSchema },
	// { title: 'Convert rdf_Properties', task: convertProperties },
	// { title: 'Convert rdf_Classes', task: convertRDFSClass },
	// { title: 'Get Union Property Types', task: getUnionTypes },
	// { title: 'Get Primitive Fields', task: getPrimitiveTypes },
	// { title: 'Get GraphQL Types', task: getTypes },
	// { title: 'Combine Schema Files', task: combineSchemas },
];

const listr = new Listr(queue);

await listr.run();
