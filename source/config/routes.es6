import React, { lazy } from "react";
import { RouteComponentsLinkConverter } from 'libs/converters';

import { retry } from 'libs/helpers';

import TEXT from 'texts/main';
import TEXT_MY_PRODUCTS from 'texts/my_products';
import TEXT_MY_PHOTOS from 'texts/my_photos';
import TEXT_PROFILE from 'texts/profile';
import TEXT_HELP from 'texts/help';
import TEXT_ADMIN from 'texts/admin';
import { MY_PRODUCTS_NEW, MY_PRODUCTS_INORDER, MY_PRODUCTS_DELETED, MY_PRODUCTS_CART} from 'const/myProducts';
import { MY_PHOTOS_ALL, MY_PHOTOS_FOLDERS} from 'const/myPhotos';
import { PROFILE_PERSONAL, PROFILE_CHANGE_PWD, PROFILE_SOCIAL} from 'const/profile';
import { NAV } from 'const/help';
//import { PRODUCT_TABS } from 'components/_pages/_admin/Products/_config';

import { PRODUCT_TYPE_PHOTOBOOK, PRODUCT_TYPES } from 'const/productsTypes';

import LINKS_MAIN from './links';
import BLOG from 'components/_pages/BlogPage/blogData.es6';
import SALES from 'components/_pages/BlogPage/salesData.es6';

const StartPage =           lazy(() => retry(() => import('pages/StartPage')));              //Асихнронная загрузка страницы Стартовая
const GalleryPage =         lazy(() => retry(() => import('pages/GalleryPage')));           //Асихнронная загрузка страницы Галерея
const Editor =              lazy(() => retry(() => import('__TS/components/Editor')));          //Асихнронная загрузка Редактора
const ProductPage =         lazy(() => retry(() => import('pages/ProductPage')));           //Асихнронная загрузка страницы Расчета стоимости и настройки продукта
const MyProductsPage =      lazy(() => retry(() => import('pages/MyProductsPage')));        //Асихнронная загрузка страницы Мои Продукты / Заказы / Корзина
const ProfilePage =         lazy(() => retry(() => import('pages/ProfilePage')));           //Асихнронная загрузка страницы Профиль
const HelpPage =            lazy(() => retry(() => import('pages/HelpPage')));              //Асихнронная загрузка страницы Помощь
const InfoPage =            lazy(() => retry(() => import('pages/Info')));                  //Асихнронная загрузка страницы Информация
const ContactsPage =        lazy(() => retry(() => import('pages/Info/ContactsPage')));     //Асихнронная загрузка страницы Контакты
const DeliveryPage =        lazy(() => retry(() => import('pages/Info/DeliveryPage')));     //Асихнронная загрузка страницы Доставки
const AboutCompanyPage =    lazy(() => retry(() => import('pages/Info/AboutPage')));        //Асихнронная загрузка страницы О Компании
const RequisitesPage =      lazy(() => retry(() => import('pages/Info/RequisitesPage')));   //Асихнронная загрузка страницы Реквизиты
const OfferPage =           lazy(() => retry(() => import('pages/Info/OfferPage')));        //Асихнронная загрузка страницы Оферты
const MyPhotosPage =        lazy(() => retry(() => import('pages/MyPhotosPage')));          //Асихнронная загрузка страницы Мои фотографии
const BlogPage =            lazy(() => retry(() => import('pages/BlogPage')));               //Асихнронная загрузка страницы Мои фотографии
const GiftCardPage =        lazy(() => retry(() => import('pages/GiftCardPage')));           //Асихнронная загрузка страницы Подарочного сертификата
const ThemesPage =          lazy(() => retry(() => import('pages/ThemesPage')));           //Асихнронная загрузка страницы Подарочного сертификата

const AdminPage =           lazy(() => retry(() => import('pages/_admin/')));               //Асихнронная загрузка страницы Админа
const AdminProducts =       lazy(() => retry(() => import('pages/_admin/Products')));       //Асихнронная загрузка страницы Админа
const AdminOptions =        lazy(() => retry(() => import('pages/_admin/Options')));        //Асихнронная загрузка страницы Админа
const AdminThemes =         lazy(() => retry(() => import('pages/_admin/Themes')));         //Асихнронная загрузка страницы Админа

const IconsPage =           lazy(() => retry(() => import('pages/IconsPage')));             //Админская страница просмотра иконок
const TestPage =            lazy(() => retry(() => import('pages/TestPage')));              //TestPage

const Shop =                lazy(() => retry(() => import('__TS/components/Shop')));
const MyShop =              lazy(() => retry(() => import('__TS/components/MyShop')));

const AdminStickers =       lazy(() => retry(() => import('__TS/components/AdminStickers')));
const AdminBackgrounds =    lazy(() => retry(() => import('__TS/components/AdminBackgrounds')));

const SiteMap =             lazy(() => retry(() => import('pages/SiteMap')));

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
    {id: 'GALLERY_SEO',           path: LINKS_MAIN.GALLERY_SEO,         name: TEXT.GALLERY,             component: <GalleryPage />, exact: true},
    {id: 'GALLERY',               path: LINKS_MAIN.GALLERY,             name: TEXT.GALLERY,             component: <GalleryPage />, exact: true},
    {id: 'GALLERY_B64',           path: LINKS_MAIN.GALLERY_B64,         name: TEXT.GALLERY,             component: <GalleryPage />, exact: true},
    {id: 'EDITOR',                path: LINKS_MAIN.EDITOR,              name: TEXT.EDITOR,              component: <Editor />},
    {id: 'PROFILE',               path: LINKS_MAIN.PROFILE,             name: ProfileCreateBreadcrumbs, component: <ProfilePage /> },
    {id: 'PROFILE_MAIN',          path: LINKS_MAIN.PROFILE_MAIN,        name: TEXT.PROFILE,             component: <ProfilePage /> },
    {id: 'MY_PRODUCTS',           path: LINKS_MAIN.MY_PRODUCTS,         name: MyProductsCreateBreadcrumbs, component: <MyProductsPage />},
    {id: 'MY_PRODUCTS_MAIN',      path: LINKS_MAIN.MY_PRODUCTS_MAIN,    name: TEXT.MY_PRODUCTS,         component: <MyProductsPage />},
    {id: 'MY_PHOTOS',             path: LINKS_MAIN.MY_PHOTOS,           name: MyPhotosCreateBreadcrumbs, component: <MyPhotosPage />},
    {id: 'MY_PHOTOS_MAIN',        path: LINKS_MAIN.MY_PHOTOS_MAIN,      name: TEXT.MY_PHOTOS,           component: <MyPhotosPage />},
    {id: 'BLOG',                  path: LINKS_MAIN.BLOG,                name: BlogBreadcrumbs,          component: <BlogPage />},
    {id: 'BLOG_MAIN',             path: LINKS_MAIN.BLOG_MAIN,           name: TEXT.BLOG,                component: <BlogPage />},
    {id: 'SALES',                 path: LINKS_MAIN.SALES,               name: SalesBreadcrumbs,          component: <BlogPage isSales/>},
    {id: 'SALES_MAIN',            path: LINKS_MAIN.SALES_MAIN,          name: TEXT.SALES,               component: <BlogPage isSales/>},

    //{id: 'MY_PRODUCTS',           path: LINKS_MAIN.MY_PRODUCTS_NEW,     name: TEXT_MY_PRODUCTS.NOT_COMPLETED, component: <MyProductsPage tab="new" />},
    //{id: 'MY_PRODUCTS',           path: LINKS_MAIN.MY_PRODUCTS_INORDER, name: TEXT_MY_PRODUCTS.IN_ORDER, component: <MyProductsPage  tab="inorder" />},
    //{id: 'MY_PRODUCTS',           path: LINKS_MAIN.MY_PRODUCTS_DELETED, name: TEXT_MY_PRODUCTS.DELETED, component: <MyProductsPage  tab="deleted" />},
    //{id: 'MY_PRODUCTS',           path: LINKS_MAIN.MY_PRODUCTS_CART,    name: TEXT_MY_PRODUCTS.CART, component: <MyProductsPage  tab="cart" />},

    {id: 'TEST',                  path: '/testpage/',                   name: 'testPage', component: <TestPage />},
    {id: 'HELP',                  path: LINKS_MAIN.HELP,                name: HelpCreateBreadcrumbs, component: <HelpPage />},
    {id: 'HELP_MAIN',             path: LINKS_MAIN.HELP_MAIN,           name: TEXT.HELP, component: <HelpPage />},
    {id: 'INFO',                  path: LINKS_MAIN.INFO,                name: TEXT.INFO, component: <InfoPage />, exact: true},
    {id: 'INFO_CONTACTS',         path: LINKS_MAIN.INFO_CONTACTS,       name: TEXT.CONTACTS, component: <ContactsPage />},
    {id: 'INFO_ABOUT_COMPANY',    path: LINKS_MAIN.INFO_ABOUT_COMPANY,  name: TEXT.ABOUT_COMPANY, component: <AboutCompanyPage />},
    {id: 'INFO_DELIVERY',         path: LINKS_MAIN.INFO_DELIVERY,       name: TEXT.DELIVERY, component: <DeliveryPage />},

    {id: 'ADMIN_THEMES',          path: LINKS_MAIN.ADMIN_THEMES_MAIN,   name: TEXT.THEMES, component: <AdminThemes/>},
    {id: 'ADMIN',                 path: LINKS_MAIN.ADMIN,               name: TEXT.ADMIN_PANEL, component: <AdminPage/>, exact: true },
    {id: 'ADMIN_PRODUCTS_MAIN',   path: LINKS_MAIN.ADMIN_PRODUCTS_MAIN, name: TEXT.PRODUCTS, component: <AdminProducts/>, exact: true },
    {id: 'ADMIN_PRODUCTS',        path: LINKS_MAIN.ADMIN_PRODUCTS,      name: AdminCreateBreadcrumbs, component: <AdminProducts/> },
    {id: 'ADMIN_OPTIONS',         path: LINKS_MAIN.ADMIN_OPTIONS,       name: TEXT.OPTIONS, component: <AdminOptions/>},

    {id: 'THEMES_PAGE',           path: LINKS_MAIN.THEMES_MAIN,         name: TEXT.THEMES, component: <ThemesPage/>},

    {id: 'ADMIN_STICKERS',        path: LINKS_MAIN.ADMIN_STICKERS,      name: TEXT.STICKERS, component: <AdminStickers/>},
    {id: 'ADMIN_BACKGROUNDS',     path: LINKS_MAIN.ADMIN_BACKGROUNDS,   name: TEXT.BACKGROUNDS, component: <AdminBackgrounds/>},


    {id: 'REQUISITES',            path: LINKS_MAIN.REQUISITES,          name: TEXT.REQUISITES, component: <RequisitesPage/>},
    {id: 'PUBLIC_OFFER',          path: LINKS_MAIN.PUBLIC_OFFER,        name: TEXT.PUBLIC_OFFER, component: <OfferPage/>},

    {id: 'ICONS_PAGE',            path: LINKS_MAIN.ICONS_PAGE,          name: 'IconsPage', component: <IconsPage />},

    {id: 'PRODUCT',               path: LINKS_MAIN.PRODUCT,
                                  name: 'Новый продукт',
                                  component: <ProductPage />},

    //{id: 'SITE_MAP',              path: LINKS_MAIN.SITE_MAP,          name: 'IconsPage', component: <SiteMap />},

    {id: 'PHOTOBOOKS',            path: LINKS_MAIN.PHOTOBOOKS,
                                  name: TEXT.PHOTOBOOKS,
                                  component: <ProductPage productSlug={PRODUCT_TYPE_PHOTOBOOK} />},

    {id: 'PRICES',                path: LINKS_MAIN.PRICES,
                                  name: TEXT.PRICES,
                                  component: <ProductPage productSlug={PRODUCT_TYPE_PHOTOBOOK} calculator={true}/>},

    {id: 'POSTERS_SEO',           path: LINKS_MAIN.POSTERS_SEO,
                                  name: productsName,
                                  component: <ProductPage productSlug={PRODUCT_TYPES.POSTER}/>},

    {id: 'POSTERS',               path: LINKS_MAIN.POSTERS,
                                  name: productsName,
                                  component: <ProductPage productSlug={PRODUCT_TYPES.POSTER}/>},

    {id: 'PHOTOS',                path: LINKS_MAIN.PHOTOS,
                                  name: productsName,
                                  component: <ProductPage productSlug={PRODUCT_TYPES.PHOTO}/>},


    {id: 'CANVASES',              path: LINKS_MAIN.CANVASES,
                                  name: productsName,
                                  component: <ProductPage productSlug={PRODUCT_TYPES.CANVAS}/>},

    {id: 'EDIT',                  path: LINKS_MAIN.EDIT,
                                  name: TEXT.POSTER_EDITOR,
                                  component: <Editor />},

    {id: 'SHOP',                  path: LINKS_MAIN.SHOP,
                                  name: ShopBreadcrumbs,
                                  component: <Shop />},
    {id: 'SHOP_MAIN',             path: LINKS_MAIN.SHOP_MAIN,
                                  name: TEXT.SHOP,
                                  component: <Shop />},


    {id: 'GIFT_CARD',             path: LINKS_MAIN.GIFT_CARD,
                                  name: TEXT.GIFT_CARD,
                                  component: <GiftCardPage/>},

    {id: 'GIFT_CARD_A',           path: LINKS_MAIN.PAYMENT_ACCEPTED,
                                  name: TEXT.GIFT_CARD,
                                  component: <GiftCardPage/>, exact: false},
    {id: 'GIFT_CARD_D',           path: LINKS_MAIN.PAYMENT_DECLINED,
                                  name: TEXT.GIFT_CARD,
                                  component: <GiftCardPage/>, exact: false},

    {id: 'GIFT_CARD_MAIN',        path: LINKS_MAIN.GIFT_CARD_MAIN,
                                  name: TEXT.GIFT_CARD,
                                  component: <GiftCardPage/>},


    {id: 'MY_SHOP',               path: LINKS_MAIN.MY_SHOP,
                                  name: ShopBreadcrumbs,
                                  component: <MyShop />},
    {id: 'MY_SHOP_MAIN',          path: LINKS_MAIN.MY_SHOP_MAIN,
                                  name: TEXT.MY_SHOP,
                                  component: <MyShop />},

    {id: 'PHONE',                 path: LINKS_MAIN.PHONE, exact: true},
    {id: 'PHONE2',                path: LINKS_MAIN.PHONE2, exact: true},
    {id: 'INDEX',                 path: LINKS_MAIN.INDEX,               name: TEXT.MAIN_PAGE,           component: <StartPage />, exact: true},
    {id: 'INDEX_SEO',             path: LINKS_MAIN.INDEX_SEO,           name: TEXT.MAIN_PAGE,           component: <StartPage />, exact: true}
];

const { LINKS, BREAD_CRUMBS_LINKS } = RouteComponentsLinkConverter( ROUTE_COMPONENTS_LINKS );

export { ROUTE_COMPONENTS_LINKS, LINKS,  BREAD_CRUMBS_LINKS}
