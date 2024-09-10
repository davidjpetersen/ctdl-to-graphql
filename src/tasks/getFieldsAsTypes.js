import { GraphQLObjectType, GraphQLUnionType, printType } from 'graphql';
import { config, files } from '../utils/index.js';

const { getOutputFilePath, getNameFromURI, mappings } = config;

const getFieldsAsTypes = async (fields, properties) => {
  const fieldTypes = {};

  await Promise.all(
    fields.map(async field => {
      const property = properties.find(prop => prop.uri === field);
      if (!property) {
        throw new Error(`Property not found: ${field}`);
      }

      const fieldName = getNameFromURI(field);

      const optionCount = property?.valuetype?.length ?? 0;

      switch (optionCount) {
        case 0:
          // console.log('Creating String property:', fieldName);
          fieldTypes[fieldName] = { name: fieldName, type: String };
          break;
        case 1:
          // console.log('Creating Object property:', fieldName);

          fieldTypes[fieldName] = {
            name: fieldName,
            type: await createObjectProperty(property),
          };
          break;
        default:
          // console.log('Creating Union property:', fieldName);
          fieldTypes[fieldName] = {
            name: fieldName,
            type: await createUnionProperty(property),
          };

          break;
      }
    })
  );

  return fieldTypes;
};

const createObjectProperty = ({ uri, description, valuetype }) => {
  const propType = valuetype[0];
  const typeName = getNameFromURI(uri);
  const typeDescription = description?.['en-US'] ?? null;
  const typeValue = mappings[propType] || getNameFromURI(propType);

  return new GraphQLObjectType({
    name: typeValue,
    // description: typeDescription,
  });
};
const createUnionProperty = async ({ uri, description, valuetype }) => {
  const name = `${getNameFromURI(uri)}Union`;
  const descriptionText = description?.['en-US'] ?? null;

  const types = valuetype.map(
    type =>
      new GraphQLObjectType({
        name: getNameFromURI(type),
      })
  );

  const unionPath = getOutputFilePath('unionType.graphql');
  const unionType = new GraphQLUnionType({
    name,
    // description: descriptionText,
    types,
  });

  await files.appendToFile(unionPath, `${printType(unionType)}\n`);

  return unionType;
};
export default getFieldsAsTypes;
