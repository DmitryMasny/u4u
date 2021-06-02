module.exports = function() {
    return {
        module: {
            rules: [
                {
                    test: /\.(eot|ttf|woff|woff2)$/,
                    use: {
                        loader: "file-loader",
                        options: {
                            name: "spa-fonts/[name].[ext]",
                        }
                    }
                }
            ]
        }
    };
};
