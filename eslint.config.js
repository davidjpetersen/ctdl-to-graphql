import globals from 'globals';
import { processors as graphqlEslint } from '@graphql-eslint/eslint-plugin';
import pluginImport from 'eslint-plugin-import';
import pluginJs from '@eslint/js';
import pluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    languageOptions: { globals: { ...globals.browser, ...globals.es2021 } },
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      '@graphql-eslint': graphqlEslint,
      import: pluginImport,
      prettier: pluginPrettier,
    },
    rules: {
      ...graphqlEslint.recommended.rules,
      'import/order': [
        'error',
        { 'newlines-between': 'always', alphabetize: { order: 'asc' } },
      ],
      'prettier/prettier': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: ['plugin:@typescript-eslint/recommended'],
    parser: '@typescript-eslint/parser',
    plugins: {
      '@typescript-eslint': pluginTypescript,
    },
  },
];
