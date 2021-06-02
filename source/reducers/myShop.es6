import createReducer from "./createReducer";

import {
    MY_SHOP_SET_PRODUCTSETS_PAGE,
    MY_SHOP_SET_PAGE,
    MY_SHOP_SET_PRODUCTSET,
    MY_SHOP_CLEAR_DATA,
    ALL_SHOP_CLEAR_DATA,
} from 'const/actionTypes';


const ELEMENTS_PER_PAGE = 20;

/**
 * Админка "МОЙ МАГАЗИН"
 */
export default createReducer(
    {
        productSets: {},
        currentProductSet: null,
        pages: {
            total: 0,
            current: 1
        },
    },
    {
        // Запись страницы витрины дизайнера
        [MY_SHOP_SET_PRODUCTSETS_PAGE]:
            (state, { payload }) => {
                const totalPages = Math.ceil((payload.totalElements || 0) / ELEMENTS_PER_PAGE) || 1;

                return ({
                    ...state, productSets: {
                        ...state.productSets,
                        [payload.page]: payload.results || [],
                    },
                    pages: {
                        total: totalPages || 1,
                        current: Math.min(totalPages, state.pages.current || 1)
                    }
                })
            },

        // Запись текущей страницы
        [MY_SHOP_SET_PAGE]:
            (state, { payload }) => {
                return ({
                    ...state,
                    pages: {
                        ...state.pages,
                        current: payload || 1
                    }
                })
            },

        // Запись товара витрины дизайнера
        [MY_SHOP_SET_PRODUCTSET]:
            (state, { payload }) => {
            // console.log('MY_SHOP_SET_PRODUCTSET payload',payload);
                return ({...state, currentProductSet: payload})
            },

        // Очистить текущую коллекцию и страницу коллекций
        [MY_SHOP_CLEAR_DATA]:
            (state, { payload }) => {
                return ({...state, currentProductSet: null, productSets: {}})
            },
        [ALL_SHOP_CLEAR_DATA]:
            (state, { payload }) => {
                return ({...state, currentProductSet: null, productSets: {}})
            },

    }
);