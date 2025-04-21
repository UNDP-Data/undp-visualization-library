// eslint-disable-next-line import/no-extraneous-dependencies
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      react: pluginReact,
      'react-hooks': reactHooksPlugin,
      'import': importPlugin,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      'react/self-closing-comp': ['error', { component: true, html: true }],
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'warn',
      'react/jsx-no-undef': 'error',
      'react/prop-types': 'off',
      'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'prefer-const': 'error',
      'comma-dangle': ['error', 'always-multiline'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'object-curly-newline': ['error', { 
        ObjectExpression: { multiline: true, minProperties: 4 },
        ObjectPattern: { multiline: true, minProperties: 4 },
      }],
      'object-curly-spacing': ['warn', 'always'],
      'semi': ['error', 'always'],
      'linebreak-style': 0,
      'react/require-default-props': 0,
      'react/jsx-filename-extension': 0,
      'max-len': 0,
      'import/extensions': 0,
      'import/prefer-default-export': 0,
      'no-nested-ternary': 0,
      'react/no-array-index-key': 0,  
      'jsx-quotes': ['error', 'prefer-single'],
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
      'react/jsx-props-no-spreading': 0,
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
      'import/no-unresolved': 0,
      'import/no-extraneous-dependencies': ['warn', { devDependencies: true }],
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      indent: [
        'warn', 
        2, 
        { 
          SwitchCase: 1,
          ignoredNodes: ['JSXElement', 'JSXElement > *', 'JSXAttribute', 'JSXIdentifier', 'JSXNamespacedName', 'JSXMemberExpression', 'JSXSpreadAttribute', 'JSXExpressionContainer', 'JSXOpeningElement', 'JSXClosingElement', 'JSXFragment', 'JSXOpeningFragment', 'JSXClosingFragment', 'JSXText', 'JSXEmptyExpression', 'JSXSpreadChild'],
        },
      ],
      'react/jsx-indent': ['warn', 2],
      'react/jsx-indent-props': ['warn', 2],
      'react/jsx-closing-bracket-location': ['warn', 'tag-aligned'],
      'react/jsx-first-prop-new-line': ['warn', 'multiline'],
      'react/jsx-max-props-per-line': ['warn', { maximum: 1, when: 'multiline' }],
    },
  },
  // Add TypeScript support
  ...tseslint.configs.recommended,
]);