import { GraphQLObjectType, GraphQLString, GraphQLUnionType } from 'graphql';

import { config } from '../../utils/index.js';

const { mappings } = config;

const createFieldType = (acceptedTypes, fieldName) => {
  if (acceptedTypes.length === 1) {
    return { type: mappings[acceptedTypes[0]] || GraphQLString };
  }

  const fieldUnionTypes = acceptedTypes.map(
    type =>
      new GraphQLObjectType({
        name: type.split(':')[1],
        fields: { value: { type: mappings[type] || GraphQLString } },
      })
  );

  return {
    type: new GraphQLUnionType({
      name: `${fieldName}Union`,
      types: fieldUnionTypes,
      resolveType: value =>
        fieldUnionTypes.find(type => type.name.endsWith(value.__typename)),
    }),
  };
};

const mapParentClasses = async (parentClasses, allProperties) => {
  console.log('Mapping parent classes');
  return parentClasses.map(
    ({
      name: className,
      annotation: classDescription,
      fields: classFields,
    }) => {
      if (!className) {
        throw new Error('Class name is missing', classDescription);
      }

      const graphqlFields = classFields.reduce((fields, fieldId) => {
        const matchingProperty = allProperties.find(
          property => property.id === fieldId
        );
        if (matchingProperty) {
          const { options: acceptedTypes, name: fieldName } = matchingProperty;
          fields[fieldName] = createFieldType(acceptedTypes, fieldName);
        }
        return fields;
      }, {});

      return new GraphQLObjectType({
        name: className,
        // description: classDescription,

        fields: graphqlFields,
      });
    }
  );
};

export default mapParentClasses;
