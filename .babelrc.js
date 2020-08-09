module.exports = {
  presets: ['@babel/preset-typescript', '@babel/preset-env', '@babel/preset-react'],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        // fix this: https://github.com/babel/babel/issues/10261
        // eslint-disable-next-line global-require
        version: require('@babel/runtime/package.json').version,
      },
    ],
    // https://github.com/babel/babel/blob/master/packages/babel-preset-stage-0/README.md
    '@babel/plugin-proposal-optional-chaining',
    ['@babel/plugin-proposal-class-properties', { loose: false }],
    '@babel/plugin-syntax-dynamic-import',
  ],
};
