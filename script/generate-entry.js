const glob = require('glob');
const path = require('path');

/**
 * 获取components直接子目录下的index.(t|j)s作为入口文件
 * */
module.exports = function generateEntry() {
  // 忽略的目录
  const ignoreDir = ['style', 'assets', 'types'];

  // 基础目录
  const baseEntry = {
    // index: path.join(__dirname, '../src/components/index.ts'),
  };

  const entrys = glob.sync(
    path.join(
      __dirname,
      '../src/components/',
      `**/!(${ignoreDir.join('|')})*/index.?(ts|js)`,
    ),
  );

  entrys.forEach((v) => {
    const filePath = path.resolve(v);
    const slices = path.dirname(filePath).split(path.sep);
    const name = slices[slices.length - 1];
    baseEntry[name] = filePath;
  });

  return baseEntry;
};
