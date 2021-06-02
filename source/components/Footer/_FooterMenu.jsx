//import s from './footer.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';


/** styled **/
const LinkComponent = styled( Link )`
    display: flex;
    align-items: center;
    font-size: 14px; //$footer-font-size;
    line-height: 1em;
    color: #889db5;//$footer-color;
    padding: 5px 0 5px 10px; //$footer-padding/2 0 $footer-padding/2  $footer-padding;
    text-decoration: none;
    
    ${( { bigthis } ) => bigthis && css`
        padding: 5px 0;
        font-size: 18px;
        font-weight: 600;
        text-transform: uppercase;
        line-height: 1em;
        border-left: none;
        margin-top: 5px;
    `}
    
    ${( { biglinkthis } ) => biglinkthis && css`
        font-weight: 400;
        color: #bed0dd;//$footerLinkColor;
        //text-transform: none;
        //margin-top: 5px;
        &:hover {
            color: #137ed5;//$footer-color-hover;
        }
    `}
`;

// Пункт меню футера
const FooterMenuItem = ( { action, link, name, isSub, href } ) => {
    const bigLink = !!link || !!href || !!action || false;

    if ( link ) {
        return <LinkComponent to={link.path || '/'} bigthis={isSub ? 0 : 1} biglinkthis={bigLink ? 1 : 0}>{name}</LinkComponent>;
    }
    if ( href ) {
        return <LinkComponent to={href || '/'} as="a" href={href} bigthis={isSub ? 0 : 1} biglinkthis={bigLink ? 1 : 0}>{name}</LinkComponent>;
    }
    if ( action ) {
        return <LinkComponent to={'/'} as="div" bigthis={isSub ? 0 : 1} biglinkthis={bigLink ? 1 : 0} onClick={() => action()}>{name}</LinkComponent>;
    }
    return <LinkComponent to={'/'} as="div" bigthis={isSub ? 0 : 1} biglinkthis={bigLink ? 1 : 0}>{name}</LinkComponent>;
};

// Раздел меню футера
const FooterMenu = ( item ) => {
    const sub = item.sublinks && item.sublinks.map(( subItem, key ) => <FooterMenuItem key={key} isSub={true}  {...subItem}  />) || null;
    const comp = item.component ? item.component : null;

    return (<React.Fragment>
                <FooterMenuItem {...item} />
                {comp}
                {sub}
            </React.Fragment>);
};

export default FooterMenu;
