var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: {
  	'jacks': './src/Jacks',
  	'jacks.min': './src/Jacks'
  },

  output: {
    path: './dist',
    filename: '[name].js',
    library: 'jacks',
    libraryTarget: 'umd'
  },
  
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    })
  ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        loader: 'babel-loader'
      }
    ]
  },

  resolve: {
    extensions: ['', '.js']
  }
}
