import { GraphQLObjectType, printType } from 'graphql';

const getGraphQLSchema = async (jsonSchema, config, files) => {
  const { getOutputFilePath, getNameFromURI } = config;

  for (const schemaObj of jsonSchema) {
    const { name, description, fields } = schemaObj;

    // Handle fields as an object
    const typeFields = Object.entries(fields).reduce(
      (acc, [fieldName, field]) => {
        const { label, description, type, comment } = field;
        acc[fieldName] = {
          type,
          // description: description?.['en-US'] || null,
          resolve: () => ({
            name: getNameFromURI(fieldName),
            label: label?.['en-US'] || null,
            // description: description?.['en-US'] || null,
            comment: comment?.['en-US'] || null,
          }),
        };
        return acc;
      },
      {}
    );

    const classType = new GraphQLObjectType({
      name,
      // description,
      fields: typeFields,
    });

    const classPath = getOutputFilePath('classes.graphql');
    await files.appendToFile(classPath, `${printType(classType)}\n\n`);
  }

  return true;
};

export default getGraphQLSchema;
