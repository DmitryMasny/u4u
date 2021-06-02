import React, { lazy } from "react";
import { RouteComponentsLinkConverter } from 'libs/converters';

import { retry } from 'libs/helpers';

import TEXT from 'texts/main';
import TEXT_MY_PRODUCTS from 'texts/my_products';
import TEXT_MY_PHOTOS from 'texts/my_photos';
import TEXT_PROFILE from 'texts/profile';
import TEXT_HELP from 'texts/help';
import { MY_PRODUCTS_NEW, MY_PRODUCTS_INORDER, MY_PRODUCTS_DELETED, MY_PRODUCTS_CART} from 'const/myProducts';
import { MY_PHOTOS_ALL, MY_PHOTOS_FOLDERS} from 'const/myPhotos';
import { PROFILE_PERSONAL, PROFILE_CHANGE_PWD, PROFILE_SOCIAL} from 'const/profile';
import { NAV } from 'const/help';

import { PRODUCT_TYPE_PHOTOBOOK, PRODUCT_TYPES } from 'const/productsTypes';

import LINKS_MAIN from './links';

import StartPage from 'pages/StartPage';             //Асихнронная загрузка страницы Стартовая
import GalleryPage from 'pages/GalleryPage';           //Асихнронная загрузка страницы Галерея
import ProductPage from 'pages/ProductPage';           //Асихнронная загрузка страницы Расчета стоимости и настройки продукта
import MyProductsPage from 'pages/MyProductsPage';        //Асихнронная загрузка страницы Мои Продукты / Заказы / Корзина
import ProfilePage from 'pages/ProfilePage';           //Асихнронная загрузка страницы Профиль
import HelpPage from 'pages/HelpPage';              //Асихнронная загрузка страницы Помощь
import InfoPage from 'pages/Info';                  //Асихнронная загрузка страницы Информация
import ContactsPage from 'pages/Info/ContactsPage';     //Асихнронная загрузка страницы Контакты
import DeliveryPage from 'pages/Info/DeliveryPage';     //Асихнронная загрузка страницы Доставки
import AboutCompanyPage from 'pages/Info/AboutPage';        //Асихнронная загрузка страницы О Компании
import RequisitesPage from 'pages/Info/RequisitesPage';   //Асихнронная загрузка страницы Реквизиты
import OfferPage from 'pages/Info/OfferPage';        //Асихнронная загрузка страницы Оферты
import MyPhotosPage from 'pages/MyPhotosPage';       //Асихнронная загрузка страницы Мои фотографии
import IconsPage from 'pages/IconsPage';             //Админская страница просмотра иконок

import Shop from '__TS/components/Shop';
import MyShop from '__TS/components/MyShop';

//import SiteMap from 'pages/SiteMap';                 //SiteMap

const ProfileCreateBreadcrumbs = ( { match } ) => {
    let result = null;

    if (match.params) {
        switch ( match.params.tab ) {
            case PROFILE_PERSONAL:      result = TEXT_PROFILE.TAB_PERSONAL; break;
            case PROFILE_CHANGE_PWD:    result = TEXT_PROFILE.TAB_CHANGE_PWD; break;
            case PROFILE_SOCIAL:        result = TEXT_PROFILE.SOCIAL; break;
        }
    }
    return <span>{result}</span>
};

const MyProductsCreateBreadcrumbs = ( { match } ) => {
    let result = null;

    if (match.params) {
        switch ( match.params.tab ) {
            case MY_PRODUCTS_NEW:       result = TEXT_MY_PRODUCTS.NOT_COMPLETED; break;
            case MY_PRODUCTS_INORDER:   result = TEXT_MY_PRODUCTS.IN_ORDER; break;
            case MY_PRODUCTS_DELETED:   result = TEXT_MY_PRODUCTS.DELETED; break;
            case MY_PRODUCTS_CART:      result = TEXT_MY_PRODUCTS.CART; break;
        }
    }
    return <span>{result}</span>
};

const MyPhotosCreateBreadcrumbs = ( { match } ) => {
    let result = null;

    if (match.params) {
        switch ( match.params.tab ) {
            case MY_PHOTOS_ALL:       result = TEXT_MY_PHOTOS.MY_PHOTOS_ALL; break;
            case MY_PHOTOS_FOLDERS:   result = TEXT_MY_PHOTOS.MY_PHOTOS_FOLDERS; break;
        }
    }
    return <span>{result}</span>
};

const productsName = ( {location, last} ) => {

    if ( !last ) return null;
    if ( location.state && location.state.name ) return <span>{location.state.name}</span>;

    return null;
};

const ShopBreadcrumbs = ( {location, match, last} ) => {
    if ( !last ) return null;
    return location.state && location.state.name || '';
};

const HelpCreateBreadcrumbs = ( { match } ) => {
    let result = null;
    if (match.params) {
        switch ( match.params.tab ) {
            case NAV.EDITOR:        result = TEXT_HELP.EDITOR;          break;
            case NAV.POSTER_EDITOR: result = TEXT_HELP.POSTER_EDITOR;   break;
            case NAV.MY_PHOTOS:     result = TEXT_HELP.MY_PHOTOS;       break;
            case NAV.PHOTO_EDIT:    result = TEXT_HELP.PHOTO_EDIT;      break;
            case NAV.TEXT_EDIT:     result = TEXT_HELP.TEXT_EDIT;       break;
            case NAV.PAGES_EDIT:    result = TEXT_HELP.PAGES_EDIT;      break;
            case NAV.BINDING:       result = TEXT_HELP.BINDING;         break;
            case NAV.ORDER:         result = TEXT_HELP.ORDER;           break;
            case NAV.NOTIFICATIONS: result = TEXT_HELP.NOTIFICATIONS;   break;
            case NAV.PROMO:         result = TEXT_HELP.PROMO;           break;
        }
    }
    return <span>{result}</span>
};
const BlogBreadcrumbs = ( { match } ) => {
    const post = match.params && match.params['post'] && BLOG.find((b)=>b.id === match.params['post']);
    const title = post && post.title;

    return <span>{title}</span>
};
const SalesBreadcrumbs = ( { match } ) => {
    const post = match.params && match.params['post'] && SALES.find((b)=>b.id === match.params['post']);
    const title = post && post.title;

    return <span>{title}</span>
};
const AdminCreateBreadcrumbs = ( { match, location, last } ) => {
    if (last && match.params && match.params.format && match.params.productId) return location.state && location.state.name || match.params.productId;
    return TEXT.PRODUCTS;
};

//ссылки, ext - внешняя ссылка или нет, внешние ссылки будут адресоваться без JS.
const ROUTE_COMPONENTS_LINKS = [
    {id: 'INDEX',                 path: LINKS_MAIN.INDEX,               name: TEXT.MAIN_PAGE,           component: <StartPage />, exact: true},
    {id: 'INDEX_SEO',             path: LINKS_MAIN.INDEX_SEO,           name: TEXT.MAIN_PAGE,           component: <StartPage />, exact: true},
    {id: 'GALLERY',               path: LINKS_MAIN.GALLERY,             name: TEXT.GALLERY,             component: <GalleryPage />},
    {id: 'PROFILE',               path: LINKS_MAIN.PROFILE,             name: ProfileCreateBreadcrumbs, component: <ProfilePage /> },
    {id: 'PROFILE_MAIN',          path: LINKS_MAIN.PROFILE_MAIN,        name: TEXT.PROFILE,             component: <ProfilePage /> },
    {id: 'MY_PRODUCTS',           path: LINKS_MAIN.MY_PRODUCTS,         name: MyProductsCreateBreadcrumbs, component: <MyProductsPage />},
    {id: 'MY_PRODUCTS_MAIN',      path: LINKS_MAIN.MY_PRODUCTS_MAIN,    name: TEXT.MY_PRODUCTS,         component: <MyProductsPage />},
    {id: 'MY_PHOTOS',             path: LINKS_MAIN.MY_PHOTOS,           name: MyPhotosCreateBreadcrumbs, component: <MyPhotosPage />},
    {id: 'MY_PHOTOS_MAIN',        path: LINKS_MAIN.MY_PHOTOS_MAIN,      name: TEXT.MY_PHOTOS,           component: <MyPhotosPage />},

    //{id: 'MY_PRODUCTS',           path: LINKS_MAIN.MY_PRODUCTS_NEW,     name: TEXT_MY_PRODUCTS.NOT_COMPLETED, component: <MyProductsPage tab="new" />},
    //{id: 'MY_PRODUCTS',           path: LINKS_MAIN.MY_PRODUCTS_INORDER, name: TEXT_MY_PRODUCTS.IN_ORDER, component: <MyProductsPage  tab="inorder" />},
    //{id: 'MY_PRODUCTS',           path: LINKS_MAIN.MY_PRODUCTS_DELETED, name: TEXT_MY_PRODUCTS.DELETED, component: <MyProductsPage  tab="deleted" />},
    //{id: 'MY_PRODUCTS',           path: LINKS_MAIN.MY_PRODUCTS_CART,    name: TEXT_MY_PRODUCTS.CART, component: <MyProductsPage  tab="cart" />},

    {id: 'HELP',                  path: LINKS_MAIN.HELP,                name: HelpCreateBreadcrumbs, component: <HelpPage />},
    {id: 'HELP_MAIN',             path: LINKS_MAIN.HELP_MAIN,           name: TEXT.HELP, component: <HelpPage />},
    {id: 'INFO',                  path: LINKS_MAIN.INFO,                name: TEXT.INFO, component: <InfoPage />, exact: true},
    {id: 'INFO_CONTACTS',         path: LINKS_MAIN.INFO_CONTACTS,       name: TEXT.CONTACTS, component: <ContactsPage />},
    {id: 'INFO_ABOUT_COMPANY',    path: LINKS_MAIN.INFO_ABOUT_COMPANY,  name: TEXT.ABOUT_COMPANY, component: <AboutCompanyPage />},
    {id: 'INFO_DELIVERY',         path: LINKS_MAIN.INFO_DELIVERY,       name: TEXT.DELIVERY, component: <DeliveryPage />},
    {id: 'REQUISITES',            path: LINKS_MAIN.REQUISITES,          name: TEXT.REQUISITES, component: <RequisitesPage />},
    {id: 'PUBLIC_OFFER',          path: LINKS_MAIN.PUBLIC_OFFER,        name: TEXT.PUBLIC_OFFER, component: <OfferPage />},

    {id: 'ICONS_PAGE',            path: LINKS_MAIN.ICONS_PAGE,          name: 'IconsPage', component: <IconsPage />},

    //{id: 'SITE_MAP',              path: LINKS_MAIN.SITE_MAP,            name: 'SiteMap', component: <SiteMap />},

    {id: 'PHOTOBOOKS',            path: LINKS_MAIN.PHOTOBOOKS,
                                  name: TEXT.PHOTOBOOKS,
                                  component: <ProductPage productSlug={PRODUCT_TYPE_PHOTOBOOK} />},

    {id: 'PRICES',                path: LINKS_MAIN.PRICES,
                                  name: TEXT.PRICES,
                                  component: <ProductPage productSlug={PRODUCT_TYPE_PHOTOBOOK} calculator={true}/>},
    {id: 'POSTERS_SEO',           path: LINKS_MAIN.POSTERS_SEO,
                                  name: productsName,
                                  component: <ProductPage productSlug={PRODUCT_TYPES.POSTER} />},
    {id: 'POSTERS',               path: LINKS_MAIN.POSTERS,
                                  name: productsName,
                                  component: <ProductPage productSlug={PRODUCT_TYPES.POSTER} />},

    {id: 'PHOTOS',                path: LINKS_MAIN.PHOTOS,
                                  name: productsName,
                                  component: <ProductPage productSlug={PRODUCT_TYPES.PHOTO} />},

    {id: 'CANVASES',              path: LINKS_MAIN.CANVASES,
                                  name: productsName,
                                  component: <ProductPage productSlug={PRODUCT_TYPES.CANVAS} />},

    {id: 'SHOP',                  path: LINKS_MAIN.SHOP,
                                  name: ShopBreadcrumbs,
                                  component: <Shop />},

    {id: 'SHOP_MAIN',             path: LINKS_MAIN.SHOP_MAIN,
                                  name: TEXT.SHOP,
                                  component: <Shop />},

    {id: 'PHONE',                 path: LINKS_MAIN.PHONE, exact: true}
];

const { LINKS, BREAD_CRUMBS_LINKS } = RouteComponentsLinkConverter( ROUTE_COMPONENTS_LINKS );

export { ROUTE_COMPONENTS_LINKS, LINKS,  BREAD_CRUMBS_LINKS }
