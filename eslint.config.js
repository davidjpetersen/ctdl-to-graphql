import globals from 'globals';
import { processors as graphqlEslint } from '@graphql-eslint/eslint-plugin';
import pluginJs from '@eslint/js';

export default [
  {
    languageOptions: { globals: globals.browser },
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      '@graphql-eslint': graphqlEslint,
    },
    rules: {
      ...graphqlEslint.recommended.rules, // Apply the recommended rules for GraphQL
    },
  },
];
