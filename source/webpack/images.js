module.exports = function() {
    return {
        module: {
            rules: [
                {
                    test: /\.(png|jpg|ico|css)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            name: "spa-img/[name].[ext]",
                        }
                    }
                }
            ]
        }
    };
};
