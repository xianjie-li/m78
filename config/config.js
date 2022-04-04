const path = require('path');

export default {
  favicon: 'https://m78.vercel.app/bitbug_favicon.ico',
  alias: {
    '@': path.resolve(__dirname, '../src'),
    m78: path.resolve(__dirname, '../src/components'),
  },
  title: 'M78',
  description: 'components, hooks, utils, part of the react toolchain',
  logo: 'https://m78.vercel.app/logo-small.png',
  locales: [['zh-CN', '中文']],
  outputPath: 'docs',
  base: '/',
  publicPath: '/',
  resolve: {
    includes: ['src', './README.md'],
    excludes: ['src/components'],
  },
  mode: 'site',
  navs: [
    null,
    {
      title: 'hooks',
      path: 'http://llixianjie.gitee.io/hooks',
    },
    {
      title: 'github',
      path: 'https://github.com/xianjie-li/m78',
    },
    {
      title: 'm78-core',
      path: 'https://github.com/m78-core',
    },
  ],
  theme: {
    '@c-primary': '#13c2c2',
  },
  exportStatic: {},
  dynamicImport: {},
};
