import createReducer from "./createReducer";

import {
    SHOP_SET_PRODUCTSETS_PAGE,
    SHOP_SET_PRODUCTSET,
    SHOP_SET_PRODUCTSET_CATEGORIES,
    SHOP_SET_FILTERS,
    SHOP_PUT_FILTERS,
    ALL_SHOP_CLEAR_DATA
} from 'const/actionTypes';

const ELEMENTS_PER_PAGE = 20;

/**
 * Страница МАГАЗИН
 */
export default createReducer(
    {
        productSets: {},    // Страницы витрины
        currentProductSets: {},    // Товары витрины
        categories: null,

        filterData: {},

        selectedPage: 1,
        selectedCategory: null,
        selectedProductType: null,
        selectedFormat: null,
        selectedOptions: null,
    },
    {
        // Запись страницы витрины дизайнера
        [SHOP_SET_PRODUCTSETS_PAGE]:
            (state, { payload }) => {

                const totalPages = Math.ceil((payload.totalElements || 0) / ELEMENTS_PER_PAGE);
                const selectedPage = payload.currentPage || state.selectedPage || 1;

                // console.log('--->', {
                //     totalPages, selectedPage, totalPages2:  Math.min(totalPages, selectedPage)
                // })
                return ({
                    ...state, productSets: {
                        ...state.productSets,
                        [payload.key]: {
                            content: payload.results || [],
                            totalPages: totalPages,
                        },
                    },
                    selectedPage: totalPages ? Math.min(totalPages, selectedPage) : state.selectedPage,
                })
            },

        // Запись товара витрины дизайнера
        [SHOP_SET_PRODUCTSET]:
            (state, { payload }) => {
                // console.log('SHOP_SET_PRODUCTSET payload',payload);
                return ({...state, currentProductSets: {...state.currentProductSets, [payload.id]: payload } })
            },

        // Запись категорий
        [SHOP_SET_PRODUCTSET_CATEGORIES]:
            (state, { payload }) => {
                // console.log('SHOP_SET_PRODUCTSET_CATEGORIES payload',payload);
                const selected = payload && !state.selectedCategory;//выбрать первую категорию, если никакая не выбрана
                return ({...state, categories: payload, ...(selected ? {selectedCategory: payload[0].slug} : {})})
            },

        // Запись фильтров в магазине
        [SHOP_PUT_FILTERS]:
            (state, { payload }) => {
                // console.log('SHOP_PUT_FILTERS payload',payload);
                return ({
                    ...state,
                    filterData: {
                        categories: payload.category,
                        productTypes: payload.productSlug,
                        formats: payload.formatSlug
                    }
                })
            },
        // Запись фильтров и текущей страницы
        [SHOP_SET_FILTERS]:
            (state, { payload }) => {
                return ({
                    ...state,
                    selectedCategory: payload.category || 0,
                    selectedProductType: payload.productType || 0,
                    selectedFormat: payload.format || 0,
                    selectedPage: parseInt(payload.page) || 1,
                })
            },
        // Очистить магазин
        [ALL_SHOP_CLEAR_DATA]:
            (state, { payload }) => {
                return ({...state, productSets: {}, currentProductSets: {}})
            },
    }
);