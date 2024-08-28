import { GraphQLObjectType, printType } from 'graphql';
import { config, files, logger } from '../../utils/index.js';

const { createFile } = files;
const { types, extensions, mappings } = config;
const { RDFS_CLASS_FOLDER } = types;
const { GRAPHQL_EXTENSION } = extensions;

const rdfsClass = async (
  item,
  schema,
  {
    destructureClass,
    getProperty,
    getPropertyType,
    getPropertyDescription,
    classFolder = RDFS_CLASS_FOLDER,
    graphqlExtension = GRAPHQL_EXTENSION,
  }
) => {
  try {
    const { classId, className, classDescription, classFields, subClassOf } =
      destructureClass(item);

    const graphqlFields = Object.entries(classFields).reduce(
      (fields, [, propertyId]) => {
        const property = getProperty(propertyId, schema);

        const { propertyName, acceptedValues } = destructureProperty(property);
        logger.debug('property', property);
        logger.debug('propertyName', propertyName);

        fields[propertyName] = {
          type: getPropertyType(propertyName, acceptedValues),
          description: getPropertyDescription(property),
        };

        return fields;
      },
      {}
    );

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

    await createFile(
      `${classFolder}/${classId}${graphqlExtension}`,
      printType(ClassType)
    );

    return ClassType;
  } catch (error) {
    logger.error(`Error in rdfsClass: ${error.message}`);
    throw error;
  }
};

export default rdfsClass;
