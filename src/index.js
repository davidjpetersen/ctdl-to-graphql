import { cleanDirs, createSchema, downloadSchema } from './tasks/index.js';

import { Listr } from 'listr2';
import { config } from './utils/index.js';

const { schemas } = config;
/**
 * Defines a queue of tasks to be executed by the Listr library. The tasks include:
 * - Cleaning directories
 * - Downloading or loading schemas
 * - Generating a schema
 */

const tasks = [
  { title: 'Clean directories', task: cleanDirs },
  { title: 'Download or load schemas', task: downloadSchema },
  { title: 'Generate Schema', task: createSchema(schemas) },
  // { title: 'Combine Schema Files', task: combineSchemas },
];

/**
 * Initializes a new Listr instance with the defined queue of tasks to be executed.
 */
const listr = new Listr(tasks);

/**
 * Executes the queue of tasks defined in the `queue` array using the Listr library.
 */
await listr.run();
