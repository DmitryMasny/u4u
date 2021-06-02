// @ts-ignore
import { store } from "components/App";
import { createThemesKey } from "./_config";
// @ts-ignore
import {
    THEMES_PUT_THEMES,
    THEMES_GET_THEMES,
    SET_SPEC_PROJECT,
    MODAL_SPEC_PROJECT,
    MODAL_CREATE_THEME,
    THEMES_GET_PUBLISHED_THEMES,
    THEMES_GET_FILTER_DATA,
    THEMES_SET_FILTER_DATA,
    THEMES_CREATE_NEW_THEME,
    THEMES_CLEAR,
    THEMES_GET_ADMIN_CATEGORIES,
    THEMES_SET_ADMIN_CATEGORIES,
    THEMES_GET_ADMIN_PRODUCT_GROUP,
    THEMES_SET_ADMIN_PRODUCT_GROUP,
    THEMES_CREATE_CATEGORY,
    THEMES_GET_THEME_DATA,
    THEMES_PUT_THEME_DATA,
    // @ts-ignore
} from "const/actionTypes";
// @ts-ignore
import { THEME_SLUG_TO_PRODUCT_SLUG_MAP } from "__TS/components/Themes/_config";


// @ts-ignore
import {modalSimplePreviewAction} from "actions/modals";
import {
    modalAdminThemePreviewAction
    // @ts-ignore
} from "__TS/actions/modals";

//получаем диспетчер Redux
const dispatch = store.dispatch;

/** Interfaces */
// interface IPhotoInPhoto {
//
// }

/**
 * Адаптеры для тем
 */
const themesAdapter = ( data ) => data.map( theme => {

    return {
        id: theme.themeId,
        name: theme.name,
        created: theme.createdAt,
        author: theme.designedBy,
        status: theme.status,
        category: theme.category,
        preview: theme.preview,
        productGroup: theme.productGroup,
        tags: {
            published: theme.status === 'published'
        }
    }
});

/**
 * Экшены для тем
 */

// Превью темы
export const themePreviewAction = ( o, isAdmin ) => {
    // console.log('themePreviewAction ', o);
    const modalData = {
        name: o.name,
        id: o.id,
        svgPreview: o.preview,
        actions: o.actions,
        onClose: o.onClose,
        themesSelected: o.themesSelected,
        format: o.format,
        productSlug: THEME_SLUG_TO_PRODUCT_SLUG_MAP[o.themesSelected && o.themesSelected.productType || 'decor'],
        isNew: true,
        getLayoutById: o.getLayoutById
    };
    return dispatch(isAdmin ? modalAdminThemePreviewAction(o) : modalSimplePreviewAction(modalData));
}

// Получение форматов темы
export const getThemeFormatPreviewAction = (id: string, formatId: string) => new Promise( ( resolve, reject ) => {
    return dispatch( {
        type: THEMES_GET_THEME_DATA,
        payload: {
            urlParams: [id, 'layout', formatId],
            actions: {
                inSuccess: ({response}) => resolve(response),
                inFail: (err)  => reject(err)
            }
        }
    } );
});

//Спецпроект
export const specProjectModalAction = ( x ) => dispatch({
    type: MODAL_SPEC_PROJECT,
    payload: x
});
// создать новую тему
export const showCreateThemeModalAction = ( productGroupId ) => dispatch({
    type: MODAL_CREATE_THEME,
    payload: productGroupId
});

//получение тем с сервера
export const getThemesFromServerAction = ( { isAdmin = false, page = 0, productType = 0, format = 0, category = 0, pageSize, specProject = null} ) => {

    dispatch({
        type: isAdmin ? THEMES_GET_THEMES : THEMES_GET_PUBLISHED_THEMES,
        payload: {
            ...(category && {category: category} || {}),
            ...(format && {format_slug: format} || {}),
            ...(productType && {product_group: productType} || {}),
            ...(page && {page: page} || {}),
            ...(pageSize && {page_size: pageSize} || {}),
            actions: {
                inProgress: () => {
                    return { type: 0 }

                    // return {
                    //     type: THEMES_PUT_THEMES,
                    //     payload: {
                    //         key: createThemesKey({page, productType, format, category, specProject}),
                    //         pageData: 'inProgress',
                    //     } }
                },
                inSuccess: ( { response } ) => {
                    //console.log('response THEMES', response);
                    return {
                        type: THEMES_PUT_THEMES,
                        payload: {
                            key: createThemesKey( { page, productType, format, category, specProject } ),
                            pageData: themesAdapter( response.results ),
                            currentPage: (response.next && response.next - 1 || response.previous + 1) || 1,
                            totalElements: response.count
                        }
                    }
                },
                inFail: ( err ) => {
                    return { type: 0 }
                }
            }
        }
    });
};

// Получение данных для фильтрации
export const getFilterDataAction = (productGroupId?: string) => dispatch({
    type: THEMES_GET_FILTER_DATA,
    payload: {
        ...(productGroupId ? {product_group: productGroupId} : {}),
        actions: {
            inSuccess: ( { response } ) => {
                // console.log('response', response);
                return {
                    type: THEMES_SET_FILTER_DATA,
                    payload: {
                        id: productGroupId,
                        data: response
                    }
                }
            },
            inFail: ( err ) => {
                return { type: 0 }
            }
        }
    }
});
// Получение категорий админа
export const getAdminCategoriesAction = () => dispatch({
    type: THEMES_GET_ADMIN_CATEGORIES,
    payload: {
        actions: {
            inSuccess: ( { response } ) => {
                return {
                    type: THEMES_SET_ADMIN_CATEGORIES,
                    payload: response
                }
            },
            inFail: ( err ) => {
                return { type: 0 }
            }
        }
    }
});
// Получение групп продуктов админа
export const getAdminProductGroupAction = () => dispatch({
    type: THEMES_GET_ADMIN_PRODUCT_GROUP,
    payload: {
        actions: {
            inSuccess: ( { response } ) => {
                return {
                    type: THEMES_SET_ADMIN_PRODUCT_GROUP,
                    payload: response
                }
            },
            inFail: ( err ) => {
                return { type: 0 }
            }
        }
    }
});
// Создать категорию для тем админа
export const createCategoryAction = (name) => dispatch({
    type: THEMES_CREATE_CATEGORY,
    payload: {
        name: name,
        slug: name,
        // sort_rate: 0,
        actions: {
            inSuccess: ( { response } ) => {
                return {
                    type: THEMES_SET_ADMIN_CATEGORIES,
                    payload: null
                }
            },
            inFail: ( err ) => {
                return { type: 0 }
            }
        }
    }
});

// Получение данных для фильтрации
export const createNewThemeAction = ({callback, themeName, productType, themeCategory}) => dispatch({
    type: THEMES_CREATE_NEW_THEME,
    payload: {
        name: themeName,
        product_group: productType,
        // product_group: 1,
        category: themeCategory,
        actions: {
            inSuccess: ( { response } ) => {
                callback(response);
                return { type: THEMES_CLEAR }
            },
            inFail: ( err ) => {
                callback(err);
                return { type: THEMES_CLEAR }
            }
        }
    }
});

// Получение форматов темы после выбора темы
export const selectThemeAction = (id: string) => dispatch({
    type: THEMES_GET_THEME_DATA,
    payload: {
        urlParams: [id, 'layouts'],
        actions: {
            inSuccess: ( { response } ) => {
                return {
                    type: THEMES_PUT_THEME_DATA,
                    payload: {
                        themeId: id,
                        themeLayouts: response
                    }
                }
            },
            inFail: ( err ) => {
                return { type: 0 }
            }
        }
    }
});