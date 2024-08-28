import { GraphQLObjectType, printType } from 'graphql';
import { config, files, logger, schema } from '../../utils/index.js';
const {
  destructureProperty,
  getGraphQLProperties,
  getPropertyFromSchema,
  getPropertyType,
  getPropertyDescription,
} = schema;

const { createFile } = files;
const { types, extensions } = config;
const { RDFS_CLASS_FOLDER } = types;
const { GRAPHQL_EXTENSION } = extensions;

const rdfsClass = async (destructuredClass, schema) => {
  try {
    const { classId, className, classDescription, classFields, subClassOf } =
      destructuredClass;

    const graphqlFields = getGraphQLProperties(classFields, schema);

    const ClassType = new GraphQLObjectType({
      name: className,
      description: `${className} - ${classDescription}`,
      fields: () => graphqlFields,
      interfaces: subClassOf.map(
        subClass =>
          new GraphQLObjectType({
            name: subClass.split('_')[1],
            fields: () => ({}),
          })
      ),
    });

    const filePath = `${RDFS_CLASS_FOLDER}/${classId}${GRAPHQL_EXTENSION}`;
    await createFile(filePath, printType(ClassType));

    return ClassType;
  } catch (error) {
    logger.error(`Error in rdfsClass: ${error.message}`);
    throw error;
  }
};

export default rdfsClass;
