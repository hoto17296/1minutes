require('dotenv').config({ silent: true });

var webpack = require('webpack');
var CompressionPlugin = require('compression-webpack-plugin');

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
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        GOOGLE_CLIENT_ID: JSON.stringify( process.env.GOOGLE_CLIENT_ID ),
      },
    }),
  ],
};

if ( process.env.NODE_ENV === 'production' ) {
  config.plugins.push( new CompressionPlugin() );
}

module.exports = config;
