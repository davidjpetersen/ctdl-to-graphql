import { config, files } from '../utils/index.js';

const { types } = config;
const { MERGED_FILE_PATH } = types;

async function mergeSchemas(schemas) {
  const mergedSchema = {
    classes: [],
    properties: [],
  };

  for (const schema of Object.values(schemas)) {
    const { path } = schema;

    const schemaContent = await files.readFile(path);
    const schemaData = JSON.parse(schemaContent);

    if (schemaData.classes) {
      mergedSchema.classes.push(...Object.values(schemaData.classes));
    }

    if (schemaData.properties) {
      mergedSchema.properties.push(...Object.values(schemaData.properties));
    }
  }

  await files.createFile(
    MERGED_FILE_PATH,
    JSON.stringify(mergedSchema, null, 2)
  );

  return mergedSchema;
}

export default { mergeSchemas };
