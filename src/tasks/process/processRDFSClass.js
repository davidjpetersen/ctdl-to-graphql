import { config, files, logger, schema } from '../../utils/index.js';

import Logger from '../../utils/logger.js';
import { printType } from 'graphql';

const { getGraphQLProperties, getGraphQLType } = schema;

const { createFile } = files;
const { types, extensions } = config;
const { RDFS_CLASS_FOLDER } = types;
const { GRAPHQL_EXTENSION } = extensions;

const processRDFSClass = async (rdfsClass, schema) => {
  try {
    console.log(rdfsClass);

    const { classId, className, classDescription, classFields, subClassOf } =
      rdfsClass;
    const graphQLFields = getGraphQLProperties(classFields, schema);
    const classType = getGraphQLType(
      className,
      classDescription,
      graphQLFields,
      subClassOf
    );

    const filePath = `${RDFS_CLASS_FOLDER}/${classId}${GRAPHQL_EXTENSION}`;

    await createFile(filePath, printType(classType));
    return classType;
  } catch (error) {
    const logger = new Logger();
    logger.error(`Error in rdfsClass: ${error.message}`);
    throw error;
  }
};

export default processRDFSClass;
