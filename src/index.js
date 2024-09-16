import {
  cleanDirs,
  fetchAndStoreSchemas,
  mapSchemaToGraphql,
  mergeObjects,
  parseSchemas,
} from './tasks/index.js';

import { Listr } from 'listr2';

const tasks = new Listr(
  [
    {
      title: 'Clean dirs',
      task: cleanDirs,
    },
    {
      title: 'Fetch and store CTDL data',
      task: async ctx => fetchAndStoreSchemas(ctx),
    },
    {
      title: 'Parsing CTDL Schema',
      task: async ctx => parseSchemas(ctx),
    },
    // {
    //   title: 'Merge Schemas',
    //   task: async ctx => mergeObjects(ctx),
    // },
    {
      title: 'Mapping to GraphQL',
      task: async ctx => mapSchemaToGraphql(ctx),
    },
    // {
    //   title: 'Generating GraphQL Schema File',
    //   task: async (ctx, task) => {
    //     await generateSchema(ctx.graphqlSchema, config);
    //   },
    // },
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
