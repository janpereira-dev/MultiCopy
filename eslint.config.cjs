const { defineConfig, globalIgnores } = require('eslint/config');

const globals = require('globals');
const tsParser = require('@typescript-eslint/parser');
// No necesitamos registrar manualmente el plugin @typescript-eslint si ya lo aporta el preset extendido.
// Import y Prettier sí los registramos explícitamente porque añadimos reglas personalizadas.
// (Los requires de plugins se eliminan porque no los registramos manualmente en flat config)

const { fixupPluginRules, fixupConfigRules } = require('@eslint/compat');

const js = require('@eslint/js');

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {},
    },

    // No es necesario declarar plugins manualmente porque ya están incluidos vía "extends".

    extends: fixupConfigRules(
      compat.extends(
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:prettier/recommended',
      ),
    ),

    settings: {
      'import/resolver': {
        typescript: {
          project: ['tsconfig.json'],
        },
      },
      'import/core-modules': ['vscode'],
    },

    rules: {
      'prettier/prettier': 'error',
      'no-console': 'off',

      'import/order': [
        'warn',
        {
          'newlines-between': 'always',

          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'type',
          ],

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],

    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },

    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  globalIgnores([
    '**/.eslintrc.cjs',
    '**/.eslintrc.config.cjs',
    '**/eslint.config.cjs',
    '**/dist',
    '**/node_modules',
    '**/out',
    '**/coverage',
    '**/.vscode-test',
    '**/*.vsix',
    '**/CHANGELOG.md',
  ]),
]);
