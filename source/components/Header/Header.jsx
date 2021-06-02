import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from "react-redux";
import { createPortal } from "react-dom";
import styled, { css } from 'styled-components';

import LINKS from "config/links";
import { NavLink } from 'react-router-dom'

import Logo from 'components/Logo';
import MenuMainView from 'menu/MenuMain';
import MenuAdminView from 'menu/MenuAdmin';
import MenuTop from 'menu/MenuTop';
import AuthMenu from 'components/AuthMenu';
import MainSideMenu from '__TS/components/_misc/MainSideMenu';
import OldBrowserPanel from './_OldBrowserPanel';
//import s from './header.scss';
import { windowIsMobileSelector, windowWidthSelector } from "components/_editor/_selectors";
import { userRoleIsAdmin } from "selectors/user";
import { useScroll } from "components/_hooks/useScroll";
import { COLORS } from "../../const/styles";

const HeaderElement = styled('div')`
    width: 100%;
    background-color: #fff; //$color-white;
    box-shadow: 0 1px 1px rgba(#3d4c62, .2); //$color-charcoal
    z-index: 50;
`;


const HeaderTopElement = styled('div')`
    width: ${( { width } ) => width ? `${width}px` : '100%'};       
    
    height: 60px; //$header-top-height
    @media (max-width: 767px) { //Планшеты sm
        height: 50px; //$header-top-height-sm
    }
        
    display: flex;
    
    ${( { isFixed } ) => isFixed && css`
        position: fixed;
        top: 0;
        background-color: #fff; //$color-white
    `};
     
    ${( { isScrolled } ) => isScrolled && css`
        box-shadow: 0 1px 1px rgba(#3d4c62, .2); //$color-charcoal
    `};       
`;

const HeaderBottomElement = styled('div')`
        width: 100%;
        height: 40px; //$header-bottom-height;
        display: flex;
`;

const HeaderInnerElement = styled('div')`
        position: relative;
        max-width: ${1240 + 20 * 2}px;  // $media-lg + $main-grid-padding * 2
        padding: 0 20px; //$main-grid-padding
        height: auto;
        width: 100%;
        margin: 0 auto;
        
        display: flex;
        justify-content: space-between;
        
        .sideMenuBtn {
            display: inline-flex;
            margin: 0 -10px;
            padding: 0 8px;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            min-width: 40px;
            min-height: 40px;
            cursor: pointer;
            &:hover{
                fill: ${COLORS.TEXT_PRIMARY};
            }
        }
        .headerTopRightMenu {
            display: flex;
            align-items: center;
            line-height: 0.9em;
        }
`;

const NavLinkElement = styled( NavLink )`
    display: flex;
    width: 100px;
    
    @media (max-width: 767px) { //Планшеты sm
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 40px;
        margin: 5px auto 0; //$header-top-height-sm
    }
`;


const HeaderTop = ( { isMobile, isFixed, isScrolled, width } ) => {
    return <HeaderTopElement isFixed={isFixed} isScrolled={isScrolled} width={width}>
                <HeaderInnerElement>
                    {isMobile && <MainSideMenu className={'sideMenuBtn'}/> }

                    <NavLinkElement to={LINKS.INDEX}><Logo/></NavLinkElement>
                    <div className="headerTopRightMenu">
                        {!isMobile && <MenuTop/>}
                        {!process.env.server_render ? <AuthMenu isMobile={isMobile}/> : null}
                    </div>

                </HeaderInnerElement>
            </HeaderTopElement>
}

const HeaderBottom = ( { isMobile, isAdmin } ) => !isMobile ?
            <HeaderBottomElement>
                <HeaderInnerElement>
                    {isAdmin ? <MenuAdminView/> : <MenuMainView />}
                </HeaderInnerElement>
            </HeaderBottomElement>
            : null;

//флаг для серверного рендера, что уже компонент отрендерен
let isOnceRendered = false;

const Header = ( props ) => {
    //если не нужно рендерить, возвращаем только проверку на устаревание браузера
    if ( !process.env.server_render && !props.renderHeaderAndFooter ) {
        return <OldBrowserPanel />
    }

    const [headerWidth, setHeaderWidth] = useState( 0 );

    const isMobile = useSelector( state => windowIsMobileSelector( state ) );
    const isAdmin = useSelector( state => userRoleIsAdmin( state ) );
    const windowWidth = useSelector( state => windowWidthSelector( state ) );
    const windowScroll = useScroll();

    const headerRef = useRef( null );
    const spaTopDOM = !process.env.server_render && props.isStartPage && props.spaTopRef && props.spaTopRef.current;

    useEffect( () => {
        //если серверный рендер, выходим
        if ( process.env.server_render ) return;

        if ( headerRef && headerRef.current ) setHeaderWidth( headerRef.current.offsetWidth );
    }, [windowWidth] );


    const result = useMemo( () => {
                return <HeaderElement ref={headerRef}>
                            <OldBrowserPanel/>
                            {spaTopDOM ? <HeaderTopElement/> : <HeaderTop isMobile={isMobile}/>}
                            {spaTopDOM && createPortal( <HeaderTop isMobile={isMobile} isFixed={true}
                                                                   isScrolled={windowScroll > (isMobile ? 0 : 39)}
                                                                   width={headerWidth}/>, spaTopDOM )}
                            <HeaderBottom isMobile={isMobile} isAdmin={isAdmin}/>
                        </HeaderElement>
            },
    [isMobile, isAdmin, windowScroll, headerWidth] );

    //если это серверный рендер и уже отрендерели меню, второй раз не нужно

    if ( process.env.server_render && isOnceRendered ) {
        //return null;
    }

    isOnceRendered = true;

    return <>{result}</>;
}

export default memo( Header );
