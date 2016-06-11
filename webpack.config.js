const envfile = __dirname + '/.env.' + ( process.env.NODE_ENV === 'production' ? 'production' : 'development' );
require('dotenv').config({ path: envfile });

var webpack = require('webpack');
var CompressionPlugin = require('compression-webpack-plugin');
var path = require('path');

var config = {
  context: __dirname + '/src',
  entry: './entry.jsx',
  output: {
    path: 'public',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.s?css$/,
        loaders: ['style', 'css', 'sass'],
      },
    ]
  },
  resolve: {
    modulesDirectories: ['node_modules', 'src/js'],
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV':         JSON.stringify( process.env.NODE_ENV ),
      'process.env.GOOGLE_CLIENT_ID': JSON.stringify( process.env.GOOGLE_CLIENT_ID ),
    }),
  ],
};

if ( process.env.NODE_ENV === 'production' ) {
  config.plugins.push( new CompressionPlugin() );
}

module.exports = config;
