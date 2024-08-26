import { GraphQLObjectType, GraphQLUnionType, printType } from 'graphql';
import { config, files } from '../utils/index.js';

const { extensions, types, mappings } = config;
const { JSON_EXTENSION } = extensions;
const { RDF_PROPERTY_FOLDER } = types;
const { getFolderFiles, readFile, createFile } = files;

const convertProperties = async () => {
  const jsonFiles = (await getFolderFiles(RDF_PROPERTY_FOLDER)).filter(file =>
    file.endsWith(JSON_EXTENSION)
  );

  for (const file of jsonFiles) {
    const contents = await readFile(file);
    const property = JSON.parse(contents);

    const {
      '@id': name,
      'rdfs:comment': { 'en-US': description = '' } = {},
      'schema:rangeIncludes': acceptedValues = [],
    } = property;

    const cleanName = name.replace(/:/g, '_');

    // Generate a union type if there are multiple accepted values
    if (acceptedValues.length > 1) {
      const unionType = new GraphQLUnionType({
        name: name.replace(':', '_'), // Replace invalid characters
        description,
        types: acceptedValues.map(value => value.replace(':', '_')), // Replace invalid characters
      });

      const graphqlFilePath = file.replace('.json', '.graphql');
      await createFile(graphqlFilePath, printType(unionType));
    }

    // Generate a GraphQLObjectType if there is only one accepted value
    if (acceptedValues.length === 1) {
      let field = acceptedValues[0];
      field = mappings[field] || field;
      field = field.replace(':', '_');

      const objectType = new GraphQLObjectType({
        name: cleanName, // Replace invalid characters
        description,
        fields: {
          [cleanName]: {
            type: field, // Replace invalid characters
            description,
          },
        },
      });

      const graphqlFilePath = file.replace('.json', '.graphql');
      await createFile(graphqlFilePath, printType(objectType));
    }
  }
};

export default convertProperties;
