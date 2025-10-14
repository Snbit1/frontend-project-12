import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import functional from 'eslint-plugin-functional'
import testingLibrary from 'eslint-plugin-testing-library'
import prettier from 'eslint-plugin-prettier'
import { defineConfig } from 'eslint/config'
import babelParser from '@babel/eslint-parser'

export default defineConfig([
  {
    ignores: ['node_modules', 'dist', 'build'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      functional,
      'testing-library': testingLibrary,
      prettier,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'prettier/prettier': 'error',
      'import/extensions': 0,
      'import/no-unresolved': 0,
      'react/prop-types': 0,
      'no-console': 0,
      'react/react-in-jsx-scope': 0,
      'functional/no-conditional-statements': 0,
      'functional/no-expression-statements': 0,
      'functional/immutable-data': 0,
      'functional/functional-parameters': 0,
      'functional/no-try-statements': 0,
      'functional/no-throw-statements': 0,
      'functional/no-return-void': 0,
      'no-underscore-dangle': ['error', { allow: ['__filename', '__dirname'] }],
      'react/function-component-definition': [
        'error',
        { namedComponents: 'arrow-function' },
      ],
      'testing-library/no-debug': 0,
      'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx'] }],
    },
  },
])
