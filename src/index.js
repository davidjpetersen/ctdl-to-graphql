import {
  cleanDirs,
  cleanSchema,
  fetchAndStoreSchemas,
  mapSchemaToGraphql,
  parseSchemas,
  writeSchema,
} from './tasks/index.js';

import { Listr } from 'listr2';

const tasks = new Listr(
  [
    {
      // Cleans the dirs
      title: 'Clean dirs',
      task: cleanDirs,
    },
    {
      // Fetches the schema
      title: 'Fetch and store CTDL data',
      task: async ctx => fetchAndStoreSchemas(ctx),
    },
    {
      // Parses the schema
      title: 'Parsing CTDL Schema',
      task: async ctx => parseSchemas(ctx),
    },
    {
      // Maps the schema to GraphQL
      title: 'Mapping to GraphQL',
      task: async ctx => mapSchemaToGraphql(ctx),
    },
    {
      // Removes empty types
      title: 'Cleaning up schema',
      task: async ctx => cleanSchema(ctx),
    },
    {
      // Writes the schema to schema.graphql
      title: 'Write GraphQL Schema to file',
      task: async ctx => writeSchema(ctx),
    },
  ],
  {
    concurrent: false, // Run tasks sequentially
    exitOnError: true, // Stop on the first error
  }
);

async function main() {
  try {
    await tasks.run();
    console.log('CTDL to GraphQL conversion complete!');
  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
  }
}

main();
