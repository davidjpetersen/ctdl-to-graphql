import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  printType,
} from 'graphql';
import { config, files } from '../../utils/index.js';

const { extensions, types } = config;
const { createFile } = files;
const { RDF_PROPERTY_FOLDER } = types;
const { GRAPHQL_EXTENSION } = extensions;
const processRDFProperty = async (item, schema) => {
  // Example of creating a GraphQL field definition

  const property = new GraphQLObjectType({
    name: item.fullName,
    description: item.comment || '',
    fields: {
      label: { type: GraphQLString, description: item.label || '' },
      comment: { type: GraphQLString, description: item.comment || '' },
      status: { type: GraphQLString, description: 'Status of the property' },
      changeHistory: {
        type: GraphQLString,
        description: 'Change history URL',
      },

      subPropertyOf: {
        type: new GraphQLList(GraphQLString),
        description: 'Sub-properties',
      },
      usedBy: {
        type: new GraphQLList(GraphQLString),
        description: 'Used by',
      },
      acceptedValues: {
        type: new GraphQLList(GraphQLString),
        description: 'Accepted values',
      },
    },
  });

  const filePath = `${RDF_PROPERTY_FOLDER}/${item.fullName}${GRAPHQL_EXTENSION}`;
  const writeable = printType(property);
  console.log(writeable);
  await createFile(filePath, writeable);
};
export default processRDFProperty;
