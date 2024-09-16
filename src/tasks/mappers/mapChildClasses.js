import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLUnionType,
  printType,
} from 'graphql';

import { config } from '../../utils/index.js';

const { mappings } = config;
const unionTypes = [];
const mapParentClasses = async (childClasses, allProperties) => {
  const graphqlTypeDefinitions = childClasses.map(childClass => {
    const {
      name: className,
      annotation: classDescription,
      fields: classFields,

      extends: parentClases,
    } = childClass;

    const graphqlFields = {};
    for (const fieldId of classFields) {
      const matchingProperty = allProperties
        ? allProperties.find(property => property['id'] === fieldId)
        : null;

      if (matchingProperty) {
        const acceptedTypes = matchingProperty.options;
        const fieldName = matchingProperty.name;

        if (acceptedTypes.length === 1) {
          graphqlFields[fieldName] = {
            type: mappings[acceptedTypes[0]] || 'String',
          };
        } else {
          const fieldUnionTypes = acceptedTypes.map(
            type =>
              new GraphQLObjectType({
                name: `${type.split(':')[1]}`,
                fields: {
                  value: { type: mappings[type] || GraphQLString },
                },
              })
          );

          const UnionType = new GraphQLUnionType({
            name: `${fieldName}Union`,

            types: fieldUnionTypes,
            resolveType(value) {
              return fieldUnionTypes.find(type =>
                type.name.endsWith(value.__typename)
              );
            },
          });

          graphqlFields[fieldName] = {
            type: UnionType,
          };

          if (!unionTypes.some(ut => ut.name === UnionType.name)) {
            unionTypes.push(UnionType);
          }
        }
      }
    }

    const interfaces = parentClases.map(className => {
      return className.split(':')[1];
    });

    if (!className) {
      throw new Error('Class name is missing', classDescription);
    }

    const graphqlType = new GraphQLObjectType({
      name: className,
      description: classDescription,
      fields: graphqlFields,
      interfaces: interfaces,
    });

    return graphqlType;
  });

  return graphqlTypeDefinitions;
};

export default mapParentClasses;
