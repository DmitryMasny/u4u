module.exports = function() {
    return {
        module: {
            rules: [
                {
                    test: /\.(js|jsx|es6)$/,
                    exclude: ['/node_modules/'],
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env', '@babel/preset-react'],
                            plugins: [
                                ['@babel/plugin-proposal-object-rest-spread'],
                                ['@babel/plugin-proposal-decorators', { legacy: true }],
                                ['@babel/plugin-proposal-class-properties'],
                                ['@babel/plugin-proposal-export-default-from'],
                                [
                                    'babel-plugin-styled-components',
                                    {
                                        minify: false,
                                    },
                                ],
                            ],
                        },
                    }
                }
            ]
        }
    }
};
