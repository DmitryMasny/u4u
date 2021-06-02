import {
    USER_TOKEN_GET_REQUEST,
    GALLERY_GET_CATEGORIES,
    GALLERY_GET_THEMES_FROM_SERVER,
    MY_PRODUCTS_GET_PRODUCTS,
    MY_PRODUCTS_GET_CART_COUNT,
    MY_PRODUCTS_GET_DELETED_PRODUCTS,
    MY_PRODUCTS_MAKE_ORDER_FROM_PRODUCT,
    MY_PRODUCTS_MAKE_PRODUCT_COPY,
    MY_PRODUCTS_DELETE_PRODUCT,
    MY_PRODUCTS_RECOVER_PRODUCT,
    MY_PRODUCTS_REMOVE_PRODUCT_FROM_CART,
    MY_PRODUCTS_CHANGE_PRODUCT_COUNT,
    MY_PRODUCTS_CHANGE_PRODUCT_NAME,
    MY_PRODUCTS_GET_ORDERS,
    MY_PRODUCTS_SEND_NEW_ORDER_TO_SERVER,
    PRODUCT_TYPES_GET,
    USER_LOGIN,
    USER_LOGOUT,
    USER_REGISTER,
    USER_RESTORE,
    USER_CHANGE_PASSWORD,
    USER_GET_PERSONAL_INFO,
    USER_SEND_PERSONAL_INFO,
    USER_SEND_AVATAR,
    USER_SEND_DELIVERY,
    USER_GET_DELIVERY,
    GENERATE_LAYOUT,
    THEME_LAYOUT_GET_FROM_SERVER,
    THEME_BACKGROUNDS_GET_FROM_SERVER,
    ALBUM_LAYOUT_GET_FROM_SERVER,
    SEND_SPEC_PROJECT_TO_SERVER,
    PROMOCODE_CHECK,
    //BIGLION_PROMOCODE_CHECK,
    PRODUCT_GET_THEME_DATA,
    MY_PHOTOS_UPLOAD_PHOTO,
    MY_PHOTOS_GET_PHOTOS,
    MY_PHOTOS_GET_FOLDERS,
    MY_PHOTOS_GET_FOLDER_PHOTOS,
    MY_PHOTOS_CREATE_FOLDER,
    MY_PHOTOS_DELETE_PHOTOS,
    MY_PHOTOS_MOVE_PHOTOS,
    MY_PHOTOS_RENAME_FOLDER,
    MY_PHOTOS_DELETE_FOLDER,
    MY_PHOTOS_REMOVE_FROM_FOLDER,
    MY_PHOTOS_ROTATE_PHOTO,
    MY_PHOTOS_GET_GOOGLE_PHOTOS,
    MY_PHOTOS_SET_GOOGLE_PHOTOS,
    MY_PHOTOS_GET_INSTAGRAM_PHOTOS,
    MY_PHOTOS_SET_INSTAGRAM_PHOTOS,
    MY_PHOTOS_GET_VK_PHOTOS,
    MY_PHOTOS_SET_VK_PHOTOS,
    MY_PHOTOS_GET_YANDEX_PHOTOS,
    MY_PHOTOS_SET_YANDEX_PHOTOS,
    EDITOR_GET_PHOTOS_LIBRARY,
    EDITOR_GET_THEMES_LIBRARY,
    EDITOR_GET_TEXT_LIBRARY,
    EDITOR_GET_FRAMES_LIBRARY,
    EDITOR_GET_STICKERS_LIBRARY,
    EDITOR_GET_TEMPLATES_LIBRARY,
    PRODUCT_GET_OPTIONS,
    PRODUCT_CREATE_POSTER,
    ADMIN_GET_PRODUCTS_LIST,
    ADMIN_GET_PRODUCT,
    MY_PHOTOS_DUPLICATE_PHOTOS,
    ADMIN_UPLOAD_PRODUCT_IMAGE,
    GIFT_CARD_SET,
    SHOP_GET_PRODUCTSET,
    SHOP_GET_PRODUCTSETS_PAGE,
    SHOP_GET_FILTERS,
    MY_SHOP_GET_PRODUCTSET,
    MY_SHOP_GET_PRODUCTSETS_PAGE,
    SHOP_GET_PRODUCTSET_CATEGORIES,
    SHOP_BUY_PRODUCT,
    MY_SHOP_PRODUCTSET_CREATE,
    MY_SHOP_PRODUCTSET_UPDATE,
    MY_SHOP_PRODUCTSET_DELETE,
    MY_SHOP_PRODUCTSET_CHANGE_STATUS,
    ADMIN_STICKERS_GET_STICKERS,
    ADMIN_STICKERS_GET_STICKER_PACK,
    ADMIN_STICKERS_STICKER_PACK_CREATE,
    ADMIN_STICKERS_STICKER_PACK_DELETE,
    ADMIN_STICKERS_STICKER_PACK_UPDATE,
    ADMIN_STICKERS_STICKER_UPLOAD,
    ADMIN_STICKERS_MOVE_STICKERS,
    ADMIN_STICKERS_STICKER_UPDATE,
    ADMIN_STICKERS_STICKER_DELETE,
    ADMIN_STICKERS_STICKER_PACK_SORT,
    ADMIN_STICKERS_STICKER_SORT,
    // ADMIN_STICKERS_BULK_UPDATE,
    ADMIN_STICKERS_BULK_DELETE,
    THEMES_GET_THEMES,
    ADMIN_THEME_GET_DATA,
    THEMES_GET_THEME_DATA,
    ADMIN_THEME_UPDATE,
    ADMIN_THEME_DELETE,
    ADMIN_CHANGE_THEME_STATUS,
    THEMES_GET_PUBLISHED_THEMES,
    THEMES_GET_FILTER_DATA,
    THEMES_CREATE_NEW_THEME,
    THEMES_GET_ADMIN_CATEGORIES,
    THEMES_GET_ADMIN_PRODUCT_GROUP,
    THEMES_CREATE_CATEGORY,
    ADMIN_BACKGROUNDS_GET_BACKGROUNDS,
    ADMIN_BACKGROUNDS_GET_BACKGROUND_PACK,
    ADMIN_BACKGROUNDS_BACKGROUND_PACK_CREATE,
    ADMIN_BACKGROUNDS_BACKGROUND_PACK_DELETE,
    ADMIN_BACKGROUNDS_BACKGROUND_PACK_UPDATE,
    ADMIN_BACKGROUNDS_BACKGROUND_UPLOAD,
    ADMIN_BACKGROUNDS_MOVE_BACKGROUNDS,
    ADMIN_BACKGROUNDS_BACKGROUND_UPDATE,
    ADMIN_BACKGROUNDS_BACKGROUND_DELETE,
    ADMIN_BACKGROUNDS_BACKGROUND_PACK_SORT,
    ADMIN_BACKGROUNDS_BACKGROUND_SORT,
    ADMIN_BACKGROUNDS_BULK_DELETE,
    THEMES_COPY_THEME,
    ADMIN_THEME_STICKER_DELETE,
    ADMIN_THEME_BACKGROUND_DELETE
} from 'const/actionTypes';

import { getTokenAdapter, userAuthAdapter, themesListAdapter } from 'adapter/userAdapter';

const apiList = {
    [ USER_TOKEN_GET_REQUEST ]: {
        method: 'POST',         //метод вызова
        url: '/auth/autoreg/', //точка входа API

        adapter: getTokenAdapter,
        //adapter: {
        //    from: getTokenAdapter,
        //    to:   getTokenAdapter
        //},
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000 //интервалы попыток получения данных
    },
    [ USER_LOGIN ]: {
        method: 'POST',         //метод вызова
        url: '/auth/signin/',   //точка входа API
        adapter: userAuthAdapter,
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000 //интервалы попыток получения данных
    },
    [ USER_REGISTER ]: {
        method: 'POST',
        url: '/auth/signup/',
        adapter: userAuthAdapter,
        failRetry: 5,
        failRetryInterval: 1000
    },
    [ USER_RESTORE ]: {
        method: 'POST',         //метод вызова
        url: '/auth/restorepwd/',   //точка входа API
        adapter: userAuthAdapter,
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных

    },
    [ USER_LOGOUT ]: {
        method: 'POST',         //метод вызова
        url: '/api/auth/logout/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных

    },
    [ USER_CHANGE_PASSWORD ]: {
        method: 'POST',         //метод вызова
        url: '/api/auth/user/chpwd/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных

    },
    [ USER_GET_PERSONAL_INFO ]: {
        method: 'GET',         //метод вызова
        url: '/api/auth/user/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных

    },
    [ USER_SEND_PERSONAL_INFO ]: {
        method: 'PUT',         //метод вызова
        url: '/api/auth/user/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных

    },
    [ GALLERY_GET_CATEGORIES ]: {
        method: 'GET',         //метод вызова
        url: '/api/gallery2/themecategory/', //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных

    },

    [ PRODUCT_TYPES_GET ]: {
        method: 'POST',    //метод вызова
        url: '/gettypes/', //точка входа API
        fake: true, //фейковый запрос, не уходит на сервер, но возвращает данные из fake.es6
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных

    },

    // [ PRODUCT_GET_POSTERS ]: {
    //     method: 'GET',    //метод вызова
    //     url: '/getposters/', //точка входа API
    //     fake: true, //фейковый запрос, не уходит на сервер, но возвращает данные из fake.es6
    //     failRetry: 5, //число попыток получить данные
    //     failRetryInterval: 1000, //интервалы попыток получения данных
    // },
    // [ PRODUCT_GET_OPTIONS ]: {
    //     method: 'GET',    //метод вызова
    //     url: '/getoptionsAll/', //точка входа API
    //     fake: true, //фейковый запрос, не уходит на сервер, но возвращает данные из fake.es6
    //     failRetry: 5, //число попыток получить данные
    //     failRetryInterval: 1000, //интервалы попыток получения данных
    // },

    [ GALLERY_GET_THEMES_FROM_SERVER ]: {
        method: 'GET',                  //метод вызова
        url: '/api/gallery2/product/',  //точка входа API
        adapter: {
            from: themesListAdapter,
            to: themesListAdapter
        },
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },

    [THEME_LAYOUT_GET_FROM_SERVER]: {
        method: 'GET',                  //метод вызова
        url: '/api/ua/layout/product/',  //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },

    [THEME_BACKGROUNDS_GET_FROM_SERVER]: {
        method: 'GET',                  //метод вызова
        url: '/api/theme/',  //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },

    [ ALBUM_LAYOUT_GET_FROM_SERVER ]: {
        method: 'GET',                  //метод вызова
        url: '/api/ua/layout/',         //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },

    [ MY_PRODUCTS_GET_PRODUCTS ]: {
        method: 'GET',                  //метод вызова
        url: '/api/ua/layout/',   //точка входа API
        // adapter: productsListAdapter,
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных

    },

    [ MY_PRODUCTS_GET_DELETED_PRODUCTS ]: {
        method: 'GET',                  //метод вызова
        url: '/api/ua/layout/?status=DELETED',   //точка входа API
        // adapter: productsListAdapter,
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных

    },

    [ MY_PRODUCTS_GET_ORDERS ]: {
        method: 'GET',                  //метод вызова
        url: '/api/merch/orderset/',   //точка входа API
        // adapter: productsListAdapter,
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },

    [ MY_PRODUCTS_GET_CART_COUNT ]: {
        method: 'GET',                  //метод вызова
        url: '/api/merch/order/count/',   //точка входа API
        // adapter: productsListAdapter,
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },

    [ MY_PRODUCTS_MAKE_ORDER_FROM_PRODUCT ]: {
        method: 'POST',                  //метод вызова
        url: '/api/ua/layout/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },

    [ MY_PRODUCTS_MAKE_PRODUCT_COPY ]: {
        method: 'POST',                  //метод вызова
        url: '/api/ua/layout/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },

    [ MY_PRODUCTS_DELETE_PRODUCT ]: {
        method: 'PATCH',          //метод вызова
        url: '/api/ua/layout/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000,  //интервалы попыток получения данных
    },

    [ MY_PRODUCTS_RECOVER_PRODUCT ]: {
        method: 'PATCH',          //метод вызова
        url: '/api/ua/layout/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000,  //интервалы попыток получения данных
    },

    [ MY_PRODUCTS_REMOVE_PRODUCT_FROM_CART ]: {
        method: 'DELETE',           //метод вызова
        url: '/api/merch/order/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000,    //интервалы попыток получения данных
    },

    [ MY_PRODUCTS_CHANGE_PRODUCT_COUNT ]: {
        method: 'PATCH',            //метод вызова
        url: '/api/merch/order/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000,    //интервалы попыток получения данных
    },

    [ MY_PRODUCTS_CHANGE_PRODUCT_NAME ]: {
        method: 'PATCH',          //метод вызова
        url: '/api/ua/layout/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000,  //интервалы попыток получения данных
    },

    [ MY_PRODUCTS_SEND_NEW_ORDER_TO_SERVER ]: {
        method: 'POST',                 //метод вызова
        url: '/api/merch/orderset/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },
    [ GENERATE_LAYOUT ]: {
        method: 'POST',
        url: '/api/ua/product/',
    },
    [ PROMOCODE_CHECK ]: {
        method: 'GET',
        url: '/order/discount/',
    },
    /*
    [ BIGLION_PROMOCODE_CHECK ]: {
        method: 'GET',
        url: '/order/discount/',
    },
    */

    [ MY_PHOTOS_GET_PHOTOS ]: {
        method: 'GET',                  //метод вызова
        url: '/photos/api/photo/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },
    // Запрос Google фоток
    [ MY_PHOTOS_GET_GOOGLE_PHOTOS ]: {
        method: 'GET',                  //метод вызова
        url: '/social/photo/google/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },
    // Добавление выбранных Google фоток
    [ MY_PHOTOS_SET_GOOGLE_PHOTOS ]: {
        method: 'POST',                  //метод вызова
        url: '/social/photo/google/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },
    // Запрос instagram фоток
    [ MY_PHOTOS_GET_INSTAGRAM_PHOTOS ]: {
        method: 'GET',                  //метод вызова
        url: '/social/photo/instagram/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },
    // Добавление выбранных instagram фоток
    [ MY_PHOTOS_SET_INSTAGRAM_PHOTOS ]: {
        method: 'POST',                  //метод вызова
        url: '/social/photo/instagram/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },
    // Запрос instagram фоток
    [ MY_PHOTOS_GET_VK_PHOTOS ]: {
        method: 'GET',                  //метод вызова
        url: '/social/photo/vk/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },
    // Добавление выбранных instagram фоток
    [ MY_PHOTOS_SET_VK_PHOTOS ]: {
        method: 'POST',                  //метод вызова
        url: '/social/photo/vk/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },
    // Запрос instagram фоток
    [ MY_PHOTOS_GET_YANDEX_PHOTOS ]: {
        method: 'GET',                  //метод вызова
        url: '/social/photo/ya/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },
    // Добавление выбранных instagram фоток
    [ MY_PHOTOS_SET_YANDEX_PHOTOS ]: {
        method: 'POST',                  //метод вызова
        url: '/social/photo/ya/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },
    // [ MY_PHOTOS_GET_PHOTO_BY_ID ]: {
    //     method: 'GET',                  //метод вызова
    //     url: '/api/photo/',   //точка входа API
    //     failRetry: 5, //число попыток получить данные
    //     failRetryInterval: 1000, //интервалы попыток получения данных
    // },
    [ MY_PHOTOS_DELETE_PHOTOS ]: {
        method: 'PATCH',                  //метод вызова
        url: '/photos/api/photo/destroy_many/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },
    [ MY_PHOTOS_DUPLICATE_PHOTOS ]: {
        method: 'PATCH',                  //метод вызова
        url: '/photos/api/photo/copy_many/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },
    [ MY_PHOTOS_MOVE_PHOTOS ]: {
        method: 'PATCH',                  //метод вызова
        url: '/photos/api/folder/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },

    [ MY_PHOTOS_ROTATE_PHOTO ]: {
        method: 'PUT',                  //метод вызова
        url: '/api/photo/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },

    [ MY_PHOTOS_UPLOAD_PHOTO ]: {
        method: 'POST',                  //метод вызова
        url: '/api/or/photo/',   //точка входа API
        urlForProduction: 'prod.u4u.online/api/or/photo/',
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },
    [ ADMIN_UPLOAD_PRODUCT_IMAGE ]: {
        method: 'POST',                  //метод вызова
        url: '/api/or/photo/',   //точка входа API
        urlForProduction: 'prod.u4u.online/api/or/photo/',
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },

    [ MY_PHOTOS_GET_FOLDERS ]: {
        method: 'GET',                  //метод вызова
        url: '/photos/api/folder/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },
    [ MY_PHOTOS_GET_FOLDER_PHOTOS ]: {
        method: 'GET',                  //метод вызова
        url: '/photos/api/photo/folder/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },
    [ MY_PHOTOS_CREATE_FOLDER ]: {
        method: 'POST',                  //метод вызова
        url: '/photos/api/folder/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },
    [ MY_PHOTOS_RENAME_FOLDER ]: {
        method: 'PUT',                  //метод вызова
        url: '/photos/api/folder/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },
    [ MY_PHOTOS_DELETE_FOLDER ]: {
        method: 'DELETE',                  //метод вызова
        url: '/photos/api/folder/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },
    [ MY_PHOTOS_REMOVE_FROM_FOLDER ]: {
        method: 'PATCH',                  //метод вызова
        url: '/photos/api/folder/',   //точка входа API
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },



    [ USER_SEND_AVATAR ]: {
        method: 'PUT',
        url: '/api/auth/user/',
        imageName: 'avatar',
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    },
    [ USER_SEND_DELIVERY ]: {
        method: 'POST',
        url: '/api/auth/user/frontend/settings/',
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },
    [ USER_GET_DELIVERY ]: {
        method: 'GET',
        url: '/api/auth/user/frontend/settings/own/',
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },
    [ PRODUCT_GET_THEME_DATA ]: {
        method: 'GET',
        url: '/api/gallery/groupproduct/'
    },

    [ PRODUCT_CREATE_POSTER ]: {
        method: 'POST',
        url: '/createPoster/',
        fake: true,
    },
    [ ADMIN_GET_PRODUCTS_LIST ]: {
        method: 'GET',
        url: '/getProducts/',
        fake: true,
    },
    [ ADMIN_GET_PRODUCT ]: {
        method: 'GET',
        url: '/getposters/',
        fake: true,
    },

    [ GIFT_CARD_SET ]: {
        method: 'POST',
        url: '/order/gift_card/',
        failRetry: 5, //число попыток получить данные
        failRetryInterval: 1000, //интервалы попыток получения данных
    },

    /**
     * Редактор
     */
    [ EDITOR_GET_PHOTOS_LIBRARY ]: {
        method: 'GET',
        url: '/api/fake/photos/',
        fake: true,
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ EDITOR_GET_THEMES_LIBRARY ]: {
        method: 'GET',
        url: '/api/fake/themes/',
        fake: true,
    },

    /**
     * Витрина
     */
    [ SHOP_GET_PRODUCTSET ]: {
        method: 'GET',
        url: '/api/shop/productset/',
        // fake: true,
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ SHOP_GET_PRODUCTSETS_PAGE ]: {
        method: 'GET',
        url: '/api/shop/productset/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ SHOP_GET_PRODUCTSET_CATEGORIES ]: {
        method: 'GET',
        url: '/api/shop/category/',
        // fake: true,
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ SHOP_GET_FILTERS ]: {
        method: 'GET',
        url: '/api/shop/productset/filter_data/',
        // fake: true,
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ SHOP_BUY_PRODUCT ]: {
        method: 'POST',
        url: '/api/shop/productset/',
        // fake: true,
        failRetry: 5,
        failRetryInterval: 1000,
    },
    /**
     * Витрина дизайнера
     */
    [ MY_SHOP_GET_PRODUCTSET ]: {
        method: 'GET',
        url: '/api/shop/myproductset/',
        // fake: true,
        failRetry: 5,
        failRetryInterval: 1000,
    },

    [ MY_SHOP_GET_PRODUCTSETS_PAGE ]: {
        method: 'GET',
        url: '/api/shop/myproductset/',
        // fake: true,
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ MY_SHOP_PRODUCTSET_CREATE ]: {
        method: 'POST',
        url: '/api/shop/myproductset/',
        // fake: true,
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ MY_SHOP_PRODUCTSET_CHANGE_STATUS ]: {
        method: 'POST',
        url: '/api/shop/myproductset/',
        // fake: true,
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ MY_SHOP_PRODUCTSET_UPDATE ]: {
        method: 'PUT',
        url: '/api/shop/myproductset/',
        // fake: true,
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ MY_SHOP_PRODUCTSET_DELETE ]: {
        method: 'DELETE',
        url: '/api/shop/myproductset/',
        // fake: true,
        failRetry: 5,
        failRetryInterval: 1000,
    },

    /**
     * Админка стикеров
     */
    [ ADMIN_STICKERS_GET_STICKERS]: {
        method: 'GET',
        url: '/api/sticker-set/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_STICKERS_GET_STICKER_PACK]: {
        method: 'GET',
        url: '/api/sticker-set/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_STICKERS_STICKER_PACK_CREATE]: {
        method: 'POST',
        url: '/api/sticker-set/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_STICKERS_STICKER_PACK_UPDATE]: {
        method: 'PUT',
        url: '/api/sticker-set/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_STICKERS_STICKER_PACK_DELETE]: {
        method: 'DELETE',
        url: '/api/sticker-set/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_STICKERS_STICKER_PACK_SORT]: {
        method: 'POST',
        url: '/api/sticker-set/bulk/change_sort/',
        failRetry: 5,
        failRetryInterval: 1000,
    },

    [ ADMIN_STICKERS_STICKER_UPLOAD]: {
        method: 'POST',
        url: '/api/sticker/upload/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_STICKERS_STICKER_SORT]: {
        method: 'POST',
        url: '/api/sticker/bulk/change_sort/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_STICKERS_MOVE_STICKERS]: {
        method: 'POST',
        url: '/api/sticker/bulk/update/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_STICKERS_STICKER_UPDATE]: {
        method: 'PUT',
        url: '/api/sticker/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_STICKERS_STICKER_DELETE]: {
        method: 'DELETE',
        url: '/api/sticker/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_THEME_STICKER_DELETE]: {
        method: 'DELETE',
        url: '/api/sticker-set/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_STICKERS_BULK_DELETE]: {
        method: 'POST',
        url: '/api/sticker/bulk/delete/',
        failRetry: 5,
        failRetryInterval: 1000,
    },

    [ THEMES_GET_THEMES]: {
        method: 'GET',
        url: '/api/get_themes',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ THEMES_GET_THEMES]: {
        method: 'GET',
        url: '/api/theme2/my-theme/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ THEMES_GET_PUBLISHED_THEMES]: {
        method: 'GET',
        url: '/api/theme2/all-theme/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ THEMES_GET_FILTER_DATA]: {
        method: 'GET',
        url: '/api/theme2/all-theme/filter_data/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ THEMES_CREATE_NEW_THEME]: {
        method: 'POST',
        url: '/api/theme2/my-theme/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ THEMES_GET_ADMIN_CATEGORIES]: {
        method: 'GET',
        url: '/api/theme2/theme-category/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ THEMES_GET_ADMIN_PRODUCT_GROUP]: {
        method: 'GET',
        url: '/api/theme2/product-group/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ THEMES_CREATE_CATEGORY]: {
        method: 'POST',
        url: '/api/theme2/theme-category/',
        failRetry: 5,
        failRetryInterval: 1000,
    },

    [ THEMES_GET_THEME_DATA]: {
        method: 'GET',
        url: '/api/theme2/all-theme/',
        failRetry: 5,
        failRetryInterval: 1000,
    },

    [ ADMIN_THEME_GET_DATA]: {
        method: 'GET',
        url: '/api/theme2/my-theme/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_THEME_UPDATE]: {
        method: 'PUT',
        url: '/api/theme2/my-theme/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_THEME_DELETE]: {
        method: 'DELETE',
        url: '/api/theme2/my-theme/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_CHANGE_THEME_STATUS]: {
        method: 'POST',
        url: '/api/theme2/my-theme/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ THEMES_COPY_THEME ]: {
        method: 'POST',
        url: '/api/theme2/my-theme/',
        failRetry: 5,
        failRetryInterval: 1000,
    },

    /**
     * Админка фонов
     */
    [ ADMIN_BACKGROUNDS_GET_BACKGROUNDS]: {
        method: 'GET',
        url: '/api/background-set/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_BACKGROUNDS_GET_BACKGROUND_PACK]: {
        method: 'GET',
        url: '/api/background-set/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_BACKGROUNDS_BACKGROUND_PACK_CREATE]: {
        method: 'POST',
        url: '/api/background-set/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_BACKGROUNDS_BACKGROUND_PACK_UPDATE]: {
        method: 'PUT',
        url: '/api/background-set/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_BACKGROUNDS_BACKGROUND_PACK_DELETE]: {
        method: 'DELETE',
        url: '/api/background-set/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_BACKGROUNDS_BACKGROUND_PACK_SORT]: {
        method: 'POST',
        url: '/api/background-set/bulk/change_sort/',
        failRetry: 5,
        failRetryInterval: 1000,
    },

    [ ADMIN_BACKGROUNDS_BACKGROUND_UPLOAD]: {
        method: 'POST',
        url: '/api/background/upload/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_BACKGROUNDS_BACKGROUND_SORT]: {
        method: 'POST',
        url: '/api/background/bulk/change_sort/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_BACKGROUNDS_MOVE_BACKGROUNDS]: {
        method: 'POST',
        url: '/api/background/bulk/update/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_BACKGROUNDS_BACKGROUND_UPDATE]: {
        method: 'PUT',
        url: '/api/background/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_BACKGROUNDS_BACKGROUND_DELETE]: {
        method: 'DELETE',
        url: '/api/background/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_THEME_BACKGROUND_DELETE]: {
        method: 'DELETE',
        url: '/api/background-set/',
        failRetry: 5,
        failRetryInterval: 1000,
    },
    [ ADMIN_BACKGROUNDS_BULK_DELETE]: {
        method: 'POST',
        url: '/api/background/bulk/delete/',
        failRetry: 5,
        failRetryInterval: 1000,
    },

    //url: '/api/ua/product/' + product_id + '/generate-layout/
};
export { apiList };