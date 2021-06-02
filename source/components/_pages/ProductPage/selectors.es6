//import { PRODUCT_TYPE_POSTER } from 'const/productsTypes'
import { productGetProductsFromServerAction } from "__TS/actions/products";

let receivingProducts = false;

//получение всех типов продуктов
export const productsSelector = ( state, type ) => {
    //if (state.products[ type ]) {
    //    receivingProducts = false;
    //}
    if (!type) return state.products && state.products.all;

    //если нет продуктов указанных типов в type (массив или строка)
    let isProducts = false;
    if ( Array.isArray( type ) ) {
        const typesLength = type.filter( t => state.products[ t ] );
        isProducts = !!typesLength;
    } else {
        isProducts = state.products[ type ];
    }

    if ( !isProducts ) {
        //запускаем получение продуктов
        if ( !receivingProducts ) {
            receivingProducts = true;
            productGetProductsFromServerAction();
        }
        return null;
    }

    if ( Array.isArray( type ) ) {
        let resultArr = [];

        type.map( t => {
            if ( state.products[ t ] ) resultArr.push( ...state.products[ t ]);
        });

        let resArrFiltered = [];
        resultArr.forEach(item => {
            const i = resArrFiltered.findIndex( x => x.id === item.id );
            if ( i <= -1 ) {
                resArrFiltered.push( item );
            }
        });

        return resArrFiltered;
    }
    return state.products[ type ];
};

//получение выбранного типа переплета
export const productCurrentTypeSelector = state => state.product.currentType;

//получение формата продукта
export const productFormatSelector = state => state.product.currentFormat;

//получение кол-ва страниц продукта
export const productPagesSelector = state => state.product.pages;

//получение ламинации продукта
export const productGlossSelector = state => state.product.gloss;

//
export const productsSavedDataSelector = state => state.products.selectedData;
export const themeSavedDataSelector = state => state.products.selectedTheme;

//получение выбранных данных продукта
export const productsSelectedSelector = (state, type) => state.products.selected[type];

//получение всех опций (TEMP)
export const optionsSelector = (state) => state.products.options;

//получение превью темы по формату
export const productsSelectedThemeSelector = (state, type, formatId) => {
    const productSelected = state.products.selected[type];

    if (!productSelected || !productSelected.theme) return null;

    const groupId = productSelected.groupId;

    if (!formatId) formatId = productSelected.formatId;

    return productSelected.theme[`preview_format_${groupId}_${formatId}`];
};

//получение id группы выбранного продукта
export const productsSelectedGroupIdSelector = (state, type) => {
    const productSelected = state.products.selected[type];

    if ( !productSelected || !productSelected.theme ) return null;

    return productSelected.groupId;
};
//получение id группы выбранного продукта
export const productsSelectedLoadingThemesSelector = ( state, type ) => {
    const productSelected = state.products.selected[ type ];
    if ( !productSelected ) return null;

    return productSelected.loadingThemes;
};
//получение выбранной темы
export const selectedThemeSelector = ( state ) => state.themes.selectedTheme;