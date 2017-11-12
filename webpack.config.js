const webpack = require('webpack');
const path = require('path');

let config = {
  entry: './frontend/components/index.js',
  output: {
    path: path.join(__dirname, 'frontend/public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/, // files ending with .js
      exclude: /node_modules/, // exclude the node_modules directory
      loader: "babel-loader" // use this (babel-core) loader
    }]
  },
  resolve: {
    modules: [
      path.join(__dirname, 'node_modules'),
    ],
  },
  watch: true
}

module.exports = config;
