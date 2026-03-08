import pluginJs from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-config-prettier';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import globals from 'globals';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  pluginJs.configs.recommended,
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: ['./tsconfig.json'] },
      globals: { ...globals.browser, ...globals.node }
    },
    plugins: {
      react: pluginReactConfig.plugins.react,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      '@typescript-eslint': tsPlugin,
      'unused-imports': unusedImportsPlugin,
      '@next/next': nextPlugin
    },
    rules: {
      '@typescript-eslint/no-redeclare': 'off',
      'no-undef': 'off',
      'no-redeclare': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      '@next/next/no-img-element': 'warn',
      'jsx-a11y/alt-text': 'warn',
      'react/jsx-key': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^',
          args: 'after-used',
          argsIgnorePattern: '^',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_'
        }
      ]
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  prettierPlugin
];
