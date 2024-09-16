// Lookup the possible values of a CTDL or CTDL-ASN field.
const getPropertyFromSchema = (propertyID, schema) => {
  return schema.find(item => item.id === propertyID);
};
const lookupFieldType = (propertyName, acceptedValues) => {
  if (!acceptedValues || acceptedValues.length === 0) {
    return String;
  }

  if (acceptedValues.length === 1) {
    return mappings[acceptedValues[0]] || acceptedValues[0].replace(':', '_');
  }

  return new GraphQLUnionType({
    name: `${propertyName}Union`,
    types: acceptedValues.map(
      typeName =>
        new GraphQLObjectType({
          name: typeName.replace(':', '_'),
          fields: {},
        })
    ),
    resolveType: () => null,
  });
};
