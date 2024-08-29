import { config, files, logger, schema } from '../../utils/index.js';

import Logger from '../../utils/logger.js';
import { printType } from 'graphql';

const { getGraphQLProperties, getGraphQLType, destructureClass } = schema;

const { createFile } = files;
const { types, extensions } = config;
const { RDFS_CLASS_FOLDER } = types;
const { GRAPHQL_EXTENSION } = extensions;

const processRDFSClass = async (rdfsClass, schema) => {
  try {
    const { name, fullName, id, description, fields, subClassOf } = rdfsClass;

    const graphQLFields = getGraphQLProperties(fields, schema);
    // console.log('graphQLFields', graphQLFields);

    const classType = getGraphQLType(
      fullName,
      description,
      graphQLFields,
      subClassOf
    );

    const filePath = `${RDFS_CLASS_FOLDER}/${fullName}${GRAPHQL_EXTENSION}`;

    await createFile(filePath, printType(classType));
    return classType;
  } catch (error) {
    const logger = new Logger();
    logger.error(`Error in rdfsClass: ${error.message}`);
    throw error;
  }
};

export default processRDFSClass;
