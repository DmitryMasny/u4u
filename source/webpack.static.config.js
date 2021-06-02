// webpack.config.js
//const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const StaticSiteGeneratorPlugin = require('./webpack/staticRender');
//const data = require('./webpack/data');
const path = require('path');
const merge = require('webpack-merge');
const pug = require('./webpack/pug');

const babel = require('./webpack/babel');
const images = require('./webpack/images');
const sass = require('./webpack/sass');
const sassOther = require('./webpack/sass_other');
const css = require('./webpack/css');
const fonts = require('./webpack/fonts');
const webpack = require('webpack');

//глобальные пути
const PATHS = {
    source: path.join(__dirname, './'), //путь исходного кода
    build:  path.join(__dirname + '/../../../front/', 'htmls')   //путь сборки проекта
};

const commonConfig = ( env ) => {

    console.log('Окружение генерации (env)', env);

    const linksList =  require(__dirname + '/_SEO/app-links/links' + env.env.num + '.js');
    //const linksList =  require(__dirname + '/_SEO/app-links/links4.js');
    console.log('Генерация страниц для', linksList.length, 'ссылок');

    return merge( [
                      {
                          entry: PATHS.source + '/components/start_server.jsx',

                          output: {
                              filename: 'statics/bundle.js',
                              path: PATHS.build,
                              libraryTarget: 'umd',
                              globalObject: `typeof self !== 'undefined' ? self : this`
                          },
                          resolve: {
                              //extensions: ['.js', '.jsx', '.es6', '.ts', '.tsx'],
                              extensions: ['.js', '.jsx', '.es6', '.ts', '.tsx'],
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
                                  other: path.resolve( __dirname, 'other' )
                              }
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
                              new StaticSiteGeneratorPlugin( {
                                                                 paths: linksList,
                                                                 crawl: false,

                                                                 globals: {
                                                                     navigator: {
                                                                         userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
                                                                     },
                                                                     document: {
                                                                         getElementsByTagName: () => [],
                                                                         createElement: () => null
                                                                     },
                                                                     window: {
                                                                         location: {
                                                                             protocol: 'https',
                                                                             hostname: 'www.u4u.ru'
                                                                         },
                                                                         seo: {}
                                                                     },
                                                                     location: {
                                                                         protocol: 'https',
                                                                         hostname: 'www.u4u.ru'
                                                                     },
                                                                     console: console
                                                                 }
                                                                 //'statics/catbundle.js'
                                                                 //, data.routes, data
                                                             } ),
                              new webpack.DefinePlugin(
                                  {
                                      'process.env.server_render': true
                                  }
                              )
                          ],
                          target: 'node'
                      },
                      pug() //подмешиваем настройки шаблонизатора
                  ] )
};


//экспорт настроек
module.exports = function ( env, arg ) {
    return merge( [
                      commonConfig( arg ),
                      babel( env ),
                      images(),
                      sass( { mini: true, serverRender: true } ),
                      sassOther( { mini: true, serverRender: true } ),
                      css( { serverRender: true } ),
                      fonts()
                  ] );
};

