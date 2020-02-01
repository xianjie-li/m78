module.exports = [
  /* ---------js&ts--------- */
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
      },
    },
  },
  /* ---------文件--------- */
  /* 图 */
  {
    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
    use: {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'assets/',
      },
    },
  },
  /* 影 */
  {
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
    use: {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'assets/',
      },
    },
  },
  /* 字 */
  {
    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    use: {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'assets/',
      },
    },
  },
];
