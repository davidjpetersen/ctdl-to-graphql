import { Listr } from 'listr2';
import tasks from './tasks/index.js';
const { cleanDirs, convertProperties, downloadSchema, splitSchema, rdfsClass } =
  tasks;

const queue = [
  { title: 'Clean directories', task: cleanDirs },
  { title: 'Download or load schemas', task: downloadSchema },
  { title: 'Split Schema', task: splitSchema },
  { title: 'Generate rdfsClasses', task: rdfsClass },
  { title: 'Convert Properties', task: convertProperties },
  // { title: 'Get Union Property Types', task: getUnionTypes },
  // { title: 'Get Primitive Fields', task: getPrimitiveTypes },
  // { title: 'Get GraphQL Types', task: getTypes },
  // { title: 'Combine Schema Files', task: combineSchemas },
];

const listr = new Listr(queue);

await listr.run();
