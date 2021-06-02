module.exports = function(args) {
    args = args || {};

    var uses = [];

    if (!args.serverRender) {
        uses.push( 'style-loader' );//добавляет стили в DOM-дерево при помощи тега ˂style˃
    }

    uses.push({
                  loader: 'css-loader', //добавляет CSS-модули в граф зависимостей
                  options: {
                      modules: true,
                      importLoaders: 1,
                      //localIdentName: "[name]_[local]_[hash:base64]",
                      //localIdentName: "[local]-[hash:base64:6]",
                      localIdentName: "[local]",
                      sourceMap: false,
                      minimize: true
                  }
              });
    uses.push('remove-comments-loader');

    return {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    include: args.path,
                    use: uses
                }
            ]
        }
    };
};
