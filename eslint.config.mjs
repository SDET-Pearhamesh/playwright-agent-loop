import eslint from '@eslint/js';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

import framework from './eslint-rules/index.mjs';

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'allure-results/**',
      'allure-report/**',
      'blob-report/**',
      'coverage/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked.map((config) => ({
    ...config,
    files: ['**/*.ts'],
  })),
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'explicit' }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      'no-console': 'error',
      eqeqeq: 'error',
      'prefer-const': 'error',
    },
  },
  {
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Covered by framework/test-must-call-assert, which understands `page.assert.*`.
      'playwright/expect-expect': 'off',
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/no-force-option': 'error',
      'playwright/prefer-web-first-assertions': 'error',
    },
  },
  {
    files: ['tests/**/*.test.ts'],
    plugins: { framework },
    rules: {
      'framework/test-tags-required': 'error',
      'framework/test-must-call-assert': 'error',
    },
  },
  {
    files: ['tests/**/*.test.ts'],
    ignores: ['tests/setup/**'],
    plugins: { framework },
    rules: { 'framework/no-playwright-api-in-test': 'error' },
  },
  {
    files: ['src/pages/**/*.assertions.ts'],
    plugins: { framework },
    rules: { 'framework/assert-method-must-expect': 'error' },
  },
  {
    files: ['src/pages/**/*.ts'],
    ignores: ['src/pages/**/*.assertions.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "CallExpression[callee.name='expect']",
          message: 'Keep assertions in the corresponding *.assertions.ts file.',
        },
      ],
    },
  },
  prettier,
);
