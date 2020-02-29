const path = require('path');
const webpack = require('webpack');

module.exports = {
  name: 'lotto-machine-dev',
  mode: 'development',
  devtool: 'eval',
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  entry: {
    app: ['./src/client'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)?$/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'src'),
        exclude: /(node_modules)|(dist)/,
        options: {
          presets: [
            ['@babel/preset-env', {targets: {browsers: ['> 1% in KR']}, debug: true}],
            '@babel/preset-react',
          ],
          plugins: ['@babel/plugin-proposal-class-properties', 'react-hot-loader/babel'],
        },
      },
    ],
  },
  plugins: [new webpack.LoaderOptionsPlugin({debug: true})],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.js',
    publicPath: '/dist/',
  },
};
