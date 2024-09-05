import {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  printType,
} from 'graphql';
import { config, files, schema } from '../../utils/index.js';

const { getGraphQLType, getGraphQLProperties } = schema;
const { extensions, types } = config;
const { createFile } = files;
const { RDF_PROPERTY_FOLDER } = types;
const { GRAPHQL_EXTENSION } = extensions;
const processRDFProperty = async (item, schema) => {
  // const { fullName, comment, acceptedValues, subPropertyOf } = item;
  // const graphQLFields = getGraphQLProperties(acceptedValues, schema);
  // const property = getGraphQLType(
  //   fullName,
  //   comment,
  //   graphQLFields,
  //   subPropertyOf
  // );
  // const filePath = `${RDF_PROPERTY_FOLDER}/${item.fullName}${GRAPHQL_EXTENSION}`;
  // const writeable = printType(property);
  // await createFile(filePath, writeable);
  // console.log('Process RDF Property');
};
export default processRDFProperty;
