const path = require('path');
// @lxjx/fr/lib
export default {
  alias: {
    '@': path.resolve(__dirname, '../src'),
    '@lxjx/fr': path.resolve(__dirname, '../src/components'),
  },
  title: 'Fr',
  description: 'components, hooks, utils, part of the react toolchain',
  logo: 'https://gitee.com/llixianjie/docs/raw/master/fr/logo.png',
  locales: [['zh-CN', '中文']],
  outputPath: 'docs',
  base: '/fr/',
  publicPath: '/fr/',
  resolve: {},
  mode: 'site',
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
  exportStatic: {
    // dynamicRoot: true,
  },
  dynamicImport: {},
};
