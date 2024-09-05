import { config, files } from './utils/index.js';

import { Listr } from 'listr2';
import SchemaProcessor from './SchemaProcessor.js';

/**
 * Initializes a new instance of the `SchemaProcessor` class with the provided `config` and `files` objects.
 * The `SchemaProcessor` class is responsible for processing and managing GraphQL schemas.
 *
 * @param {Object} config - The configuration object containing settings for the application.
 * @param {Object} files - The object containing utilities for reading and writing files.
 */
const schemaProcessor = new SchemaProcessor(config, files);

/**
 * Defines a queue of tasks to be executed by the Listr library.
 *
 * The first task is "Clean directories", which calls the `cleanDirs()` method of the `schemaProcessor` object.
 * The second task is "Load schemas", which calls the `loadSchema()` method of the `schemaProcessor` object.
 *
 * These tasks are executed in the order they are defined when the `listr.run()` method is called.
 */
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
