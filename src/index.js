import { config, http, schemaUtils } from './utils/index.js';
import {
  fetchSchema,
  generateSchema,
  mapToGraphql,
  parseCtdl,
} from './tasks/index.js';

import { Listr } from 'listr2';
import { files } from './utils/index.js';

const { schemas, getInputFilePath } = config;
const { createFile } = files;

const tasks = new Listr(
  [
    {
      title: 'Fetching CTDL Data',
      task: async (ctx, task) => {
        // Fetch and write each raw schema in the config.schema object

        const ctdlData = await Promise.all(
          schemas.map(async ({ name, url }) => {
            const rawSchema = await fetchSchema(url);
            const schemaToWrite = JSON.stringify(rawSchema, null, 2);
            const filePath = getInputFilePath(`raw/${name}.json`);
            await createFile(filePath, schemaToWrite);
            return { name, schema: rawSchema };
          })
        );

        ctx.ctdlData = ctdlData;
      },
    },
    {
      title: 'Parsing CTDL Schema',
      task: async (ctx, task) => {
        ctx.parsedSchema = await parseCtdl(ctx.ctdlData);
        const schemaToWrite = JSON.stringify(ctx.parsedSchema, null, 2);
        const filePath = config.getInputFilePath('parsedSchema.json');
        await createFile(filePath, schemaToWrite);
      },
    },
    // {
    //   title: 'Mapping to GraphQL',
    //   task: async (ctx, task) => {
    //     ctx.graphqlSchema = mapToGraphql(ctx.parsedSchema, schemaUtils);
    //   },
    // },
    // {
    //   title: 'Generating GraphQL Schema File',
    //   task: async (ctx, task) => {
    //     await generateSchema(ctx.graphqlSchema, config);
    //   },
    // },
  ],
  // Optional Listr configuration
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
