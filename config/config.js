const path = require('path');

export default {
  history: 'hash',
  publicPath: '/doc/',
  disableCSSModules: true,
  alias: {
    '@': path.resolve(__dirname, '../src'),
    '@lxjx/flicker/lib': path.resolve(__dirname, '../src/components'),
  },
  sass: {},
  doc: {
    title: 'flicker',
    desc: '完全使用hooks编写的轻量组件库',
    // logo: '../public/logo.png',
    locales: [['zh-CN', '中文']],
    include: [],
  },
};
