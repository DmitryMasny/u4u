import React from 'react';
import ReactDOMServer, { renderToString } from 'react-dom/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

import 'normalize.css';

import App from 'components/App/server';

export default function render( locals, callback ) {

    //console.log( 'locals', locals.path );
    //console.log( 'callback', callback );

    let html = '',
        styleTags = '';
    const sheet = new ServerStyleSheet()
    //const html = ReactDOMServer.renderToStaticMarkup( React.createElement( App, locals ) );

    try {
        html = renderToString(
            <StyleSheetManager sheet={sheet.instance}>
                <App {...locals} />
            </StyleSheetManager>
        );
        styleTags = sheet.getStyleTags();
    } catch ( e ) {
        console.error(error);
    } finally {
        sheet.seal();

        //console.log( 'html', html );
        //console.log( 'styleTags', styleTags );

        window.seo.title = window.seo.title || 'U4U - фотоальбомы Москве. Фотоальбомы года за 4 клика. Красивый фотоальбом на U4U.Ru. Фотоальбом онлайн заказывайте у нас. Фотоальбом с фото очень легко. Фотоальбом - печать на U4U. Красивый сделать просто у нас. Фотоальбом дизайн на нашем онлайн сервисе.';
        window.seo.description = window.seo.description || 'Фотоальбомы. Красивый фотоальбом – это U4U. Фотоальбомы – печать в Москве. Красивый фотоальбом онлайн c U4U – отличный выбор. Красивый фотоальбом сделать легко. Фотоальбом года у нас - безупречный результат. Фотоальбомы онлайн от U4U.Ru - печать высокого уровня. Красивый фотоальбом с фото – гарантия качества и сроков. Фотоальбом дизайн на U4U.Ru фотоальбом онлайн сделать очень легко. Фотоальбом сделать - большой выбор на нашем сайте. Красивый фотоальбом года - легко сделать и наслаждаться фотографиями. Фотоальбом с фото – всегда с U4U.Ru. Фотоальбомы - доставка по России и Москве. Онлайн. Фотоальбом с фото сделать - ваша история на U4U.Ru.';

        callback( null, `<!DOCTYPE html>
        <html>       
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width, height=device-height, maximum-scale=1.0, user-scalable=0" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width, height=device-height, maximum-scale=1.0, user-scalable=no" />
                <meta name="yandex-verification" content="079167e62ae2d701" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <link rel="icon" href="/images/fav/favicon.ico" type="image/x-icon" />
                <link rel="icon" href="/images/fav/favicon-16x16.png" sizes="16x16" type="image/png" />
                <link rel="icon" href="/images/fav/favicon-32x32.png" sizes="32x32" type="image/png" />
                <link rel="icon" href="/images/fav/favicon-96x96.png" sizes="96x96" type="image/png" />
                <title></title>
                <meta name="title" content="${window.seo.title}"/>
                <meta name="description" content="${window.seo.description}"/>
                <meta property="og:title" content="${window.seo.title}"/>
                <meta property="og:description" content="${window.seo.description}"/>
                <meta property="title" content="${window.seo.title}"/>
                <meta property="description" content="${window.seo.description}"/>
                <link rel="stylesheet" href="/spa-img/server.css">
                ${styleTags}
            </head>
            
            <body>
                <div id="spa" style="overflow-y: hidden;">
                    ${html}
                </div>
            </body>
        
        </html>
    `)
    }
}
