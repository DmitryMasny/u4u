import { MODAL_GALLERY_THEME_INFO, GALLERY_GET_THEMES_FROM_SERVER, GALLERY_PUT_THEMES, GALLERY_SET_PAGE, THEME_SELECTED_PUT_DATA } from 'const/actionTypes';
import decamelizeKeysDeep from 'decamelize-keys-deep';
import camelcaseKeysDeep from 'camelcase-keys-deep';
//показ модального окна с превью темы
export const modalGalleryThemeInfoAction = ( params ) => {
    //console.log('WINDOW CALL', params);
    //TODO: вынести передачу по параметрам
    //структура объекта params
    // formatId: 2
    // groupId: 12
    // id: 3741
    // name: "Выпускной"
    // preview_cover:
    return {
        type: MODAL_GALLERY_THEME_INFO,
        payload: params && {...params} || null
    }
};

//получение тем с сервера
export const getThemesFromServerAction = ( { page = 0, format, pageSize, category, specProject = null} ) => {
    const payload = category ? {themeCat: category} : {};
    if ( specProject ) payload.specialProject = specProject;

    return {
        type: GALLERY_GET_THEMES_FROM_SERVER,
        payload: {
            ...decamelizeKeysDeep( payload ),
            //fmt_orient: format,
            fmt: format,
            page: page || 1,
            page_size: pageSize || 20,
            actions: {
                inProgress: ( result ) => {
                    return { type: 0 }
                },
                inFail: ( result ) => {
                    return { type: 0 }
                },
                inSuccess: ( { request, response } ) => {
                    const camelCaseRequest = camelcaseKeysDeep( request );

                    let key = 'category:' + (camelCaseRequest.themeCat || 0) + '-format:' + camelCaseRequest.fmt + '-page:' + camelCaseRequest.page;
                    if ( camelCaseRequest.specialProject ) key += '-spec:' + camelCaseRequest.specialProject;
                    return {
                        type: GALLERY_PUT_THEMES,
                        payload: {
                            key: key,
                            pageData: response.results,
                            currentPage: (response.next && response.next - 1 || response.previous + 1),
                            totalElements: response.count
                        }
                    }
                }
            }
        }
    }
};

//Установка страницы пагинатора
export const setThemePage = ( page ) => ({ type: GALLERY_SET_PAGE, payload: page });

//Сохраняем выбранную тему в state
export const selectThisThemeAction = ( theme ) => ({ type: THEME_SELECTED_PUT_DATA, payload: theme });






/* fmt_orient
0: {id: "HORIZONTAL", name: "Горизонтальная"}
1: {id: "VERTICAL", name: "Вертикальная"}
2: {id: "SQUARE", name: "Квадратная"}
 */

/* fmt:
0: {id: 1, name: "15х15 см"}
1: {id: 2, name: "20х20 см"}
2: {id: 3, name: "30х20 см"}
3: {id: 4, name: "20х30 см"}
4: {id: 5, name: "30х30 см"}
*/