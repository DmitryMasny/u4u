//const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = function() {
  return {
    /*
    optimization: {
      minimizer: [
          new UglifyJsPlugin({
              extractComments: 'all'
          })
      ],
      namedModules: true,
      splitChunks: {
        chunks: 'async',
        minSize: 30000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '~',
        name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    }*/
  }
};