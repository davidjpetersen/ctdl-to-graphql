import * as graphqlESLintPlugin from '@graphql-eslint/eslint-plugin';

import babelParser from '@babel/eslint-parser';
import { fileURLToPath } from 'url';
import path from 'path';

// Get the current directory path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    // Linting for GraphQL files
    files: ['**/*.graphql'],
    languageOptions: {
      parser: '@graphql-eslint/eslint-plugin', // Use the correct GraphQL parser
      parserOptions: {
        schema: path.resolve(__dirname, 'dist/schema.graphql'), // Replace with your schema path
        operations: './src/**/*.graphql', // Path to your GraphQL operations
      },
    },
    plugins: {
      '@graphql-eslint': graphqlESLintPlugin,
    },
    rules: {
      '@graphql-eslint/known-type-names': 'error',
      '@graphql-eslint/unique-operation-name': 'error',
      '@graphql-eslint/fields-on-correct-type': 'error',
      // Add more GraphQL rules as needed
    },
  },
];
