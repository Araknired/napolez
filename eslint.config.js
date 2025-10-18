import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

/**
 * Directories and files to exclude from linting
 */
const IGNORED_PATTERNS = [
  'dist',
  'build',
  'coverage',
  'node_modules',
  '*.config.js',
  '*.config.ts',
  '.vite',
  '.turbo',
];

/**
 * File patterns for TypeScript and TypeScript React files
 */
const TYPESCRIPT_FILE_PATTERNS = ['**/*.{ts,tsx}'];

/**
 * ECMAScript version configuration
 * Using ES2022 for modern JavaScript features
 */
const ECMA_VERSION = 2022;

/**
 * Base ESLint configuration for TypeScript React projects
 * Includes recommended rules and React-specific plugins
 */
const eslintConfig = [
  // Global ignores
  {
    ignores: IGNORED_PATTERNS,
  },

  // TypeScript and React configuration
  {
    files: TYPESCRIPT_FILE_PATTERNS,
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      ecmaVersion: ECMA_VERSION,
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // React Hooks rules
      ...reactHooks.configs.recommended.rules,

      // React Refresh rules
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],

      // General code quality rules
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
];

export default eslintConfig;