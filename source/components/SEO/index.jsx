import React, { memo } from 'react';
import { withRouter } from 'react-router-dom';
import s from './seo.scss';
import { Helmet } from 'react-helmet'

//import cyrillicToTranslit from 'cyrillic-to-translit-js';
import { latinToCyrillic } from 'libs/converters';


import Seo, { seoDefault } from 'config/SEORoutes';
import SeoText from '_SEO/seoTexts';

//console.log('seoDefault', seoDefault);

const tagOld = 'c/';
const tagNew = 'c=';
const seoStaticTag = 's=';

/**
 * преобразуем транслит к крилиллицу с разделителем точка
 * @param text
 * @returns text
 */
const translit_to_cyrillic = ( text ) => latinToCyrillic(text, "." );

String.prototype.replaceAll = function ( search, replace ) {
    return this.split( search ).join( replace );
};

//убираем двойные пробелы
const replaceDoubleSpaces = ( data ) => {
    if ( data ) return data.replace( /\s+/g, ' ' );
    return data || {}
};

const SEOBlock = props => {
    let seo = seoDefault;

    const { pathname: pathName } = props.location,
          seoStartOld = pathName.indexOf( tagOld ),
          seoStartNew = pathName.indexOf( tagNew ),
          seoStatic = pathName.indexOf( seoStaticTag );

    let title = '';
    let description = '';
    let footer = '';

    let newSEOStatic = false;

    //НОВАЯ SEO + СТАТИКА
    if ( !~seoStartOld && !~seoStartNew && ( pathName === '/' ||
                                             ~pathName.indexOf( '/sozdat-fotoknigu' ) ||
                                             ~pathName.indexOf( '/product/9/' ) ||
                                             ~pathName.indexOf( '/product/10/' ) ||
                                             ~pathName.indexOf( '/product/11/' )
                                            )
       ) {

        newSEOStatic = true;

        let seoSource = pathName.slice( seoStatic + seoStatic.length, pathName.length );

        let txtId = 'mainpage';

        if ( ~pathName.indexOf( '/product/9/' ) ) {txtId = 'calendar';} else
        if ( ~pathName.indexOf( '/product/10/' ) ) {txtId = 'calendar1';} else
        if ( ~pathName.indexOf( '/product/11/' ) ) {txtId = 'calendar2';} else
        if ( ~pathName.indexOf( '/sozdat-fotoknigu/11' ) ) {txtId = 'gallery10';} else
        if ( ~pathName.indexOf( '/sozdat-fotoknigu/10' ) ) {txtId = 'gallery9';} else
        if ( ~pathName.indexOf( '/sozdat-fotoknigu/9' ) )  {txtId = 'gallery8';} else
        if ( ~pathName.indexOf( '/sozdat-fotoknigu/8' ) )  {txtId = 'gallery7';} else
        if ( ~pathName.indexOf( '/sozdat-fotoknigu/7' ) )  {txtId = 'gallery6';} else
        if ( ~pathName.indexOf( '/sozdat-fotoknigu/5' ) )  {txtId = 'gallery5';} else
        if ( ~pathName.indexOf( '/sozdat-fotoknigu/4' ) )  {txtId = 'gallery4';} else
        if ( ~pathName.indexOf( '/sozdat-fotoknigu/3' ) )  {txtId = 'gallery3';} else
        if ( ~pathName.indexOf( '/sozdat-fotoknigu/2' ) )  {txtId = 'gallery2';} else
        if ( ~pathName.indexOf( '/sozdat-fotoknigu'   ) )  {txtId = 'gallery';}

        //let txtId = (~pathName.indexOf( '/sozdat-fotoknigu' ) ? 'gallery' : 'mainpage');
        let textMain = null;
        let wd = {};

        if ( seoSource.length ) {
            const s = seoSource.split( '=' );

            s.map( word => {
                const w = word.split( '_' );

                if ( w[ 0 ] === 'txt' ) {
                    txtId = w[ 1 ];
                    return;
                }

                if ( w[ 0 ] && w[ 1 ] ) {

                    if ( w[ 1 ] === 'z' || w[ 1 ] === 'Z' ) {
                        wd[ 'w' + w[ 0 ] ] = '';
                    } else if ( parseInt( w[ 0 ] ) === 9 ) {
                        if ( w[ 1 ] ) {
                            //const cities = w[ 1 ].split( '_' );

                            if ( w[ 1 ] ) wd[ 'w9' ]  = translit_to_cyrillic( w[ 1 ] );
                            if ( w[ 2 ] ) wd[ 'w9s' ] = translit_to_cyrillic( w[ 2 ] );
                            if ( w[ 3 ] ) wd[ 'w9i' ] = translit_to_cyrillic( w[ 3 ] );
                            if ( w[ 4 ] ) wd[ 'w9a' ] = translit_to_cyrillic( w[ 4 ] );
                        }
                    } else {
                        wd[ 'w' + w[ 0 ] ] = ' ' + translit_to_cyrillic( w[ 1 ] ) + ' ';
                        if ( w[ 2 ] ) wd[ 'w' + w[ 0 ] + 's' ] = ' ' + translit_to_cyrillic( w[ 2 ] ) + ' ';
                    }
                    //seo[ `w${w[ 0 ]}` ] = (w[ 1 ] === 'zero' ? '' : translit_to_cyrillic( w[ 1 ] ));
                    //if ( w[ 2 ] ) seo[ `w${w[ 0 ]}s` ] = (w[ 2 ] === 'zero' ? '' : translit_to_cyrillic( w[ 2 ] ));
                }

                //if ( w[ 0 ] === '9' && w[ 1 ] === 'zero' ) {
                //    seo[ 'w9i' ] = '';
                //}
            } );
        }

        textMain = SeoText[ txtId ];

        if ( textMain ) {
            const result = textMain( wd );

            title = result.title;
            description = result.description;
            footer = result.seo;
        }

    }

    //СТАРАЯ SEo
    if ( !newSEOStatic ) {

        let textId = 0;

        if ( seoStartOld > 0 ) {

            let seoSource = pathName.slice( seoStartOld + tagOld.length, pathName.length );

            if ( seoSource.length ) {
                const s = seoSource.split( '/' );
                s.map( word => {
                    const w = word.split( '_' );

                    if ( w[ 0 ] === 'txtId' ) {
                        textId = w[ 1 ];
                        return;
                    }
                    if ( w[ 0 ] && w[ 1 ] ) {
                        seo[ `w${w[ 0 ]}` ] = (w[ 1 ] === 'zero' ? '' : w[ 1 ]);
                        if ( w[ 2 ] ) seo[ `w${w[ 0 ]}s` ] = (w[ 2 ] === 'zero' ? '' : w[ 2 ]);
                    }

                    if ( w[ 0 ] === '9' && w[ 1 ] === 'zero' ) {
                        seo[ 'w9i' ] = '';
                    }
                } );
            }
        } else { //if ( seoStartNew > 0 )

            let seoSource = pathName.slice( seoStartNew + tagOld.length, pathName.length );

            if ( seoSource.length ) {
                const s = seoSource.split( '=' );
                s.map( word => {
                    const w = word.split( '_' );

                    if ( w[ 0 ] === 'textId' ) {
                        textId = w[ 1 ];
                        return;
                    }
                    if ( w[ 0 ] && w[ 1 ] ) {
                        seo[ `w${w[ 0 ]}` ] = (w[ 1 ] === 'zero' ? '' : translit_to_cyrillic( w[ 1 ] ));
                        if ( w[ 2 ] ) seo[ `w${w[ 0 ]}s` ] = (w[ 2 ] === 'zero' ? '' : translit_to_cyrillic( w[ 2 ] ));
                    }

                    if ( w[ 0 ] === '9' && w[ 1 ] === 'zero' ) {
                        seo[ 'w9i' ] = '';
                    }
                } );
            }
        }

        const seoLength = Object.keys( seo ).length;

        for ( let i = 0; i < seoLength; i++ ) {
            if ( !seo[ `w${i}` ] || seo[ `w${i}` ] === 'z' ) seo[ `w${i}` ] = '';
        }

        //console.log('props 2', replaceWords( text ));

        const d = Seo( props.location.pathname, textId );

        title = d.title;
        description = d.description;
        footer = d.footer;
    }

    const replaceWords = text => {
        if ( !newSEOStatic ) Object.keys( seo ).map( key => text = text.replaceAll( `{${key}}`, seo[ key ] || '' ) );
        return text.replaceAll( ' .', '.' ).replace( /((?:(?:^|[.?!])\s*)+)(.)/g, ( m, tail, ch ) => tail + ch.toUpperCase() );
    };

    title = replaceDoubleSpaces( replaceWords( title ) );
    description = replaceDoubleSpaces( replaceWords( description ) );
    footer = replaceDoubleSpaces( replaceWords( footer ) );

    if (process.env.server_render) {
        window.seo = {};
        window.seo.title = title;
        window.seo.description = description;
    }

    return <>
        <Helmet>
            <title>{ title }</title>
            <meta name="title" content={ title }/>
            <meta name="description" content={ description }/>
            <meta property="title" content={ title }/>
            <meta property="description" content={ description }/>
            <meta property="og:title" content={ title }/>
            <meta property="og:description" content={ description }/>
        </Helmet>
        <div className={ s.text }>{ footer }</div>
    </>
};

export default withRouter( memo( SEOBlock ) );