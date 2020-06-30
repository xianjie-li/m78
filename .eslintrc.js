module.exports = {
  extends: [require.resolve('@lxjx/preset-config/.eslintrc.js')],

  globals: {},

  rules: {
    'no-restricted-syntax': 'off',
    'prefer-promise-reject-errors': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
  },
};
