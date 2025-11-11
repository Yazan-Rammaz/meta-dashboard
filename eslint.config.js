import pluginJs from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import prettierPlugin from 'eslint-config-prettier';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      parserOptions: { project: ['./tsconfig.json'] },
      globals: globals.browser
    },
    plugins: {
      react: pluginReactConfig.plugins.react,
      '@typescript-eslint': tseslint.plugin,
      'unused-imports': unusedImportsPlugin,
      '@next/next': nextPlugin
    },
    rules: {
      '@typescript-eslint/no-redeclare': 'off',
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
          argsIgnorePattern: '^'
        }
      ]
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  prettierPlugin,
  nextPlugin.configs.recommended,
  nextPlugin.configs['core-web-vitals']
];
