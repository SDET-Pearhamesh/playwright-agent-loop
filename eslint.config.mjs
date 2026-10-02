import eslint from '@eslint/js';
import playwright from 'eslint-plugin-playwright';
import prettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

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
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/no-force-option': 'error',
      'playwright/prefer-web-first-assertions': 'error',
    },
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
