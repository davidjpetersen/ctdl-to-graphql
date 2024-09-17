import { config, files } from '../../utils/index.js';
import {
  mapChildClasses,
  mapObjectProperties,
  mapParentClasses,
  mapUnionProperties,
} from './index.js';

import { printType } from 'graphql';

const { getOutputFilePath } = config;
const { createFile } = files;

const mapSchemaToGraphql = async ctx => {
  const { parsedSchema: schema } = ctx;

  const {
    classes: { childClasses = [], parentClasses = [] },
    properties: { objectProperties = [], unionProperties = [] },
  } = schema;

  const outputPath = getOutputFilePath('schema.graphql');

  const allProperties = [...objectProperties, ...unionProperties];
  console.log('==========================================');
  console.log('SCHEMA FOUND');
  console.log('==========================================');
  console.log('Child classes:', childClasses.length);
  console.log('Parent classes:', parentClasses.length);
  console.log('Object properties:', objectProperties.length);
  console.log('Union properties:', unionProperties.length);
  console.log('==========================================');

  const mappingFunctions = [
    mapParentClasses(parentClasses, allProperties),
    mapChildClasses(childClasses, allProperties),
    mapObjectProperties(objectProperties),
    mapUnionProperties(unionProperties),
  ];

  const results = await Promise.all(mappingFunctions);

  const flattenedResults = results.flat().filter(Boolean);

  ctx.mappedSchema = flattenedResults
    .map(typeObject => printType(typeObject))
    .join('\n\n');
};

export default mapSchemaToGraphql;
