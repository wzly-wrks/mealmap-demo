module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: 'airbnb-base',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // Allow console.log in development, warn in production
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    // Enforce consistent indentation
    indent: ['error', 2],

    // Enforce consistent line breaks
    'linebreak-style': ['error', 'unix'],

    // Enforce consistent quotes
    quotes: ['error', 'single'],

    // Enforce consistent semicolons
    semi: ['error', 'always'],

    // Allow function parameters to be reassigned
    'no-param-reassign': 'off',

    // Maximum line length
    'max-len': ['warn', { code: 100, ignoreComments: true, ignoreUrls: true }],

    // Enforce consistent spacing before and after commas
    'comma-spacing': ['error', { before: false, after: true }],

    // Enforce consistent spacing before function parentheses
    'space-before-function-paren': ['error', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always',
    }],

    // Enforce consistent spacing inside braces
    'object-curly-spacing': ['error', 'always'],

    // Enforce consistent spacing inside array brackets
    'array-bracket-spacing': ['error', 'never'],

    // Enforce consistent spacing inside parentheses
    'space-in-parens': ['error', 'never'],

    // Enforce consistent spacing around infix operators
    'space-infix-ops': 'error',

    // Enforce consistent spacing before blocks
    'space-before-blocks': 'error',

    // Enforce consistent spacing after keywords
    'keyword-spacing': ['error', { before: true, after: true }],

    // Enforce consistent spacing after the // or /* in a comment
    'spaced-comment': ['error', 'always'],

    // Enforce consistent brace style for all control statements
    curly: ['error', 'all'],

    // Enforce camelcase naming convention
    camelcase: ['error', { properties: 'never' }],

    // Disallow unused variables
    'no-unused-vars': ['error', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }],

    // Enforce consistent use of trailing commas in object and array literals
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    }],
  },
};
