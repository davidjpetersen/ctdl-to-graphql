import createProperty from '../createProperties.js';

/**
 * Processes the classes defined in the provided schema, creating GraphQL type definitions for each class.
 *
 * @param {object} schema - The schema object containing the class and property definitions.
 * @param {object} config - The configuration object containing utility functions.
 * @param {object[]} files - An array of file objects containing additional data.
 * @returns {Promise<object[]>} - An array of GraphQL type definitions for the processed classes.
 */
const processClasses = async (schema, config, files) => {
  const { classes, properties } = schema;
  const { getNameFromURI } = config;

  return Promise.all(
    classes.map(async classItem => {
      const { uri, label, description, comment, optional, required } =
        classItem;

      const fields = await Promise.all(
        [...optional, ...required].map(async field => {
          const termName = getNameFromURI(field);
          const propertyConfig = properties.find(prop => prop.uri === field);
          const property = await createProperty(propertyConfig, config, files);
          return [termName, property];
        })
      );

      return {
        name: getNameFromURI(uri),
        label: label?.['en-US'] ?? null,
        description: description?.['en-US'] ?? null,
        comment: comment?.['en-US'] ?? null,
        fields: Object.fromEntries(fields),
      };
    })
  );
};

export default processClasses;
