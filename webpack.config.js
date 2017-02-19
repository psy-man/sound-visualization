const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

const {CheckerPlugin} = require('awesome-typescript-loader');

const paths = {
  src: path.resolve(__dirname, './src'),
  dist: path.resolve(__dirname, './dist'),
  index: path.resolve(__dirname, './src/index.html')
};

module.exports = {
  context: paths.src,
  entry: './app.ts',
  output: {
    filename: '[name].bundle.js',
    path: paths.dist,
    publicPath: '/',
  },

  // Currently we need to add '.ts' to the resolve.extensions array.
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },

  // Source maps support ('inline-source-map' also works)
  devtool: 'source-map',

  // Add the loader for .ts files.
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
          tsConfigFile: './tslint.json',
        }
      }
    ],
    loaders: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ],

  },
  plugins: [
    new CheckerPlugin(),
    new WebpackNotifierPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: paths.index
    })
  ],

  devServer: {
    contentBase: paths.src
  },
};
