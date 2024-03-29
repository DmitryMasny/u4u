import { MY_PHOTOS_IFRAME } from 'const/myPhotos';

export default {
    INDEX:                  '/',
    INDEX_SEO:              ['/c/:seo+', '/c=:seo+', '/s=:seo+'],
    PRICES:                 '/kalkulyator/',
    GALLERY:                '/sozdat-fotoknigu/:categoryId?',
    GALLERY_SEO:            ['/sozdat-fotoknigu/:categoryId?/c/:seo+/',
                             '/sozdat-fotoknigu/:categoryId?/c=:seo+/',
                             '/sozdat-fotoknigu/:categoryId?/s=:seo+/'],
    GALLERY_B64:            '/sozdat-fotoknigu/:categoryId?/:b64+',
    PHOTOBOOKS:             '/fotoknigi/:coverType-:bindingType/',
    PRODUCT:                '/product/:productType?/:format?/:themeId?',
    POSTERS:                '/postery/:productType?',
    POSTERS_SEO:            ['/postery/:productType?/c/:seo+',
                             '/postery/:productType?/c=:seo+',
                             '/postery/:productType?/s=:seo+'],
    PHOTOS:                 '/photo/:productType?',
    CANVASES:               '/canvas/:productType?',
    POSTER_EDITOR:          '/poster-edit/:posterId',
    GIFT_CARD:              '/gift-card/:nominal&:design?',
    GIFT_CARD_MAIN:         '/gift-card/',
    PAYMENT_DECLINED:       '/gift_card_decline',
    PAYMENT_ACCEPTED:       '/gift_card_success',
    EDIT:                   '/edit/:productId/:themeParams?',
    SHOP:                   '/shop/:productId/:page/:category/:productType/:format',
    SHOP_MAIN:              '/shop/',
    MY_SHOP:                '/my-shop/:productId',
    MY_SHOP_MAIN:           '/my-shop/',

    MY_PRODUCTS_MAIN:       '/myproducts/',
    MY_PRODUCTS:            '/myproducts/:tab',

    MY_PHOTOS_MAIN:         '/myphotos/',
    MY_PHOTOS_IFRAME:       '/myphotos/' + MY_PHOTOS_IFRAME,
    MY_PHOTOS:              '/myphotos/:tab',

    PROFILE_MAIN:           '/profile/',
    PROFILE:                '/profile/:tab',
    EDITOR:                 '/editor/',
    INFO:                   '/info/',
    INFO_CONTACTS:          '/info/kontakty/',
    INFO_ABOUT_COMPANY:     '/info/o-kompanii/',
    // INFO_ONLINE_EDITOR:     '/info/redaktor/',
    // INFO_NOTIFICATIONS:     '/info/sms-i-email-uvedomleniya/',
    INFO_DELIVERY:          '/info/dostavka-i-oplata/',
    // INFO_PRICES:            '/info/ceny-i-razmery/',
    HELP_MAIN:              '/pomosch/',
    HELP:                   '/pomosch/:tab',
    REQUISITES:             '/requisites/',
    PUBLIC_OFFER:           '/offer/',
    ICONS_PAGE:             '/icons/',
    BLOG_MAIN:              '/blog/',
    BLOG:                   '/blog/:post',
    SALES_MAIN:             '/sales/',
    SALES:                  '/sales/:post',

    THEMES:                  '/themes/:productType/:format/:category?/:page?/:themeId?',
    THEMES_MAIN:             '/themes/',

    PHONE:                  'tel:+74952588646',
    PHONE2:                 'tel:+79255169899',
    SOC_FACEBOOK:           'https://www.facebook.com/u4u.ru',
    SOC_VK:                 'https://www.vk.com/u_4_u',
    SOC_INST:               'https://www.instagram.com/u4u.ru',

    ADMIN:                  '/admin/',
    ADMIN_PRODUCTS:         '/admin/products/:productId?/:tab?/:format?/',
    ADMIN_PRODUCTS_MAIN:    '/admin/products/',
    ADMIN_THEMES_MAIN:      '/admin/themes/',
    ADMIN_THEMES:           '/admin/themes/:productType/:format/:category/:page?/:themeId?',
    ADMIN_STICKERS:         '/admin/stickers/',
    ADMIN_BACKGROUNDS:      '/admin/backgrounds/',
    ADMIN_FRAMES:           '/admin/frames/',
    ADMIN_FONTS:            '/admin/fonts/',
    ADMIN_STYLES:           '/admin/styles/',
    ADMIN_OPTIONS:          '/admin/options/',
    NOT_FOUND:              '/404/',
}