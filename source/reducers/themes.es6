import {
    SET_SPEC_PROJECT,
    THEMES_GET_THEMES,
    THEMES_SET_CATEGORIES,
    THEMES_PUT_THEMES,
    THEMES_SET_FILTER_DATA,
    THEMES_SET_ADMIN_CATEGORIES,
    MODAL_SIMPLE_PREVIEW,
    THEMES_CLEAR,
    ADMIN_THEME_PUT_DATA,
    ADMIN_THEME_CLEAR,
    THEMES_PUT_THEME_DATA,
    THEMES_PUT_THEME_FORMATS,
    THEMES_PUT_THEME_FORMAT,
    THEMES_SET_ADMIN_PRODUCT_GROUP
} from 'const/actionTypes';
import createReducer from "./createReducer";


export default createReducer(
    {
        themes: {},                 //Объект тем по фильтрам и страницам
        productTypesList: null,     //Список типов продуктов тем
        adminCategoriesList: null,  //Список всех категорий тем for admin
        adminProductGroupList: null,//Список всех групп продуктов for admin
        categoriesList: {},         //Список категорий тем
        formatsList: {},            //Список форматов
        editThemeData: null,        //Содержимое темы для админа
        inProgress: false,          //загрузка
        specProject: ''             //Спецпроект
    },
    {
        [SET_SPEC_PROJECT]:
            (state, {payload}) => ({ ...state,
                specProject: payload,
            }),
        [THEMES_GET_THEMES]:
            (state, {payload}) => ({ ...state, inProgress: true }),

        [THEMES_SET_CATEGORIES]:
            (state, {payload}) => ({...state, categories: payload}),

        [THEMES_SET_ADMIN_CATEGORIES]:
            (state, {payload}) => ({ ...state, adminCategoriesList: payload.map((item)=>({id: item.slug, name: item.name})) }),

        [THEMES_SET_ADMIN_PRODUCT_GROUP]:
            (state, {payload}) => ({ ...state, adminProductGroupList: payload.map((item)=>({id: item.slug, name: item.name})) }),

        [THEMES_SET_FILTER_DATA]:
            (state, {payload}) => {
                if (!payload || !payload.data ) return state;

                const productTypesList = !state.productTypesList && payload.data.productGroup ? {productTypesList: payload.data.productGroup.map((item)=>({id: item.queryValue, name: item.verboseName}))} : {};

                if (!payload.id && !state.productTypesList) return {
                    ...state,
                    ...productTypesList,
                }

                return {
                    ...state,
                    ...productTypesList,
                    categoriesList: {
                        ...state.categoriesList,
                        [payload.id]: payload.data.category.map((item)=>({id: item.queryValue, name: item.verboseName}))
                    },
                    formatsList: {
                        ...state.formatsList,
                        [payload.id]: payload.data.formatSlug.map((item)=>({id: item.queryValue, name: item.verboseName}))
                    },
                }
            },

        [THEMES_PUT_THEMES]:
            (state, {payload}) => {
                if (payload.pageData === 'inProgress') return {
                    ...state,
                    inProgress: true,
                    themes: {...state.themes, [payload.key]: payload.pageData}
                };
                const data = payload.pageData.map((i)=> {
                    i.random = Math.random();
                    return i;
                });
                let newThemes = {
                    [payload.key]: {
                        data: data,
                        totalElements: payload.totalElements,
                        // time: + new Date()
                    }
                };
                return {
                    ...state,
                    inProgress: false,
                    themes: {...state.themes, ...newThemes}
                };
            },

        // Запись темы
        [ADMIN_THEME_PUT_DATA]:
            (state, { payload }) => {
                if (payload && payload.error) return state;
                return ({
                    ...state,
                    editThemeData: payload
                })
            },
        // Запись форматов темы
        [THEMES_PUT_THEME_FORMATS]:
            (state, { payload }) => {
                if (payload && payload.error) return state;
                return ({
                    ...state,
                    editThemeData: {
                        ...state.editThemeData,
                        themeFormats: payload
                    }
                })
            },
        // Перезапись конкретного формата
        [THEMES_PUT_THEME_FORMAT]:
            (state, { payload }) => {
                // console.log('THEMES_PUT_THEME_FORMAT', {payload, editThemeData: state.editThemeData});
                const findAndReplaceFormat = (item) =>
                    (
                        item.layoutId ?
                            item.layoutId === payload.id
                            :
                            (payload.format && `${payload.format.width}_${payload.format.height}` === item.formatSlug)
                    ) ? payload : item

                return ({
                    ...state,
                    editThemeData: {
                        ...state.editThemeData,
                        themeFormats: state.editThemeData.themeFormats.map(findAndReplaceFormat)
                    }
                })
            },
        // Очистка данных темы
        [THEMES_CLEAR]:
            (state, { payload }) => {
                return ({
                    ...state,
                    themes: {}
                })
            },
        // Очистка данных темы
        [ADMIN_THEME_CLEAR]:
            (state, { payload }) => {
                return ({
                    ...state,
                    editThemeData: null
                })
            },

        // Очистка данных темы
        [THEMES_PUT_THEME_DATA]:
            (state, { payload }) => {
                return ({
                    ...state,
                    selectedTheme: payload
                })
            },

    }
);