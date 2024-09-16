import { GraphQLObjectType, GraphQLString } from 'graphql';

import { config } from '../../utils/index.js';

const { getNameFromURI, mappings } = config;

const mapObjectProperties = async objectProperties => {
  return objectProperties.map(property => {
    const {
      type,
      id,
      name,
      annotation,
      extends: extendedProperties,
      options,
      usedBy,
      targetScheme,
    } = property;

    const fields = {
      type: { type: GraphQLString },
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      annotation: { type: GraphQLString },
      extends: { type: GraphQLString },
      options: { type: GraphQLString },
      usedBy: {
        type: new GraphQLObjectType({
          name: 'UsedBy',
          fields: {
            classes: {
              type: GraphQLString,
              resolve: () => usedBy.join(', '),
            },
          },
        }),
      },
      targetScheme: { type: GraphQLString },
    };

    return new GraphQLObjectType({
      name: getNameFromURI(id),
      fields,
    });
  });
};

export default mapObjectProperties;
