import Links from 'config/links';
import SEO, { seoDefault } from 'texts/seo';

export { seoDefault };

/**
 * Формируем маппинг URL и с параметрами для SEO
 */
const seoData = (() => {

    return {
        [Links.INDEX] : SEO.index,
        [`textId_1_${Links.INDEX}`] : SEO['index_textId_1'],
        [`textId_2_${Links.INDEX}`] : SEO['index_textId_2'],
        [`textId_3_${Links.INDEX}`] : SEO['index_textId_3'],
        [`textId_4_${Links.INDEX}`] : SEO['index_textId_4'],
        [`textId_5_${Links.INDEX}`] : SEO['index_textId_5'],
        [Links.PRICES] : SEO.calc,
        [Links.PHOTOBOOKS.replace(':coverType-:bindingType', 'hard-glue')]   : SEO.photoBookHardGlue,
        [Links.PHOTOBOOKS.replace(':coverType-:bindingType', 'soft-glue')]   : SEO.photoBookSoftGlue,
        [Links.PHOTOBOOKS.replace(':coverType-:bindingType', 'hard-spring')] : SEO.photoBookHardSpring,
        [Links.PHOTOBOOKS.replace(':coverType-:bindingType', 'soft-spring')] : SEO.photoBookSoftSpring,
        [Links.PHOTOBOOKS.replace(':coverType-:bindingType', 'soft-clip')]   : SEO.photoBookSoftClip,
        [Links.GALLERY.replace(':categoryId?', '')] : SEO.themes,
        [`textId_1_${Links.GALLERY.replace(':categoryId?', '')}`] : SEO['themes_textId_1'],
        [Links.INFO_ABOUT_COMPANY] : SEO.aboutUs,
        [Links.INFO_DELIVERY] : SEO.delivery,
        [Links.SALES_MAIN] : SEO.sales,
        [Links.HELP.replace(':tab', 'start')] : SEO.helpStart,
        [Links.HELP.replace(':tab', 'redaktor')] : SEO.helpEditor,
        [Links.HELP.replace(':tab', 'photo-upload')] : SEO.helpPhotoUpload,
        [Links.HELP.replace(':tab', 'photo-edit')] : SEO.helpPhotoEditor,
        [Links.HELP.replace(':tab', 'text-edit')] : SEO.helpText,
        [Links.HELP.replace(':tab', 'pages-edit')] : SEO.helpPages,
        [Links.HELP.replace(':tab', 'binding')] : SEO.helpBingingChoice,
        [Links.HELP.replace(':tab', 'order')] : SEO.helpCart,
        [Links.HELP.replace(':tab', 'uvedomleniya')] : SEO.helpNotifications,
        [Links.HELP.replace(':tab', 'promo')] : SEO.helpPromo,
        [Links.REQUISITES] : SEO.requisites,
        [Links.PUBLIC_OFFER] : SEO.offer,
        [Links.POSTERS.replace(':productType?','4')] : SEO.posters,
        [Links.POSTERS.replace(':productType?','6')] : SEO.posters,
        [Links.PHOTOS.replace(':productType?', '5')] : SEO.photo,
        [Links.PHOTOS.replace(':productType?', '7')] : SEO.photo,
        [Links.CANVASES.replace(':productType?', '8')] : SEO.canvases,
        [Links.SHOP_MAIN] : SEO.shop
    };

})();

const seo = ( url, textId ) => {
    let urlD = url;

    //если есть данные seo, удалим их
    const seoStartIndex = url.indexOf( '/c=' );
    if ( ~seoStartIndex ) {
        urlD = urlD.substring( seoStartIndex, -1 );
    }

    if ( textId ) {
        const prefix = `textId_${textId}_`;
        return seoData[ prefix + urlD ] || seoData[ prefix + Links.INDEX ];
    }

    //для галлереи убираем id категории
    const themesLink = Links.GALLERY.replace( ':categoryId?', '' );
    if ( ~urlD.indexOf( themesLink ) ) {
        urlD = themesLink;
    }

    return seoData[ urlD ] || seoData[ Links.INDEX ];
};

export default seo;