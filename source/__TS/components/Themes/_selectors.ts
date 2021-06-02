// import {IThemes, ITheme } from "./_interfaces";
import { createThemesKey } from "./_config";
import { getThemesFromServerAction, getFilterDataAction, getAdminCategoriesAction, getAdminProductGroupAction } from "./_actions";


export const themesSpecProjectSelector = ( state ) => state.themes.specProject;

export const themesInProgressSelector = state => state.themes.inProgress;


let isReceivingThemes = false;
let isReceivingThemeFilters = false;
let isReceivingThemeProductGroups = false;
let isReceivingAdminCategories = false;
let isReceivingAdminProductGroup = false;

const checkData = ( {data, params} ) => {
    // console.log('checkData', {data, params, isReceivingThemes});
    if (data && data.data) {
        isReceivingThemes = false;
        return data.data;
    } else if (!isReceivingThemes && params.productType && (params.format || params.isAdmin)) {
        isReceivingThemes = true;
        getThemesFromServerAction(params);
    }
    return null;

    // if (data && data.data && data.time) {
    //     const currentTime = + new Date();
    //
    //     //console.log('Данные устарели на ', new Date(currentTime - data.time).getMinutes(), ' минут (порог 10 минут)');
    //     if (new Date(currentTime - data.time).getMinutes() < 1) { //если прошло не больше 10 минут
    //         return data.data
    //     }
    // }
    // return null;
};

const checkFiltersData = ( data, productGroupId = '', isProductGroup = false ) => {
    // console.log('checkFiltersData', {data, productGroupId, isProductGroup});
    if (!productGroupId && !isProductGroup) return null;
    if (isProductGroup) {
        if ( data ) {
            // isReceivingThemeProductGroups = false;
            return data;
        }
        // else if (!isReceivingThemeProductGroups) {
        //     isReceivingThemeProductGroups = true;
        //     getFilterDataAction();
        // }
    } else {
        if ( data[productGroupId] ) {
            isReceivingThemeFilters = false;
            return data[productGroupId];
        } else if (!isReceivingThemeFilters) {
            isReceivingThemeFilters = true;
            getFilterDataAction(productGroupId);
        }
    }

    return null;
};

const checkAdminCategories = ( data ) => {
    if (data) {
        isReceivingAdminCategories = false;
        return data;
    } else if (!isReceivingAdminCategories) {
        isReceivingAdminCategories = true;
        getAdminCategoriesAction();
    }
    return null;
};
const checkAdminProductGroup = ( data ) => {
    if (data) {
        isReceivingAdminProductGroup = false;
        return data;
    } else if (!isReceivingAdminProductGroup) {
        isReceivingAdminProductGroup = true;
        getAdminProductGroupAction();
    }
    return null;
};

/**
 * Получение данных для фильтрации тем
 */
export const themesProductTypesSelector = state => checkFiltersData(state.themes.productTypesList, '', true);
export const themesCategoriesSelector = (state, productGroupId) => checkFiltersData(state.themes.categoriesList, productGroupId);
export const themesFormatsSelector = (state, productGroupId) => checkFiltersData(state.themes.formatsList, productGroupId);

export const themesAdminCategoriesSelector = state => checkAdminCategories(state.themes.adminCategoriesList);
export const themesAdminProductGroupsSelector = state => checkAdminProductGroup(state.themes.adminProductGroupList);

export const themesAdminDataSelector = state => state.themes.editThemeData;


/**
 * Получение тем
 */

//получение тем по параметрам из кеша
const getThemeDataFromStore = ( { isAdmin, themes, productType, category, format, page, specProject = null} ) => {
    // console.log('themes',{
    //     themes,
    //     productType,
    //     key: createThemesKey({productType, category, format, page, specProject}),
    //     t: themes[ createThemesKey({productType, category, format, page, specProject}) ]
    // });

    return {
        data: themes[ createThemesKey({productType, category, format, page, specProject}) ],
        params: {isAdmin, productType, category, format, page, specProject}
    };
};

//получиение объекта темы в разрезе категории, формата и страницы по параметрам
export const themesByParamsSelector = ( state, params = null ) => getThemeDataFromStore({
    themes: state.themes.themes,
    productType:  params.productType,
    category:  params.category,
    format:  params.format,
    page:  params.page,
    isAdmin:  params.isAdmin,
    specProject: themesSpecProjectSelector( state ),
});

//получение данных темы по текущим параметрам
export const themesDataSelector = (state, params) => params ? checkData( themesByParamsSelector( state, params ) ) : null;

//получение количества страниц по текущим параметрам
export const themesTotalElementsSelector = ( state, params ):number => {
    if (!params) return  0;
    const data = themesByParamsSelector( state, params ).data;
    return data && data.totalElements || 0;
};


export const themesSelectedThemeSelector = ( state: any ): any => state.themes.selectedTheme;

export const windowIsMobileSelector = ( state: any ): boolean => state.global.windowIsMobile;
