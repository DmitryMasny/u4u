import createReducer from "./createReducer";

import {
    ADMIN_DESELECT_PRODUCT,
    ADMIN_SET_PRODUCTS_LIST,
    ADMIN_SET_PRODUCT,
    PRODUCT_PUT_OPTIONS,
    PRODUCT_PUT_OPTION_CATEGORIES,
    PRODUCT_PUT_OPTIONS_TYPES,
    PRODUCT_UPDATE_OPTION_PARAMS,
    ADMIN_DISABLE_NAV,
    ADMIN_PHOTOS_SET_PHOTO,
    ADMIN_PHOTOS_REMOVE_PHOTO,
    ADMIN_SET_AVAIBLE_PRODUCTS_TYPES,
    ADMIN_SET_AVAIBLE_PRODUCTS_GROUPS,
    PRODUCT_SET_OPTIONS_BUFFER,
    PRODUCT_SET_FORMATS_BUFFER,
    ADMIN_SET_PRODUCTS_LIST_PROGRESS
} from 'const/actionTypes';

export default createReducer(
    {
        productList: null,
        productListInProgress: false,
        currentProduct: null,
        allOptions: null,
        allOptionParamsTypes: null,
        disableNav: false,
        productImages: [],
        productTypes: null,
        productGroups: null,
        optionsBuffer: [],
        formatsBuffer: [],
    },
    {
        // Назад ко всем продуктам
        [ADMIN_DESELECT_PRODUCT]:
            (state) => {
                return ({...state, currentProduct: null})
            },
        // Запись свойств выбранного продукта
        [ADMIN_SET_PRODUCT]:
            (state, { payload }) => {
                return ({...state, currentProduct: payload })
            },
        // Запись списка всех продуктов
        [ADMIN_SET_PRODUCTS_LIST_PROGRESS]:
            (state, { payload }) => {
                return ({...state, productListInProgress: !!payload})
            },
        // Запись списка всех продуктов
        [ADMIN_SET_PRODUCTS_LIST]:
            (state, { payload }) => {
                return ({...state, productList: payload ? {...state.productList, ...payload} : null , productListInProgress: false})
            },
        // Запись списка всех опций
        [ PRODUCT_PUT_OPTIONS ]:
            ( state, { payload } ) => {
                return { ...state,
                    allOptions: payload ?
                        (state.allOptions && state.allOptions.length ? state.allOptions.map((cat)=>{
                            for (let i = 0; i < payload.length; i++) {
                                if (cat.id === payload[i].id ) {
                                    if (!payload[i].parameters || !payload[i].parameters.length) payload[i].parameters = [];
                                    return payload[i]
                                }
                            }
                            return cat;
                        }) : payload)
                        : payload };
            },
        // Запись списка всех категорий опций
        [ PRODUCT_PUT_OPTION_CATEGORIES ]:
            ( state, { payload } ) => {
                return { ...state, allOptions: payload ? [
                    ...(state.allOptions ? state.allOptions : []),
                    ...payload.map((cat)=>{
                        let isExist = false;
                        if (state.allOptions && state.allOptions.length) {
                            for (let i = 0; i < state.allOptions.length; i++) {
                                if (cat.id === state.allOptions[i].id ) {
                                    isExist = true;
                                    break;
                                }
                            }
                        }
                        if (!isExist && (!cat.parameters || !cat.parameters.length)) cat.parameters = [];
                        return !isExist && cat;// Если в опциях нет такой категории, то добавляем
                    }).filter((item)=>item)
                    ] : payload };
            },
        // Запись списка всех типов параметров опций
        [ PRODUCT_PUT_OPTIONS_TYPES ]:
            ( state, { payload } ) => {
                return { ...state, allOptionParamsTypes: payload };
            },
        // Обновление параметра опции
        [ PRODUCT_UPDATE_OPTION_PARAMS ]:
            ( state, { payload } ) => {
                return { ...state, allOptions: state.allOptions.map(
                    (option)=> option.id === payload.optionCategoryId ?
                        {
                            ...option,
                            parameters: [ ...option.parameters, ...payload.updateList ]
                        }
                        : option
                    )};
            },
        // Обновление параметра опции
        [ ADMIN_DISABLE_NAV ]:
            ( state, { payload } ) => {
                return { ...state, disableNav: !!payload };
            },
        // Запись изображения продукта
        [ ADMIN_PHOTOS_SET_PHOTO ]:
            ( state, { payload } ) => {
                return payload.photoId && payload.data ?
                { ...state, productImages: payload ? [...state.productImages, {id: payload.photoId, url: payload.data.url, size:  payload.data.size }] : []}
                : state;
            },
        // Удаление изображения продукта из буфера
        [ ADMIN_PHOTOS_REMOVE_PHOTO ]:
            ( state, { payload } ) => {
                return { ...state,
                    productImages: state.productImages.filter((item)=>item.id !== payload)
                };
            },
        // Запись доступные типы продуктов
        [ ADMIN_SET_AVAIBLE_PRODUCTS_TYPES ]:
            ( state, { payload } ) => {
                return { ...state,
                    productTypes: payload
                };
            },
        // Запись доступные типы продуктов
        [ ADMIN_SET_AVAIBLE_PRODUCTS_GROUPS ]:
            ( state, { payload } ) => {
                return { ...state,
                    productGroups: payload
                };
            },
        // Запись опций формата в буфер
        [ PRODUCT_SET_OPTIONS_BUFFER ]:
            ( state, { payload } ) => {
                return { ...state,
                    optionsBuffer: payload
                };
            },
        // Запись формата в буфер
        [ PRODUCT_SET_FORMATS_BUFFER ]:
            ( state, { payload } ) => {
                return { ...state,
                    formatsBuffer: payload
                };
            },
        // // Назад ко всем продуктам
        // [ADMIN_PRODUCT_SELECT_TAB]:
        //     (state, { payload }) => {
        //         return ({...state, tab: payload})
        //     },

    }
);