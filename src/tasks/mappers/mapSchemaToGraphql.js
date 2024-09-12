import { config, files } from '../../utils/index.js';
import {
  mapChildClasses,
  mapConceptSchemes,
  mapConcepts,
  mapObjectProperties,
  mapParentClasses,
  mapUnionProperties,
} from './index.js';

const { getOutputFilePath } = config;
const { createFile } = files;

const mapSchemaToGraphql = async ctx => {
  const { parsedSchema } = ctx;
  const schema = parsedSchema;

  const {
    classes: { childClasses = [], parentClasses = [] },
    properties: { objectProperties = [], unionProperties = [] },
    concepts = [],
    conceptSchemes = [],
  } = schema;

  console.log('==========================================');
  console.log('SCHEMA FOUND');
  console.log('==========================================');
  console.log('Child classes:', childClasses?.length ?? 0);
  console.log('Parent classes:', parentClasses?.length ?? 0);
  console.log('Object properties:', objectProperties?.length ?? 0);
  console.log('Union properties:', unionProperties?.length ?? 0);
  console.log('Concepts:', concepts?.length ?? 0);
  console.log('Concept schemes:', conceptSchemes?.length ?? 0);
  console.log('==========================================');

  const [
    parentClassesResult,
    childClassesResult,
    objectPropertiesResult,
    unionPropertiesResult,
    conceptSchemesResult,
    conceptsResult,
  ] = await Promise.all([
    mapParentClasses(parentClasses),
    mapChildClasses(childClasses),
    mapObjectProperties(objectProperties),
    mapUnionProperties(unionProperties),
    mapConceptSchemes(conceptSchemes),
    mapConcepts(concepts),
  ]);

  const aggregatedResult = [
    parentClassesResult,
    childClassesResult,
    objectPropertiesResult,
    unionPropertiesResult,
    conceptSchemesResult,
    conceptsResult,
  ].join('\n\n');

  ctx.schema = aggregatedResult;
  await createFile(getOutputFilePath('schema.graphql'), aggregatedResult);
  console.log('Mapping complete');
};
export default mapSchemaToGraphql;
