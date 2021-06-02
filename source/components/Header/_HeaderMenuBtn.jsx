import React, {Fragment} from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import SideMenu from "components/SideMenu";
import TEXT from 'texts/main';
import LINKS from "config/links";
import { MY_PRODUCTS_NEW, MY_PRODUCTS_CART } from 'const/myProducts';
import { PROFILE_PERSONAL } from 'const/profile';
import { replaceTab } from 'libs/helpers';
import { myCartQuantitySelector } from "pages/MyProductsPage/selectors";
import { productsSelectedSelector } from "components/_pages/ProductPage/selectors";
import { userHasProfileSelector } from 'selectors/user';
import { PRODUCT_TYPE_PHOTOBOOK } from 'const/productsTypes'
import { NAV as NAV_HELP } from 'const/help'

import sendMetric from 'libs/metrics';
import {
    LINK_PHOTOBOOKS,
    LINK_THEMES,
    LINK_CALCULATOR,
    LINK_PHOTOS,
    LINK_POSTERS,
    LINK_ABOUT,
    LINK_DELIVERY,
    LINK_HELP,
    LINK_MY_PROJECTS,
    LINK_MY_PHOTOS,
    LINK_CART,
    LINK_PROFILE, LINK_CANVASES
} from 'const/metrics'

import styled from 'styled-components';
//import s from './header.scss';

const CartElement = styled('div')`
    position: relative;
    padding-right: 15px;
`;

const CartQuantityElement = styled('span')`
        position: absolute;
        top: -3px;
        right: -3px;
        height: 15px;
        width: 15px;
        border-radius: 50%;
        background-color: #f68225; //$color-warning;
        color: #fff;// $color-white;
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        line-height: 15px;
`;

const SideMenuBtnElement = styled( SideMenu )`
        display: inline-flex;
        margin: 0 18px;//$main-grid-padding*-1;
        padding: 0 18px;//($main-grid-padding - 2);
        flex-direction: row;
        align-items: center;
        justify-content: center;
        min-width: 40px;
        min-height: 40px;
        cursor: pointer;
        &:hover{
            fill: #1170be;//$color-text-primary;
        }
`;

const HeaderMenuBtn = props => {
    const cart = props.myCartQuantitySelector > 0 ?
        <CartElement>
            <span>{TEXT.CART}</span>
            <CartQuantityElement>{props.myCartQuantitySelector}</CartQuantityElement>
        </CartElement> : null;

    const linkToPhotoBook = () =>{
        const { coverType, bindingType } = props.productsSelectedSelector;
        const to = (coverType && bindingType ? [coverType, bindingType ].join( '-' ) : 'hard-glue');
        return LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', to );
    };
    const SIDE_MENU_ITEMS = [
        { name: TEXT.PHOTOBOOKS,        link: linkToPhotoBook(), metrics: ()=>sendMetric(LINK_PHOTOBOOKS) },
        // { name: TEXT.GALLERY,           link: LINKS.GALLERY, metrics: ()=>sendMetric(LINK_THEMES) },
        // { name: TEXT.PRICES,            link: LINKS.PRICES, metrics: ()=>sendMetric(LINK_CALCULATOR)},
        { name: TEXT.POSTERS,           link: LINKS.PRODUCT, metrics: ()=>sendMetric(LINK_POSTERS)},
        { name: TEXT.PHOTOS,            link: LINKS.PRODUCT, metrics: ()=>sendMetric(LINK_PHOTOS)},
        { name: TEXT.CANVASES,          link: LINKS.PRODUCT, metrics: ()=>sendMetric(LINK_CANVASES)},
        ... props.userHasProfileSelector ?
            [
                { divider: 'Это разделитель. Он ставится вместо пункта меню, разделяя остальные пункты' },
                { name: TEXT.MY_PHOTOS,         link: LINKS.MY_PHOTOS_MAIN , metrics: ()=>sendMetric(LINK_MY_PHOTOS)     },
                { name: TEXT.MY_PRODUCTS,       link: replaceTab(LINKS.MY_PRODUCTS,MY_PRODUCTS_NEW), metrics: ()=>sendMetric(LINK_MY_PROJECTS) },
                { name: cart,                   link: replaceTab(LINKS.MY_PRODUCTS,MY_PRODUCTS_CART), metrics: ()=>sendMetric(LINK_CART) },
                { name: TEXT.PROFILE,           link: replaceTab(LINKS.PROFILE,PROFILE_PERSONAL), metrics: ()=>sendMetric(LINK_PROFILE) }
            ] : [],
        { divider: 'Это разделитель. Он ставится вместо пункта меню, разделяя остальные пункты'},
        { name: TEXT.SHOP,              link: LINKS.SHOP_MAIN},
        { name: TEXT.BLOG,              link: LINKS.BLOG.replace(':post','')},
        { name: TEXT.SALES,             link: LINKS.SALES.replace(':post','')},
        { divider: 'Это разделитель. Он ставится вместо пункта меню, разделяя остальные пункты'},
        { name: TEXT.ABOUT_COMPANY,     link: LINKS.INFO_ABOUT_COMPANY, metrics: ()=>sendMetric(LINK_ABOUT)},
        { name: TEXT.DELIVERY,          link: LINKS.INFO_DELIVERY, metrics: ()=>sendMetric(LINK_DELIVERY)},
        { name: TEXT.HELP,              link: replaceTab(LINKS.HELP,NAV_HELP.START), metrics: ()=>sendMetric(LINK_HELP)},

    ];

    return <SideMenuBtnElement menu={SIDE_MENU_ITEMS}/>;
};

export default withRouter( connect(
    state => ({
        productsSelectedSelector: productsSelectedSelector( state, PRODUCT_TYPE_PHOTOBOOK ),
        myCartQuantitySelector: myCartQuantitySelector( state ),
        userHasProfileSelector: userHasProfileSelector( state ),
    }),
    dispatch => ({
    })
)( HeaderMenuBtn ) );