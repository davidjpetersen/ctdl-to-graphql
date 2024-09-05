import { config, files, schema } from '../../utils/index.js';

import Logger from '../../utils/logger.js';
import { printType } from 'graphql';

const { getGraphQLProperties, getGraphQLType } = schema;

const { createFile } = files;
const { types, extensions } = config;
const { RDFS_CLASS_FOLDER } = types;
const { GRAPHQL_EXTENSION } = extensions;

const processRDFSClass = async (rdfsClass, schema) => {
  try {
    const { fullName, label, description, fields, subClassOf } = rdfsClass;

    if (!fullName) {
      throw new Error('No fullName found for rdfsClass');
    }
    // console.log(`Processing rdfsClass: ${fullName}`);

    const graphQLFields = getGraphQLProperties(fields, schema);

    // console.log(graphQLFields);
    const filePath = `${RDFS_CLASS_FOLDER}/${fullName}${GRAPHQL_EXTENSION}`;

    const classType = getGraphQLType(
      fullName,
      description,
      graphQLFields,
      subClassOf
    );

    await createFile(filePath, printType(classType));

    return classType;
  } catch (error) {
    const logger = new Logger();
    logger.error(`Error in rdfsClass: ${error.message}`);
    throw error;
  }
};

export default processRDFSClass;
