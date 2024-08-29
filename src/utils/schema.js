/**
 * Utility functions for working with the GraphQL schema.
 *
 * This module provides functions for converting RDFS classes and RDF properties to
 * objects that are easier to work with, as well as functions for getting the
 * GraphQL type for a property based on its accepted values.
 *
 * The `getGraphQLProperties` function is used to generate the GraphQL fields for
 * a class based on its class fields.
 */
import { GraphQLObjectType, GraphQLString, GraphQLUnionType } from 'graphql';

import { config } from './index.js';

const { mappings } = config;

/**
 * Generates a string representation of a property's metadata, including its name, ID, description, and comment.
 *
 * @param {string} name - The name of the property.
 * @param {string} id - The ID of the property.
 * @param {string} description - The description of the property.
 * @param {string} comment - The comment for the property.
 * @returns {string} - A string representation of the property's metadata.
 */
const getPropertyDescription = (propName, id, description, comment) => {
  return [propName, id, description, comment].filter(Boolean).join(' - ');
};

/**
 * Retrieves a property from the provided schema by its name.
 *
 * @param {string} propertyName - The name of the property to retrieve.
 * @param {Object[]} schema - The schema object containing the properties.

 * @returns {Object|undefined} - The property object from the schema, or undefined if not found.
 */
const getPropertyFromSchema = (propertyName, schema) => {
  return schema.find(item => item.id === propertyName) || undefined;
};

/**
 * Maps a property to a GraphQL type based on the accepted values for that property.
 *
 * If the property has multiple accepted values, it creates a GraphQLUnionType with
 * the accepted values as the possible types.
 *
 * If the property has a single accepted value, it maps that value to the corresponding
 * GraphQL type from the `mappings` object.
 *
 * If the property has no accepted values, it defaults to a GraphQLString type.
 *
 * @param {string} propertyName - The name of the property.
 * @param {string[]} acceptedValues - The accepted values for the property.
 * @returns {GraphQLType} - The GraphQL type for the property.
 */
const getPropertyType = (propertyName, acceptedValues) => {
  if (!acceptedValues || acceptedValues.length === 0) {
    throw new Error('Property has no accepted values');
  }
  if (acceptedValues.length > 1) {
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
  }
  if (acceptedValues.length === 1) {
    // console.log('Accepted Value', acceptedValues[0]);
    return mappings[acceptedValues[0]] || acceptedValues[0].replace(':', '_');
  }
  return GraphQLString;
};

/**
 * Generates a GraphQL fields object from the provided class fields and schema.
 *
 * For each property in the class fields, it retrieves the corresponding property
 * from the schema, extracts the property name and accepted values, and maps
 * the property to a GraphQL type using the `getPropertyType` function. The
 * resulting fields object is returned.
 *
 * @param {Object} classFields - An object containing the class fields.
 * @param {Object[]} schema - The schema object containing the properties.
 * @returns {Object} - An object containing the GraphQL fields.
 */
const getGraphQLProperties = (classFields, schema) => {
  if (!classFields) return {};

  return Object.fromEntries(
    Object.entries(classFields).map(([, propertyId]) => {
      const { name, id, acceptedValues, description, comment } =
        getPropertyFromSchema(propertyId, schema);

      return [
        name,
        {
          type: getPropertyType(name, acceptedValues),
          description: getPropertyDescription(name, id, description, comment),
        },
      ];
    })
  );
};

const getGraphQLType = (
  className,
  classDescription,
  graphqlFields,
  subClassOf
) => {
  if (!className) {
    throw new Error('className is required');
  }

  if (!graphqlFields) {
    throw new Error('graphqlFields is required');
  }

  const graphQLTypeConfig = {
    name: className,
    description: `${className} - ${classDescription}`,
    fields: () => graphqlFields,
  };

  if (subClassOf) {
    // Create a dummy subclass if the class is a subclass
    const subClassInterface = subClassOf.map(
      subClass =>
        new GraphQLObjectType({
          name: subClass.replace(':', '_'),
          fields: () => ({}),
        })
    );
    graphQLTypeConfig.interfaces = subClassInterface;
  }

  return new GraphQLObjectType(graphQLTypeConfig);
};

export default {
  getGraphQLProperties,
  getGraphQLType,
  getPropertyDescription,
  getPropertyFromSchema,
  getPropertyType,
};
