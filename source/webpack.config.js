const path = require( 'path' );
//const WebpackGitHash = require('webpack-git-hash');

const webpack = require( 'webpack' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const { BundleAnalyzerPlugin } = require( 'webpack-bundle-analyzer' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' );
//const CompressionPlugin = require("compression-webpack-plugin");
//const WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default;

const merge = require( 'webpack-merge' );
const pug = require( './webpack/pug' );
//const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');

const splitChunks = require( './webpack/splitChunks' );
const devServer = require( './webpack/devServer' );
const sass = require( './webpack/sass' );
const sassOther = require( './webpack/sass_other' );
const css = require( './webpack/css' );
const babel = require( './webpack/babel' );
const fonts = require( './webpack/fonts' );
const images = require( './webpack/images' );

const statics = require( './webpack/static' );

const TerserPlugin = require('terser-webpack-plugin');

//глобальные пути
const PATHS = {
    source: path.join( __dirname, './' ), //путь исходного кода
    build: path.join( __dirname + './../../', 'app' ) //путь сборки проекта
};


//общая часть конфига, для dev и prod
const commonConfig = merge( [
                                {
                                    //entry: PATHS.source + '/index.js',
                                    entry: {
                                        'index': [ PATHS.source + '/components/start.jsx' ],
                                        //'menu':  PATHS.source + '/components/MainMenu/index.js',
                                        //'blog': PATHS.source + '/pages/blog/blog.js'
                                    },
                                    output: {
                                        path: PATHS.build,
                                        publicPath: '/',
                                        filename: 'js_spa/[name]-[hash].js'
                                    },
                                    resolve: {
                                        extensions: ['.js', '.jsx', '.es6', '.ts', '.tsx'],
                                        //extensions: [ '.js', '.jsx', '.es6' ],
                                        alias: {
                                            __TS: path.resolve( __dirname, '__TS' ),
                                            _SEO: path.resolve( __dirname, '_SEO' ),
                                            _components: path.resolve( __dirname, '_components' ),
                                            components: path.resolve( __dirname, 'components' ),
                                            hoc: path.resolve( __dirname, 'components/_hoc' ),
                                            pages: path.resolve( __dirname, 'components/_pages' ),
                                            modals: path.resolve( __dirname, 'components/_modals' ),
                                            menu: path.resolve( __dirname, 'components/_menu' ),
                                            contexts: path.resolve( __dirname, 'contexts' ),
                                            config: path.resolve( __dirname, 'config' ),
                                            const: path.resolve( __dirname, 'const' ),
                                            texts: path.resolve( __dirname, 'texts' ),
                                            scss: path.resolve( __dirname, 'scss' ),
                                            libs: path.resolve( __dirname, 'libs' ),
                                            reducers: path.resolve( __dirname, 'reducers' ),
                                            middleware: path.resolve( __dirname, 'middleware' ),
                                            actions: path.resolve( __dirname, 'actions' ),
                                            selectors: path.resolve( __dirname, 'selectors' ),
                                            server: path.resolve( __dirname, 'server' ),
                                            fonts: path.resolve( __dirname, 'fonts' ),
                                            images: path.resolve( __dirname, 'images' ),
                                            adapter: path.resolve( __dirname, 'adapter' ),
                                            other: path.resolve( __dirname, 'other' ),
                                        }
                                    },
                                    watchOptions: {
                                        ignored: [
                                            '_SEO/**',
                                            'js_spa/**'
                                        ]
                                    },
                                    module: {
                                        rules: [
                                            {
                                                test: /\.(ts?|tsx?)$/,
                                                //loader: 'awesome-typescript-loader'
                                                loader: 'ts-loader'
                                            }
                                        ]
                                    },
                                    plugins: [
                                        new HtmlWebpackPlugin( {
                                                                   filename: 'index_spa.html',
                                                                   chunks: [ 'index' ],
                                                                   template: PATHS.source + '/pug/index.pug',
                                                                   "chunksSortMode": 'none'
                                                                   //title: 'ccc'
                                                               } ),
                                        new webpack.SourceMapDevToolPlugin( {} ),
                                        // new BundleAnalyzerPlugin( {
                                        //                               analyzerMode: 'static'
                                        //                           } ),
                                        new webpack.ProvidePlugin({
                                                                      Promise: 'es6-promise-promise', // works as expected
                                                                  }),
                                        new CopyWebpackPlugin( [ {
                                                from: PATHS.source + '/static',
                                                to: PATHS.build + '/spa-img'
                                            },
                                            {
                                                from: PATHS.source + '/_SEO/map',
                                                to: PATHS.build + '/'
                                            },
                                            /*{
                                                from: PATHS.source + '/_SEO/start.js',
                                                to: PATHS.build + '/js_spa/start.js'
                                            }*/
                                            {
                                                from: PATHS.source + '/static/cloudflare_purge_cache.sh',
                                                to: PATHS.build + '/../'
                                            },
                                        ] ),

                                        //new CompressionPlugin()
                                        //new WebpackDeepScopeAnalysisPlugin()

                                        /*
                                        new HtmlWebpackPlugin({
                                            filename: 'blog.html',
                                            chunks: ['blog'],
                                            template: PATHS.source + '/pages/blog/blog.pug'
                                        })*/
                                        /*new StaticSiteGeneratorPlugin({
                                          globals: {
                                            window: {},
                                            document: {}
                                          },
                                          entry: 'menu'
                                        })*/
                                    ],
                                    optimization: {
                                        minimizer: [new TerserPlugin()]
                                    },
                                },
                                splitChunks(), //оптимизатор
                                pug() //подмешиваем настройки шаблонизатора
                            ] );

//экспорт настроек
module.exports = function ( env, arg ) {

    arg.env = arg.env || {}
    console.log( 'arg', arg );
    //если продакшен
    if ( arg.mode === 'production' ) {
        return merge( [
                          statics( arg.notStaticStart, PATHS ),
                          commonConfig,
                          babel(),
                          images(),
                          sass( { mini: true } ),
                          sassOther( { mini: true } ),
                          css(),
                          fonts()
                      ] );
    }

    //если разработка
    if ( arg.mode === 'development' ) {
        return merge( [
                          statics( arg.env.notStaticStart, PATHS ),
                          commonConfig,
                          babel( env ),
                          images(),
                          devServer( PATHS.source ),
                          sass( { mini: false } ),
                          sassOther( { mini: false } ),
                          css(),
                          fonts()
                      ] );
    }
};
