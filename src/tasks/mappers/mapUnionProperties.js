import { GraphQLUnionType } from 'graphql';

const mapUnionProperties = unionProperties => {
  console.log('Mapping union properties');
  const mappedUnions = unionProperties.map(unionProperty => {
    const newUnionPropertyType = {
      name: `${unionProperty.name}Union`,
      // description: unionProperty.annotation ?? '',
      types: unionProperty.options.map(option => option.split(':')[1]),
    };

    return new GraphQLUnionType(newUnionPropertyType);
  });

  return mappedUnions;
};
export default mapUnionProperties;
