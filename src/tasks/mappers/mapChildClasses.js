import {
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLString,
  GraphQLUnionType,
} from 'graphql';

import { config } from '../../utils/index.js';

const { mappings } = config;
const unionTypes = new Set();

const createFieldType = (acceptedTypes, fieldName) => {
  // If there is only one accepted type, return that type.
  // Map the type to the GraphQL type if it exists in the mappings object, otherwise use GraphQLString.
  if (acceptedTypes.length === 1) {
    return { type: mappings[acceptedTypes[0]] || GraphQLString };
  }

  // If there are multiple accepted types, create a union type.
  const fieldUnionTypes = acceptedTypes.map(
    type =>
      new GraphQLObjectType({
        name: type.split(':')[1],
        fields: { value: { type: mappings[type] || GraphQLString } },
      })
  );

  // Create a union type for the field.
  const unionType = new GraphQLUnionType({
    name: `${fieldName}Union`,
    types: fieldUnionTypes,
    resolveType: value =>
      fieldUnionTypes.find(type => type.name.endsWith(value.__typename)),
  });

  // Add the union type to the set of union types.
  unionTypes.add(unionType);
  return { type: unionType };
};

const mapChildClasses = async (childClasses, allProperties) => {
  console.log('Mapping child classes');

  // Map the child classes to GraphQL object types.
  return childClasses.map(
    ({ name: className, fields: classFields, extends: classParents }) => {
      // If the class name is missing, throw an error.
      if (!className) {
        throw new Error('Class name is missing');
      }

      // Create a GraphQL field for each property in the class.
      const graphqlFields = classFields.reduce((acc, fieldId) => {
        const matchingProperty = allProperties?.find(
          property => property.id === fieldId
        );
        if (matchingProperty) {
          const { options: acceptedTypes, name: fieldName } = matchingProperty;
          acc[fieldName] = createFieldType(acceptedTypes, fieldName);
        }
        return acc;
      }, {});

      // Create a GraphQL interface for each parent class.
      const interfaces = Array.from(
        new Set(classParents.map(className => className.split(':')[1]))
      ).map(
        interfaceName =>
          new GraphQLInterfaceType({
            name: interfaceName,
          })
      );

      // console.log(interfaces);
      // Create a GraphQL union type for each field that has multiple accepted types.
      return new GraphQLObjectType({
        name: className,
        fields: graphqlFields,
        interfaces,
      });
    }
  );
};

export default mapChildClasses;
