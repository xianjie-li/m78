const path = require('path');

export default {
  alias: {
    '@': path.resolve(__dirname, '../src'),
    m78: path.resolve(__dirname, '../src/components'),
  },
  title: 'M78',
  description: 'components, hooks, utils, part of the react toolchain',
  logo: 'https://gitee.com/llixianjie/docs/raw/master/fr/logo.png',
  locales: [['zh-CN', '中文']],
  outputPath: 'docs',
  base: '/M78/',
  publicPath: '/M78/',
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
      path: 'https://github.com/Iixianjie/m78',
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
