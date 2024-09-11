import { GraphQLObjectType, printType } from 'graphql';
import { config, files } from '../utils/index.js';

import mapToGraphql from '../tasks/mapToGraphql.js';

const classProcessor = async schema => {
  const { classes, properties } = schema;
  const { getNameFromURI } = config;

  return Promise.all(
    classes.map(async classItem => {
      const { uri, label, description, comment, optional, required } =
        classItem;

      // console.log('Processing class:', getNameFromURI(uri));

      // An array of the uris of all properties for this type
      // const fields = [...optional, ...required];

      // Fields = array of uris of all properties in this type.
      // Properties = array of objects containing all properties in the schema.
      const fieldsAsTypes = await mapToGraphql(
        fields,
        properties,
        config,
        files
      );

      const annotation = [
        label?.['en-US'],
        // description?.['en-US'],
        // comment?.['en-US'],
      ]
        .filter(Boolean)
        .join(' - ');

      const graphQLType = new GraphQLObjectType({
        name: getNameFromURI(uri),
        // description: annotation,
        fields: fieldsAsTypes,
      });

      return printType(graphQLType).concat('\n\n\n');
    })
  );
};

export default classProcessor;
