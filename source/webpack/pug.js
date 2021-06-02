module.exports = function() {
  return {
    module: {
      rules: [
          {
              test: /\.pug$/,
              loader: 'pug-loader',
              options: {
                  pretty: false //если false html сливается в одну строку
              }
          }
      ]
    }
  }
};
