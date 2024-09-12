import { config, files } from '../../utils/index.js';

import { mergeObjects } from '../index.js';
import { parseSchema } from '../index.js';

const { createFile } = files;
const parseSchemas = async ctx => {
  const parsedSchemas = await Promise.all(
    ctx.allSchemas.map(async ({ name, schema }) => await parseSchema(schema))
  ).then(parsedSchemas =>
    parsedSchemas.reduce((acc, schema) => mergeObjects(acc, schema), {})
  );

  ctx.parsedSchema = parsedSchemas;

  const schemaToWrite = JSON.stringify(parsedSchemas, null, 2);
  const filePath = config.getInputFilePath('parsed/parsedSchemas.json');
  await createFile(filePath, schemaToWrite);
};

export default parseSchemas;
