
const plugins = [
  ['@babel/plugin-transform-typescript', { allowNamespaces: true, importHelpers: true, declaration: true }],
  // https://github.com/babel/babel/blob/master/packages/babel-preset-stage-0/README.md
  '@babel/plugin-transform-runtime',
  '@babel/plugin-proposal-optional-chaining',
  ['@babel/plugin-proposal-class-properties', { loose: false }],
  '@babel/plugin-syntax-dynamic-import'
];

const isDev = 'development' === process.env.NODE_ENV;
isDev && plugins.push('react-hot-loader/babel');

module.exports = {
  presets:  [
    '@babel/preset-typescript',
    ['@babel/preset-env', { useBuiltIns: false }],
    '@babel/preset-react'
  ],
  plugins,
};
