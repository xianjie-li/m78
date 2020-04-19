const path = require('path');

export default {
  // history: 'hash',
  // publicPath: '/doc/',
  // disableCSSModules: true,
  // sass: {},
  alias: {
    '@': path.resolve(__dirname, '../src'),
    '@lxjx/fr/lib': path.resolve(__dirname, '../src/components'),
  },
  mode: 'doc',
  title: 'fr',
  description: 'components, hooks, utils, part of the react toolchain',
  logo: '/logo.png',
  locales: [['zh-CN', '中文']],
  resolve: {
    includes: [path.resolve(__dirname, '../src/docs')],
  },
  // doc: {
  //   include: [],
  // },
};
