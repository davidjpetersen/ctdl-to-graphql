import { Listr } from 'listr2';
import tasks from './tasks/index.js';
const {
  cleanDirs,
  downloadSchema,
  createSchema,
  // combineSchemas,
} = tasks;

const queue = [
  { title: 'Clean directories', task: cleanDirs },
  { title: 'Download or load schemas', task: downloadSchema },
  { title: 'Generate Schema', task: createSchema },
  // { title: 'Combine Schema Files', task: combineSchemas },
];

const listr = new Listr(queue);

await listr.run();
