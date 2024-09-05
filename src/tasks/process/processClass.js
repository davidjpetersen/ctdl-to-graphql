import { GraphQLObjectType, printType } from 'graphql';
import { config, files } from '../../utils/index.js';
const { CLASSES_FOLDER } = config.types;
const { createFile } = files;
const getNameFromURI = uri => {
  if (!uri) {
    return '';
  }
  const parts = uri.split(':');
  return parts[1] ? parts[1].trim() : '';
};

const getFieldType = fieldID => {
  f;
  if (!fieldID) {
    throw new Error('a field needs an id');
  }
};

const getGraphQLType = (
  className,
  classDescription,
  graphqlFields,
  subClassOf = ''
) => {
  if (!className || !graphqlFields) {
    throw new Error('className and graphqlFields are required');
  }

  const graphQLTypeConfig = {
    name: className,
    description: `${className} - ${classDescription}`,
  };

  if (graphqlFields) {
    console.log('Fields:', graphqlFields);
    graphQLTypeConfig.fields = Object.keys(graphqlFields).reduce((acc, key) => {
      const fieldsName = graphqlFields[key]
        .replace('ceterms:', '')
        .replace('ceasn:', '')
        .replace('schema:', '')
        .replace('asn:', '')
        .replace('qdata:', '')
        .replace('dct:', '')
        .replace('skos:', '')
        .replace(':', '_');

      const fieldType = getFieldType(graphqlFields[key]);
      acc[fieldsName] = { type: fieldType };
      return acc;
    }, {});
  }

  if (subClassOf) {
    graphQLTypeConfig.interfaces = [subClassOf];
  }
  console.log(graphQLTypeConfig);
  return new GraphQLObjectType(graphQLTypeConfig);
};

const processClass = async (item, schema) => {
  const { uri, required, optional, description } = item;

  const name = getNameFromURI(uri);

  const fields = { ...required, ...optional };

  const classType = getGraphQLType(name, description, fields);

  const filePath = `${CLASSES_FOLDER}/${name}.graphql`;
  await createFile(filePath, printType(classType));
};

export default processClass;
