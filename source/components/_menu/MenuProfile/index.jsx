import s from './menuProfile.scss';
import React, {memo} from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import Tooltip from 'components/_forms/Tooltip';

import TEXT from 'texts/main';
import LINKS from "config/links";
import { MY_PRODUCTS_NEW, MY_PRODUCTS_CART } from 'const/myProducts';
import { MY_PHOTOS_ALL } from 'const/myPhotos';
import { PROFILE_PERSONAL } from 'const/profile';
import { replaceTab } from 'libs/helpers';
import Avatar from 'components/Avatar'
import {IconCart} from 'components/Icons'
import sendMetric from 'libs/metrics';
import {
    LINK_MY_PROJECTS,
    LINK_CART,
    LINK_PROFILE,
    LINK_MY_PHOTOS
} from 'const/metrics'

const Cart = memo(({isFooter, cartQ}) => {
    return isFooter ?
        TEXT.CART :
        <Tooltip tooltip={`${TEXT.CART_COUNT}: ${cartQ}`}>
            <div className={s.cart}>
                <IconCart/>
                <span className={s.cartQuantity}>{cartQ}</span>
            </div>
        </Tooltip>;
});

const MENU_PROFILE_MOB = [
    {id: MY_PRODUCTS_NEW,       title: TEXT.MY_PRODUCTS,  link: replaceTab(LINKS.MY_PRODUCTS,MY_PRODUCTS_NEW),  metrics:()=>sendMetric(LINK_MY_PROJECTS) },
    {id: MY_PHOTOS_ALL,         title: TEXT.MY_PHOTOS,  link: replaceTab(LINKS.MY_PHOTOS,MY_PHOTOS_ALL),        metrics:()=>sendMetric(LINK_MY_PHOTOS) },
    {id: PROFILE_PERSONAL,      title: TEXT.PROFILE,    link: replaceTab(LINKS.PROFILE,PROFILE_PERSONAL),       metrics:()=>sendMetric(LINK_PROFILE)},
    {id: MY_PRODUCTS_CART,      title: TEXT.CART,       link: replaceTab(LINKS.MY_PRODUCTS,MY_PRODUCTS_CART),   metrics:()=>sendMetric(LINK_CART) }
];

const MenuProfileView = memo(props => {
    const { userPersonalInfoSelector:{ login, avatar, gender }, isFooter, isMobile, myCartQuantitySelector: cartQ, role } = props;
    const menuClass = isFooter ? s.footerMenu : `${s.headerMenu} ${s.profileMenu}`;
    const isAdmin = role === 'admin';


    const profileMobMenu =
        <div className={s.menuProfileMob}>
            { MENU_PROFILE_MOB.map((item, i) =>
                <NavLink className={s.menuProfileMobItem}
                         activeClassName={s.active}
                         to={item.link}
                         onClick={item.action}
                         key={item.className || 'key' + i}>{item.title}</NavLink>)
            }
        </div>;

    const ava = isFooter ?
        TEXT.PROFILE
        :
        <Avatar className={s.menuProfileAvatar} avatar={avatar} gender={gender} />;
    const avaMob = isFooter ?
        TEXT.PROFILE
        :
        <Tooltip tooltip={profileMobMenu} trigger="click" intent="minimal" placement={'bottom'} key='profile-mob-key' className={s.menuItem }>
            <Avatar className={s.menuProfileAvatar} avatar={avatar} gender={gender} />
        </Tooltip>;
    const MENU_PROFILE_ALL = { // TODO: дублирование - MENU_PROFILE_MOB
        ADMIN:      {id: 'admin-panel',     title: TEXT.ADMIN_PANEL,link: '/profile/admin/', external: true },
        PROFILE:    {id: PROFILE_PERSONAL,  title: ava,             link: replaceTab(LINKS.PROFILE,PROFILE_PERSONAL),       metrics:()=>sendMetric(LINK_PROFILE)},
        PROFILE_MOB: {id: 'profile-mob-menu', menu: avaMob},
        PROJECTS:   {id: MY_PRODUCTS_NEW,   title: TEXT.MY_PRODUCTS,link: replaceTab(LINKS.MY_PRODUCTS,MY_PRODUCTS_NEW),    metrics:()=>sendMetric(LINK_MY_PROJECTS) },
        PHOTOS:     {id: MY_PHOTOS_ALL,     title: TEXT.MY_PHOTOS,  link: replaceTab(LINKS.MY_PHOTOS,MY_PHOTOS_ALL),        metrics:()=>sendMetric(LINK_MY_PHOTOS) },
        MY_SHOP:     {id: 'my-shop',     title: TEXT.MY_SHOP,  link: LINKS.MY_SHOP},
        CART:       {id: MY_PRODUCTS_CART,  title: <Cart isFooter={isFooter} cartQ={cartQ}/>, link: replaceTab(LINKS.MY_PRODUCTS,MY_PRODUCTS_CART),   metrics:()=>sendMetric(LINK_CART) },
    };

    const MENU_PROFILE_ITEMS = isAdmin ?
        [
            ... !isMobile ? [MENU_PROFILE_ALL.MY_SHOP] : [],
            ... !isMobile ? [MENU_PROFILE_ALL.PHOTOS] : [],
            ... !isMobile ? [MENU_PROFILE_ALL.PROJECTS] : [],
            MENU_PROFILE_ALL.ADMIN,
            ... isMobile ? [MENU_PROFILE_ALL.PROFILE_MOB] : [MENU_PROFILE_ALL.PROFILE]
        ]
        :
        [
            ... !isMobile ? [MENU_PROFILE_ALL.PHOTOS] : [],
            ... !isMobile ? [MENU_PROFILE_ALL.PROJECTS] : [],
            ... cartQ > 0 ? [MENU_PROFILE_ALL.CART] : [],
            ... isMobile ? [MENU_PROFILE_ALL.PROFILE_MOB] : [MENU_PROFILE_ALL.PROFILE]
        ];
    return (
        <div className={menuClass}>
            {MENU_PROFILE_ITEMS.map( ( item, key ) => item.menu ?
                item.menu
                :
                item.external ?
                    <a className={s.menuItem + ' ' + s.headerLink } href={item.link} key={key}><span className={s.menuItemSm}>{ item.title }</span></a>
                        :
                    <NavLink className={s.menuItem}
                             activeClassName={s.active}
                             to={item.link}
                             onClick={item.metrics}
                             key={key}>{item.title}</NavLink> )}
        </div>
    );
});

export default withRouter(MenuProfileView);
