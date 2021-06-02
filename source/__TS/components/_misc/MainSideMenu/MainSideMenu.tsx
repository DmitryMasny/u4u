// @ts-ignore
import React , { memo, useState, useEffect } from 'react';
// @ts-ignore
import { useSelector } from "react-redux";
// @ts-ignore
import styled from 'styled-components'
// @ts-ignore
import SideMenu from "components/SideMenu";
// @ts-ignore
import { replaceTab, productGetId } from 'libs/helpers';
// @ts-ignore
import TEXT from "texts/main";
// @ts-ignore
import sendMetric from 'libs/metrics';
// @ts-ignore
import { MY_PRODUCTS_NEW, MY_PRODUCTS_CART } from 'const/myProducts';
// @ts-ignore
import { PROFILE_PERSONAL } from 'const/profile';
// @ts-ignore
import { NAV as NAV_HELP } from 'const/help'
// @ts-ignore
import LINKS from "config/links";
// @ts-ignore
import { userHasProfileSelector, userRoleIsAdmin } from 'selectors/user';
// @ts-ignore
// import { showFutureSelector } from 'selectors/global';
// @ts-ignore
import { myCartQuantitySelector } from "pages/MyProductsPage/selectors";
// @ts-ignore
import { SLUGS } from 'const/productsTypes';
import { generateProductUrl } from "__TS/libs/tools";
// @ts-ignore
import { showFutureSelector } from "selectors/global";

// @ts-ignore
import {generateThemesUrl} from "__TS/libs/tools";
// @ts-ignore
import {
    LINK_PHOTOBOOKS,
    //LINK_THEMES,
    //LINK_CALCULATOR,
    LINK_PHOTOS,
    LINK_POSTERS,
    LINK_ABOUT,
    LINK_DELIVERY,
    LINK_HELP,
    LINK_MY_PROJECTS,
    LINK_MY_PHOTOS,
    LINK_CART,
    LINK_PROFILE,
    LINK_CANVASES
    // @ts-ignore
} from 'const/metrics';


/** Interfaces */
interface IProps {
    button?: any; // кастомная кнопка вызова меню
    className?: string;
}
interface IMenuCart {
    myCartQuantity: number;
}


/** Styles */
const CartLink = styled( 'div' )`
    position: relative;
    padding-right: 15px;
`;

const CartLinkQt = styled( 'span' )`
        position: absolute;
        top: -3px;
        right: -3px;
        height: 15px;
        width: 15px;
        border-radius: 50%;
        background-color: rbg(246, 130, 37);
        color: #fff;
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        line-height: 15px;
`;


const MenuCart: React.FC<IMenuCart> = ( { myCartQuantity } ) => myCartQuantity > 0 ?
    <CartLink>
        <span>{ TEXT.CART }</span>
        <CartLinkQt>{ myCartQuantity }</CartLinkQt>
    </CartLink> : null;


/**
 * Боковое меню
 */
const MainSideMenu: React.FC<IProps> = ({button, className}) => {

    const isAdmin: boolean = useSelector( userRoleIsAdmin );
    const hasProfile: boolean = useSelector( userHasProfileSelector );
    const myCartQuantity: number = useSelector( myCartQuantitySelector );
    const showFuture = useSelector(showFutureSelector);
    const [menu, menuSet] = useState([]);

    useEffect(()=>{
        menuSet([
            {
                name: TEXT.MAIN_PAGE,
                link: LINKS.INDEX,
                active: false
            },
            ... isAdmin ? [
                { divider: 'Это разделитель. Он ставится вместо пункта меню, разделяя остальные пункты' },
                { name: TEXT.PRODUCTS,      link: LINKS.ADMIN_PRODUCTS_MAIN },
                { name: TEXT.THEMES,        link: generateThemesUrl({isAdmin: true}) },
                { name: TEXT.STICKERS,      link: LINKS.ADMIN_STICKERS },
                { name: TEXT.BACKGROUNDS,   link: LINKS.ADMIN_BACKGROUNDS },
            ] : [],
            { divider: 'Это разделитель. Он ставится вместо пункта меню, разделяя остальные пункты' },
            { name: TEXT.PHOTOBOOKS,        link: LINKS.PHOTOBOOKS.replace( ':coverType-:bindingType', 'hard-glue' ), metrics: () => sendMetric( LINK_PHOTOBOOKS ) },
            { name: TEXT.POSTERS,           link: generateProductUrl({productType: productGetId(SLUGS.POSTER_SIMPLE)}), metrics: () => sendMetric( LINK_POSTERS ) },
            { name: TEXT.PHOTOS,            link: generateProductUrl({productType: productGetId(SLUGS.PHOTO_SIMPLE)}) },
            { name: TEXT.CANVASES,          link: generateProductUrl({productType: productGetId(SLUGS.POSTER_CANVAS)}) },
            { name: TEXT.CALENDARS,         link: generateProductUrl({productType: productGetId(SLUGS.CALENDAR_WALL_SIMPLE)}) },
            { name: TEXT.PUZZLES,           link: generateProductUrl({productType: productGetId(SLUGS.PUZZLE)}) },
            ... hasProfile ?
                [
                    { divider: 'Это разделитель. Он ставится вместо пункта меню, разделяя остальные пункты' },
                    { name: TEXT.MY_PHOTOS,         link: LINKS.MY_PHOTOS_MAIN , metrics: ()=>sendMetric(LINK_MY_PHOTOS)     },
                    { name: TEXT.MY_PRODUCTS,       link: replaceTab(LINKS.MY_PRODUCTS, MY_PRODUCTS_NEW), metrics: ()=>sendMetric(LINK_MY_PROJECTS)     },
                    { name: <MenuCart myCartQuantity={myCartQuantity || 0}/>    ,                   link: replaceTab(LINKS.MY_PRODUCTS, MY_PRODUCTS_CART), metrics: ()=>sendMetric(LINK_CART)    },
                    { name: TEXT.PROFILE,           link: replaceTab(LINKS.PROFILE,PROFILE_PERSONAL), metrics: ()=>sendMetric(LINK_PROFILE)        }
                ] : [],
            { divider: 'Это разделитель. Он ставится вместо пункта меню, разделяя остальные пункты'},
            { name: TEXT.SHOP,              link: LINKS.SHOP_MAIN},
            { name: TEXT.BLOG,              link: LINKS.BLOG.replace(':post','')},
            { name: TEXT.SALES,             link: LINKS.SALES.replace(':post','')},
            { divider: 'Это разделитель. Он ставится вместо пункта меню, разделяя остальные пункты'},
            { name: TEXT.ABOUT_COMPANY,     link: LINKS.INFO_ABOUT_COMPANY, metrics: ()=>sendMetric(LINK_ABOUT)},
            { name: TEXT.DELIVERY,          link: LINKS.INFO_DELIVERY, metrics: ()=>sendMetric(LINK_DELIVERY)},
            { name: TEXT.HELP,              link: replaceTab(LINKS.HELP,NAV_HELP.START), metrics: ()=>sendMetric(LINK_HELP)},
        ]);
    }, [isAdmin, hasProfile, myCartQuantity, showFuture ]);

    // @ts-ignore
    return <SideMenu menu={menu} button={button} className={className}/>;
}
export default memo( MainSideMenu );
