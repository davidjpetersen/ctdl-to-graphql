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
 * Converts an RDFS class to an object that is easier to work with.
 *
 * @param {Object} item - The RDFS class to be destructured.
 * @param {string} item['@id'] - The ID of the RDFS class.
 * @param {string} item['dct_description']['en-US'] - The description of the RDFS class in English.
 * @param {string[]} item['meta_domainFor'] - The fields that are part of the RDFS class.
 * @param {string[]} item['rdfs_subClassOf'] - The superclasses of the RDFS class.
 * @returns {Object} - An object with the destructured properties of the RDFS class.
 */
const destructureClass = item => {
  const classId = item['@id'];
  const className = item['@id'].split('_')[1];
  const classDescription = item['dct_description']?.['en-US'] ?? '';
  const classFields = item['meta_domainFor'] ?? [];
  const subClassOf = item['rdfs_subClassOf'] ?? [];

  return { classId, className, classDescription, classFields, subClassOf };
};

/**
 * Converts an RDF property to an object that is easier to work with.
 *
 * @param {Object} property - The RDF property to be destructured.
 * @param {string} property['@id'] - The ID of the RDF property.
 * @param {string[]} property['schema_rangeIncludes'] - The accepted values for the RDF property.
 * @param {Object} property['dct_description'] - The description of the RDF property.
 * @param {string} property['dct_description']['en-US'] - The description of the RDF property in English.
 * @param {string} property['rdfs_comment'] - The comment for the RDF property.
 * @returns {Object} - An object with the destructured properties of the RDF property.
 */
const destructureProperty = property => {
  const {
    '@id': id,
    schema_rangeIncludes: acceptedValues,
    dct_description,
    rdfs_comment,
  } = property;

  const propName = id.split('_')[1];
  const propId = id;
  const propAcceptedValues = acceptedValues || [];
  const propDescription = dct_description?.['en-US'] || '';
  const propComment = rdfs_comment || '';

  return { propName, propId, propAcceptedValues, propDescription, propComment };
};

/**
 * Gets a description for a property based on its destructured properties.
 *
 * @param {Object} property - The property to get the description for.
 * @param {string} property.propName - The name of the property.
 * @param {string} property.propId - The ID of the property.
 * @param {string} property.propDescription - The description of the property.
 * @param {string} property.propComment - The comment for the property.
 * @returns {string} - A description of the property, combining the name, ID, description, and comment.
 */
const getPropertyDescription = property => {
  const { id, name, description, comment } = destructureProperty(property);

  return [name, id, description, comment].filter(Boolean).join(' - ');
};

/**
 * Retrieves a property from the provided schema by its name.
 *
 * @param {string} propertyName - The name of the property to retrieve.
 * @param {Object[]} schema - The schema object containing the properties.
 * @returns {Object} - The property object from the schema, or undefined if not found.
 */
const getPropertyFromSchema = (propertyName, schema) =>
  schema.find(item => item['@id'] === propertyName);

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
  if (acceptedValues?.length > 1) {
    return new GraphQLUnionType({
      name: `${propertyName}Union`,
      types: acceptedValues.map(
        typeName => new GraphQLObjectType({ name: typeName, fields: {} })
      ),
      resolveType: () => null,
    });
  }
  if (acceptedValues?.length === 1) {
    return mappings[acceptedValues[0]];
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
  const fields = Object.fromEntries(
    Object.entries(classFields).map(([, propertyId]) => {
      const property = getPropertyFromSchema(propertyId, schema);
      const { propName: propertyName, propAcceptedValues: acceptedValues } =
        destructureProperty(property);

      return [
        propertyName,
        {
          type: getPropertyType(propertyName, acceptedValues),
          description: getPropertyDescription(property),
        },
      ];
    })
  );
  return fields;
};

export default {
  destructureClass,
  destructureProperty,
  getGraphQLProperties,
  getPropertyDescription,
  getPropertyFromSchema,
  getPropertyType,
};
