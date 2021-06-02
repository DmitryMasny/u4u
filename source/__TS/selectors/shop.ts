
// // @ts-ignore
// import { store } from "components/App";
// // import {getProductSetsPage} from "../actions/shop";
// //получаем диспетчер Redux
// const dispatch = store.dispatch;

import {userProductDataAdapter} from "../adapters/shop";

/**
 * myShop
 */
export const currentProductSetSelector = ( state: any ): any => state.myShop.currentProductSet;
export const myShopPagesSelector = ( state: any ): any => state.myShop.pages;
export const myShopCurrentPageSelector = ( state: any ): any => {
    if ( !state.myShop.productSets ) return null;
    return state.myShop.productSets[ state.myShop.pages.current ];
};


/**
 * Shop
 */
export const selectedCategorySelector = ( state: any ): string => state.shop.selectedCategory || 0;
export const selectedProductTypeSelector = ( state: any ): string => state.shop.selectedProductType || 0;
export const selectedFormatSelector = ( state: any ): string => state.shop.selectedFormat || 0;
export const selectedPageSelector = ( state: any ): number => state.shop.selectedPage || 1;

export const currentProductSetsListSelector = ( state: any ): any => {
    if (!state.shop.productSets) return { content: null, totalPages: 0};
    let key = 'category:' + (state.shop.selectedCategory || 0) + '-productType:' + (state.shop.selectedProductType || 0) + '-format:' + (state.shop.selectedFormat || 0) + '-page:' + (state.shop.selectedPage || 1);
    // if ( specProject ) key += '-spec:' + specProject;
    return state.shop.productSets[ key ] || { content: null, totalPages: 999};
};

export const currentProductsetSelector = ( state: any, id: string ): any => {
    if (!id) return null;
    return state.shop.currentProductSets[ id ] || null;
};

export const productSetCategoriesSelector = ( state: any ): any => state.shop.categories;

export const filtersCategoriesSelector = ( state: any ): any => state.shop.filterData.categories;
export const filtersProductTypesSelector = ( state: any ): any => state.shop.filterData.productTypes;
export const filtersFormatsSelector = ( state: any ): any => state.shop.filterData.formats;


/**
 * Other
 */
export const windowIsMobileSelector = ( state: any ): boolean => state.global.windowIsMobile;

export const userProductsSelector = ( state: any ): any => userProductDataAdapter(state.myProducts.new);
