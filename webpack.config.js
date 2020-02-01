const path = require('path');
/* 帮助idea进行路径识别 */

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@lxjx/flicker/lib': path.resolve(__dirname, './src/components'),
    },
  },
};
