const generateQueryType = ast => {
  const queryType = {
    kind: 'ObjectTypeDefinition',
    name: {
      kind: 'Name',
      value: 'Query',
    },
    interfaces: [],
    directives: [],
    fields: [],
  };

  const graphqlTypes = 'Type Union';
  ast.definitions.forEach(definition => {
    if (
      definition.kind === 'ObjectTypeDefinition' &&
      definition.name.value !== 'Query' &&
      definition.name.value !== 'Mutation' &&
      graphqlTypes.includes(definition.name.value)
    ) {
      queryType.fields.push({
        kind: 'FieldDefinition',
        name: {
          kind: 'Name',
          value: definition.name.value.toLowerCase(),
        },
        arguments: [],
        type: {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: definition.name.value,
          },
        },
        directives: [],
      });
    }
  });
  return queryType;
};
