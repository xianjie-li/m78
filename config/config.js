const path = require('path');

export default {
  outputPath: 'docs',
  base: '/fr/',
  publicPath: '/fr/',
  alias: {
    '@': path.resolve(__dirname, '../src'),
    '@lxjx/fr/lib': path.resolve(__dirname, '../src/components'),
  },
  mode: 'site',
  title: 'Fr',
  description: 'components, hooks, utils, part of the react toolchain',
  logo: 'https://gitee.com/llixianjie/docs/raw/master/fr/logo.png',
  locales: [['zh-CN', '中文']],
  resolve: {
    // includes: [path.resolve(__dirname, '../src/docs')],
  },
  exportStatic: {
    // dynamicRoot: true,
  },
  dynamicImport: {},
  navs: [
    null,
    {
      title: 'hooks',
      path: 'https://iixianjie.github.io/hooks/',
    },
    {
      title: 'github',
      path: 'https://github.com/Iixianjie/fr',
    },
  ],
  theme: {
    '@c-primary': '#13c2c2',
  },
};
