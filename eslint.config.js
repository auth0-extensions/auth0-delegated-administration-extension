const js = require('@eslint/js');
const babelParser = require('@babel/eslint-parser');
const reactPlugin = require('eslint-plugin-react');
const importPlugin = require('eslint-plugin-import');
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y');

module.exports = [
  {
    ignores: [
      'dist/**',
      'build/**',
      'coverage/**',
      '.nyc_output/**',
      'node_modules/**',
      'vendor/**',
      'assets/**'
    ]
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx'],
    plugins: {
      react: reactPlugin,
      import: importPlugin,
      'jsx-a11y': jsxA11yPlugin
    },
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        ecmaFeatures: { jsx: true },
        babelOptions: {
          configFile: './.babelrc'
        }
      },
      globals: {
        // browser
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        sessionStorage: 'readonly',
        localStorage: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        // node
        process: 'readonly',
        module: 'writable',
        require: 'readonly',
        __dirname: 'readonly',
        __non_webpack_require__: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        console: 'readonly',
        // lodash global (client)
        _: 'readonly',
        // mocha
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        after: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly'
      }
    },
    settings: {
      react: { version: 'detect' }
    },
    rules: {
      'max-len': 0,
      'react/display-name': 0,
      // Classic JSX runtime (.babelrc @babel/preset-react has no `runtime`),
      // so JSX needs React in scope and component identifiers are used via JSX.
      // These mark them as used so no-unused-vars doesn't false-positive.
      'react/jsx-uses-react': 2,
      'react/jsx-uses-vars': 2,
      'array-bracket-spacing': [2, 'always'],
      'comma-dangle': [2, 'never'],
      'eol-last': 2,
      indent: [2, 2, { SwitchCase: 1 }],
      'jsx-quotes': [2, 'prefer-double'],
      'react/prefer-stateless-function': 0,
      'new-cap': 0,
      'no-multiple-empty-lines': 2,
      'no-unused-vars': [2, { argsIgnorePattern: '^_' }],
      'no-param-reassign': 0,
      'no-var': 2,
      'object-curly-spacing': [2, 'always'],
      quotes: [2, 'single', 'avoid-escape'],
      semi: [2, 'always'],
      strict: 0,
      'space-before-blocks': [2, 'always'],
      'space-before-function-paren': [2, { anonymous: 'always', named: 'never' }]
    }
  }
];
