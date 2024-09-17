import { config, files } from '../utils/index.js';
const { createFile } = files;
const { getOutputFilePath } = config;
const writeSchema = ctx => {
  const data = ctx.cleanedSchema;
  const outputFilePath = getOutputFilePath('schema.graphql');
  createFile(outputFilePath, data);
};

export default writeSchema;
