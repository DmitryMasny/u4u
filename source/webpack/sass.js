//const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = function(args) {
    args = args || {};

    var uses = [];

    if (!args.serverRender) {
        uses.push({
                      loader: 'style-loader', //добавляет стили в DOM-дерево при помощи тега ˂style˃
                      options: {
                          singleton: true
                      }
                  });
    }

    uses.push({
                  loader: 'css-loader', //добавляет CSS-модули в граф зависимостей
                  options: {
                      modules: true,
                      importLoaders: 1,
                      //localIdentName: "[name]_[local]_[hash:base64]",
                      //localIdentName: "[local]-[hash:base64:6]",
                      localIdentName: (args.mini ? "[hash:base64:4]" : "[local]____[hash:base64:2]"),
                      sourceMap: false,
                      minimize: true,
                      camelCase: true
                  }
              });
    uses.push('remove-comments-loader');
    uses.push('sass-loader'); //компилирует SCSS в CSS;

    return {
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    include: undefined,
                    exclude: /(source\/other|node_modules|source\/components\/PreviewAlbum)/,
                    use: uses
                }
            ]
        }
    };
};
