import {
  GraphQLUnionType,
  GraphQLObjectType,
  GraphQLString,
  printType,
} from 'graphql';

const createProperty = async (property, config, files) => {
  const { getOutputFilePath, getNameFromURI } = config;
  const { uri, description, fields, valuetype: valueTypes = [] } = property;

  const optionCount = valueTypes.length;

  if (optionCount === 0) {
    return GraphQLString;
  }

  // If there is only one value type, create an object type
  if (optionCount === 1) {
    const [prop] = valueTypes;
    const [, propName] = prop.split(':');
    // const mappedProp = mappings[prop] || propName; // Is this a primitive type or object type?

    const objToReturn = new GraphQLObjectType({
      name: getNameFromURI(uri),
      description: description?.['en-US'] ?? null,
      fields: () => ({
        ...Object.fromEntries(
          fields.map(([fieldName, { type, description }]) => [
            fieldName,
            { type, description },
          ])
        ),
      }),
    });

    return objToReturn;
  }

  // If there are multiple value types, create a union type
  const unionPath = getOutputFilePath('unionType.graphql');
  const unionProp = createUnionProperty(property);
  await files.appendToFile(unionPath, `${printType(unionProp)}\n\n\n`);
  return unionProp.name;
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

export default createProperty;
