import {
  GraphQLUnionType,
  GraphQLObjectType,
  GraphQLString,
  printType,
} from 'graphql';

import { config, files } from '../utils/index.js';

const { getOutputFilePath, getNameFromURI } = config;

const getFieldsAsTypes = async (fields, properties) => {
  const fieldTypes = {};

  await Promise.all(
    fields.map(async field => {
      const property = properties.find(prop => prop.uri === field);
      if (!property) {
        throw new Error(`Property not found: ${field}`);
      }

      const fieldName = getNameFromURI(field);
      const optionCount = property.valueTypes?.length ?? 0;

      fieldTypes[fieldName] =
        optionCount === 0
          ? GraphQLString
          : optionCount === 1
            ? createObjectProperty(property)
            : createUnionProperty(property);
    })
  );

  return fieldTypes;
};

const createObjectProperty = ({ uri, description, fields }) => {
  return new GraphQLObjectType({
    name: getNameFromURI(uri),
    description: description?.['en-US'] ?? null,
    fields: () =>
      Object.fromEntries(
        fields.map(([fieldName, { type, description }]) => [
          fieldName,
          { type, description },
        ])
      ),
  });
};
const createUnionProperty = async ({ uri, description, valuetype }) => {
  const name = `${getNameFromURI(uri)}Union`;
  const descriptionText = description?.['en-US'] ?? null;

  const types = valuetype.map(
    type =>
      new GraphQLObjectType({
        name: getNameFromURI(type),
        fields: {},
      })
  );

  const unionType = new GraphQLUnionType({
    name,
    description: descriptionText,
    types,
  });

  const unionPath = getOutputFilePath('unionType.graphql');
  fieldTypes[fieldName] = unionType;
  await files.appendToFile(
    unionPath,
    `${printType(fieldTypes[fieldName])}\n\n\n`
  );
  return fieldTypes[fieldName];
};

export default getFieldsAsTypes;
