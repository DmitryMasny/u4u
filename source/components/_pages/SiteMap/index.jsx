import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Cities from 'texts/cities';

import { ROUTE_COMPONENTS_LINKS, LINKS, BREAD_CRUMBS_LINKS  } from 'config/routesServer';

const CoversMap = {
    'hard-cover':  'Книжный переплет с твёдой обложкой',
    'hard-soft':   'Книжный переплет с мягкой обложкой',
    'hard-spring': 'Твердая обложка на пружине',
    'soft-spring': 'Мягкая обложка на пружине',
    'soft-clip':   'Мягкая обложка на скрепке',
};

let count = 0;

const SiteMap = props => {
    //console.error('=================SiteMap', ++count);

    let links = [],
        keyOfLinks    = Object.keys( BREAD_CRUMBS_LINKS ),
        citiesUrlKeys = Object.keys( Cities ),
        coversMapKeys = Object.keys( CoversMap );

    for ( let i = 0; i < keyOfLinks.length; i++ ) {
        const linkObj = BREAD_CRUMBS_LINKS[ keyOfLinks[ i ] ];

        if ( ~linkObj.path.indexOf( ':city' ) ) {

            //если есть типы обложек и переплета
            if ( ~linkObj.path.indexOf( ':coverType-:bindingType' ) ) {

                for ( let k = 0; k < coversMapKeys.length; k++ ) {

                    for ( let c = 0; c < citiesUrlKeys.length; c++ ) {
                        pushLink( linkObj.path.replace( ':city', citiesUrlKeys[ c ] ).replace( ':coverType-:bindingType', coversMapKeys[k] ), linkObj.breadcrumb + ' ' + CoversMap[coversMapKeys[k]]  + ' ' + Cities[ citiesUrlKeys[ c ] ][ 1 ] );
                    }

                }

            } else {
                for ( let c = 0; c < citiesUrlKeys.length; c++ ) {
                    pushLink( linkObj.path.replace( ':city', citiesUrlKeys[ c ] ), linkObj.breadcrumb + ' ' + Cities[ citiesUrlKeys[ c ] ][ 1 ] );
                }
            }
        } else {
            pushLink( linkObj.path, linkObj.breadcrumb );
        }
    }

    function pushLink( link, name ) {
        links.push(<div key={`wrap${link}`}><NavLink to={link} key={link}>{name}</NavLink></div>);
    }

    return <div>{links}</div>;
};

export default SiteMap;