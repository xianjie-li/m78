const path = require('path');

export default {
  history: 'hash',
  publicPath: '/doc/',
  disableCSSModules: true,
  alias: {
    '@': path.resolve(__dirname, '../src'),
    '@lxjx/fr/lib': path.resolve(__dirname, '../src/components'),
  },
  sass: {},
  doc: {
    title: 'fr',
    // mode: 'site',
    desc: '一套正在开发中的react工具包',
    // logo: '../public/logo.png',
    locales: [['zh-CN', '中文']],
    include: [],
  },
};
