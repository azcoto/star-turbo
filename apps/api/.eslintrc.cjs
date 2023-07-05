module.exports = {
  root: true,
  extends: ['custom'],
  // _ prefix allow unused variables
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
