const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserJSPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const rules = require('./rules');
const pkg = require('../package.json');
const generateEntry = require('./generate-entry');

const entrys = generateEntry();
function externalsDependencies() {
  const depens = Object.keys(pkg.dependencies);
  // 额外的external
  depens.push('@lxjx/fr');
  depens.push('react');
  depens.push('react-dom');
  return depens.map(key => new RegExp(`^${key}`));
}

const libKeys = Object.keys(entrys);
/* 原样移动样式文件 */
const copyList = libKeys.map(key => ({
  from: path.resolve(__dirname, '../src/components/', key, './style/'),
  to: path.resolve(__dirname, '../lib/', key + '/style/'),
}));
/* 额外复制的内容 */
copyList.push(
  {
    from: path.resolve(__dirname, '../src/components/style/'),
    to: path.resolve(__dirname, '../lib/style/'),
  },
  {
    from: path.resolve(__dirname, '../src/components/assets/'),
    to: path.resolve(__dirname, '../lib/assets/'),
  },
);

module.exports = {
  context: path.resolve(__dirname),
  mode: 'production',
  entry: entrys,
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.json'],
  },
  output: {
    filename: '[name]/index.js',
    path: path.resolve(__dirname, '../lib'),
    publicPath: './',
    library: ['Fr', '[name]'],
    libraryTarget: 'commonjs2',
    // libraryTarget: 'umd', /* TODO: 添加umd打包，除了React和ReactDom外的依赖一律不走externals，方便demo中使用 */
  },
  optimization: {
    minimize: false,
    minimizer: [new TerserJSPlugin({})],
  },
  externals: externalsDependencies(),
  module: {
    rules: [
      /* ---------style--------- */
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../../',
            },
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      ...rules,
    ],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new ProgressBarPlugin(),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
    new MiniCssExtractPlugin({
      filename: '[name]/style/index.css',
    }),
    new CopyPlugin(copyList),
  ],
};
