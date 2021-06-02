import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import LINKS from "config/links";
import {MY_PHOTOS_IFRAME} from 'const/myPhotos';
import { userTokenSelector } from 'selectors/user';
import { useSelector } from 'react-redux';
import Spinner from 'components/Spinner';

const cutUrlByVar = ( link ) => link.substring(0, link.indexOf(':')) || link;

const NeedFooterHeaderWrapper = ( props ) => {
    const token = useSelector( userTokenSelector );
    //если токена еще нет, нет показываем лоадер, больше ничего не делаем
    if ( !token ) return <Spinner />;


    const { children, location: { pathname }, ...others } = props;

    const isMyPhotosIframe = ~pathname.indexOf( MY_PHOTOS_IFRAME );
    const isEditor = pathname === LINKS.EDITOR; //хз что
    const isPosterEditor = ~pathname.indexOf( cutUrlByVar( LINKS.POSTER_EDITOR ) ); //временный для постера/фото/холста
    const isEdit = ~pathname.indexOf( cutUrlByVar( LINKS.EDIT ) ); //универсальный редактор
    const isStartPage = pathname === '/';

    const renderHeaderAndFooter = !isMyPhotosIframe && !isEditor && !isPosterEditor && !isEdit;
    if ( !renderHeaderAndFooter ) {
        document.getElementById('spa').classList.add("noscroll");
    }

    return React.Children.map( children, child =>
        React.cloneElement( child, {
            renderHeaderAndFooter: renderHeaderAndFooter,
            isStartPage: isStartPage,
            ...others
        } )
    )
};
export default withRouter( NeedFooterHeaderWrapper );