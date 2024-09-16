import * as graphqlESLintPlugin from '@graphql-eslint/eslint-plugin';

import { fileURLToPath } from 'url';
import path from 'path';
import typescriptESLintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

// Get the current directory path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptESLintPlugin,
    },
    rules: {
      ...typescriptESLintPlugin.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.graphql'],
    plugins: {
      '@graphql-eslint': graphqlESLintPlugin,
    },
    rules: {
      '@graphql-eslint/known-type-names': 'error',
      '@graphql-eslint/unique-operation-name': 'error',
      '@graphql-eslint/fields-on-correct-type': 'error',
      // Add more GraphQL rules as needed
    },
    languageOptions: {
      parserOptions: {
        schema: path.resolve(__dirname, 'path/to/your/schema.graphql'), // Update to your schema path
        operations: './src/**/*.graphql', // Glob pattern to match GraphQL operations
      },
    },
  },
];
