import React, { memo, useState, useEffect, useRef, createRef, Fragment} from 'react';
import { withRouter } from 'react-router-dom';
import { matchPath } from "react-router";
import TEXTS from './texts';
import s from './seo.scss';
import { Page, PageInner } from "components/Page";

import { scrollToTop } from 'libs/helpers';

const textObjs = Object.keys( TEXTS );

const SeoStatic = ( { location: { pathname } } ) => {

    //текущий объект с текстами
    let textObj = null;

    //найдем текст подходящий для данного URL
    for ( let i = 0; i < textObjs.length; i++ ) {

        //const path = pathname.replace(/\/[0-9]/g, '').replace(/\/\//g, '');
        const path = pathname.replace(/\/\//g, '');

        const match = matchPath( path, {
            path: textObjs[ i ],
            exact: textObjs[ i ] === '/',
            strict: false
        });


        if ( match ) {
            //let url = match.url.replace( /(?:\/+(\?))/, '$1' ).replace( /\/+$/, '' );
            textObj = TEXTS[ textObjs[ i ] ];
            break;
        }
    }

    //если для данного URL нет текстов, то ничего не рендерим
    if ( !textObj ) return null;

    return <SeoStaticContent textObj={textObj} />

};

const SeoStaticContent = memo(( { textObj } ) => {
    //массив состояния что показано, что скрыто
    const [show, setShow] = useState( textObj.texts.map( () => false ) );

    const blockArray = useRef( textObj.texts.map( () => createRef() ) );

    useEffect( () => {
        setShow( textObj.texts.map( () => false ) );
    }, [textObj] );

    const scrollToBlockByIndex = ( index = 0 ) => {
        if ( blockArray.current[ index ] && blockArray.current[ index ].current ) {
            const position = blockArray.current[ index ].current.getBoundingClientRect().top + document.querySelector( '#spa' ).scrollTop;
            scrollToTop( { scrollDuration: 0, scrollTo: position - 200 } );
        }
    };

    const setShowBlock = ind => {
        let showNew = [...show];
        if ( showNew[ ind ] ) {
            scrollToBlockByIndex( 0 );
            showNew[ ind ] = false;
        } else {
            showNew = showNew.map( () => false );
            showNew[ ind ] = true;//document.querySelector( '#spa' ).scrollTop + 1;
        }
        setShow( showNew );
    };

    useEffect( () => {
        show.map( ( item, index ) => {
            if ( item ) scrollToBlockByIndex( index );
        });
    }, show );

    return <Page>
        <PageInner>
            <div className={s.wrapper}>
                {textObj.texts.map( ( { title, text, h1 = false }, index) => {
                    const cssClass = [s.short];
                    const cssClassFooter = [s.shortFooter];
                    let  h2Class = null
                    if ( show[ index ] ) {
                        cssClass.push( s.show );
                        cssClassFooter.push( s.showFooter );
                        h2Class=s.show_h2;
                    }
                    return (<Fragment key={index}>
                        {h1 ? <h1 className={h2Class} style={{fontSize: "1.8em"}}>{title}</h1> : <h2 className={h2Class}>{title}</h2>}
                        <div className={cssClass.join(' ')} ref={blockArray.current[index]}>
                            <div dangerouslySetInnerHTML={{ __html: text }}/>
                        </div>
                        <div className={cssClassFooter.join(' ')}>
                            <span className={s.readMore} onClick={() => setShowBlock( index )}>{show[ index ] ? 'Свернуть' : 'Читать далее'}</span>
                        </div>
                    </Fragment>)
                })}
            </div>
        </PageInner>
    </Page>;
});

export default withRouter( memo( SeoStatic ) );