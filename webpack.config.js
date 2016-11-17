'use strict';
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    authorizer: './lambda_functions/authorizer/authorizer.js'
  },
  target: 'node',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: __dirname,
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-0']
        }
      }
    ]
  },
  babel: {
    presets: ["es2015"],
    env: {
      test: {
        plugins: ["istanbul"]
      }
    }
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  },
  resolve: {
    root: path.resolve(__dirname),
    alias: {
      lib: 'lib'
    },
    extensions: ['', '.js', '.jsx']
  },
  externals: [nodeExternals()]
};