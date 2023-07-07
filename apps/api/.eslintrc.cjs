module.exports = {
  root: true,
  extends: ['custom'],
  // _ prefix allow unused variables
  plugin: ['plugin:import/recommended'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  },
  settings: {
    'import/resolver': {
      typescript: {},
      alias: {
        map: [['@', './src']],
      },
    },
  },
};
