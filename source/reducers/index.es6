import { combineReducers } from 'redux';

import { access, auth, info } from './user';
import { modals } from './modals';
import gallery from './gallery';
import product from './product';
import { myProducts, delivery } from './myProducts';
import { myPhotos } from './myPhotos';
import { sideMenuShow } from './sideMenu';
import { previewTheme } from './previewTheme';
import { previewAlbum } from './previewAlbum';
import { previewPhoto } from './previewPhoto';
import { fullScreenLoader } from './fullScreenLoader';
import global  from './global';
import editor from './editor';
import stickers from './stickers';
import backgrounds from './backgrounds';
import productData from './productData';
import shop from './shop';
import myShop from './myShop';
import adminProducts from './adminProducts';
import adminStickers from './adminStickers';
import adminBackgrounds from './adminBackgrounds';
import themes from './themes';
import templates from './templates';

export default combineReducers({
    fullScreenLoader: fullScreenLoader,
    gallery: gallery,
    myProducts: myProducts,
    myPhotos: myPhotos,
    delivery: delivery,
    modals: modals,
    products: product,
    previewTheme: previewTheme,
    previewAlbum: previewAlbum,
    previewPhoto: previewPhoto,
    sideMenuShow: sideMenuShow,
    editor: editor,
    stickers: stickers,
    productData: productData,
    backgrounds: backgrounds,
    themes: themes,
    templates:templates,
    shop: shop,
    myShop: myShop,
    global: global,

    admin: combineReducers(
        {
            products: adminProducts,
            stickers: adminStickers,
            backgrounds: adminBackgrounds,
        }
    ),
    user: combineReducers(
        {
            auth: auth,
            info: info,
            access,
        }
    ),
})
