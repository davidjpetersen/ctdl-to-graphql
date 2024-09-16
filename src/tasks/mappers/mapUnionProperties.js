import { GraphQLUnionType } from 'graphql';

const mapUnionProperties = unionProperties => {
  const mappedUnions = unionProperties.map(unionProperty => {
    const newUnionPropertyType = {
      name: unionProperty.name ?? 'Undefined Prompts',
      description: unionProperty.annotation ?? '',
      types: unionProperty.options.map(option => option.split(':')[1]),
    };

    return new GraphQLUnionType(newUnionPropertyType);
  });

  return mappedUnions;
};
export default mapUnionProperties;
