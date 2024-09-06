import { GraphQLUnionType, GraphQLObjectType, printType } from 'graphql';

const createProperties = async (property, config, files) => {
  const { getOutputFilePath, mappings } = config;
  const valueTypes = property?.valuetype ?? [];

  switch (valueTypes.length) {
    case 0:
      return 'GraphQLString';
    case 1:
      const [prop] = valueTypes;
      const [, propName] = prop.split(':');
      return mappings[prop] || propName;
    default:
      const unionPath = getOutputFilePath('unionType.graphql');
      const unionProp = createUnionProperty(property);
      await files.appendToFile(unionPath, `${printType(unionProp)}\n\n\n`);
      return unionProp.name;
  }
};

const createUnionProperty = ({ uri, description, valuetype }) => {
  const name = `${uri.split(':')[1]}Union`;
  const descriptionText = description?.['en-US'] ?? null;

  const types = valuetype.map(
    type =>
      new GraphQLObjectType({
        name: type.split(':')[1],
        fields: {},
      })
  );

  return new GraphQLUnionType({
    name,
    description: descriptionText,
    types,
  });
};

export default createProperties;
