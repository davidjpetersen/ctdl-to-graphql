import { GraphQLObjectType, GraphQLUnionType } from 'graphql';

import { config } from './index.js';

const { mappings } = config;

const getPropertyDescription = (propName, id, description, comment) => {
  return [propName, id, description, comment].filter(Boolean).join(' - ');
};

const getPropertyFromSchema = (propertyID, schema) => {
  return schema.find(item => item.id === propertyID);
};

const getPropertyType = (propertyName, acceptedValues) => {
  if (!acceptedValues || acceptedValues.length === 0) {
    return String;
  }

  if (acceptedValues.length === 1) {
    return mappings[acceptedValues[0]] || acceptedValues[0].replace(':', '_');
  }

  return new GraphQLUnionType({
    name: `${propertyName}Union`,
    types: acceptedValues.map(
      typeName =>
        new GraphQLObjectType({
          name: typeName.replace(':', '_'),
          fields: {},
        })
    ),
    resolveType: () => null,
  });
};

const getGraphQLProperties = (classFields, schema) => {
  if (!classFields) return {};
  console.log('Fields', classFields);
  return Object.fromEntries(
    Object.entries(classFields)
      .map(([, propertyId]) => {
        const property = getPropertyFromSchema(propertyId, schema);
        if (!property) {
          console.warn(`Property not found in schema: ${propertyId}`);
          return null;
        }

        const {
          fullName = '',
          id = '',
          fields = [],
          description = '',
          comment = '',
        } = property;

        return [
          fullName,
          {
            type: getPropertyType(fullName, fields),
            // description: getPropertyDescription(
            //   fullName,
            //   id,
            //   description,
            //   comment
            // ),
          },
        ];
      })
      .filter(Boolean)
  );
};

const getGraphQLType = (
  className,
  classDescription,
  graphqlFields,
  subClassOf
) => {
  if (!className || !graphqlFields) {
    throw new Error('className and graphqlFields are required');
  }

  const graphQLTypeConfig = {
    name: className,
    // description: `${className} - ${classDescription}`,
    fields: graphqlFields,
  };

  // if (subClassOf) {
  //   console.log('SubClassOf', subClassOf);
  //   graphQLTypeConfig.interfaces = subClassOf.map(subClass => {
  //     return subClass;
  //   });
  // }

  return new GraphQLObjectType(graphQLTypeConfig);
};

export default {
  getGraphQLProperties,
  getGraphQLType,
  getPropertyDescription,
  getPropertyFromSchema,
  getPropertyType,
};
