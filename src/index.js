import { config, files } from './utils/index.js';

import { Listr } from 'listr2';
import SchemaProcessor from './SchemaProcessor.js';

// Initialize SchemaProcessor here
const schemaProcessor = new SchemaProcessor(config, files);

const tasks = [
  {
    title: 'Clean directories',

    task: () => schemaProcessor.cleanDirs(),
  },
  {
    title: 'Load schemas',

    task: () => schemaProcessor.loadSchema(),
  },
];

/**
 * Initializes a new Listr instance with the defined queue of tasks to be executed.
 */
const listr = new Listr(tasks);

/**
 * Executes the queue of tasks defined in the `queue` array using the Listr library.
 */
await listr.run();
