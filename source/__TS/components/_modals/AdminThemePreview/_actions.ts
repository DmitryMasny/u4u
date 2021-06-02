// @ts-ignore
import { store } from "components/App";
// @ts-ignore
import WS from 'server/ws.es6';


import {
    ADMIN_THEME_GET_DATA,
    ADMIN_THEME_PUT_DATA,
    THEMES_PUT_THEME_FORMATS,
    THEMES_PUT_THEME_FORMAT,
    ADMIN_THEME_UPDATE,
    ADMIN_THEME_DELETE,
    ADMIN_CHANGE_THEME_STATUS,
    ADMIN_THEME_CLEAR,
    // @ts-ignore
} from 'const/actionTypes';
// @ts-ignore
import { toast } from '__TS/libs/tools';
// @ts-ignore
import { clearThemesAction } from '__TS/actions/themes';


//получаем диспетчер Redux
const dispatch = store.dispatch;

// Получить тему
export const getThemeDataAction = (id: string) => dispatch( {
    type: ADMIN_THEME_GET_DATA,
    payload: {
        urlParams: [id],
        actions: {
            inSuccess: ({response}) => {
                return { type: ADMIN_THEME_PUT_DATA, payload: {
                        themeId: response.themeId,
                        themeName: response.name,
                        themeCategory: response.category,
                        productGroup: response.productGroup,
                        themeIsPublished: response.status === 'published',
                    }
                }
            },
            inFail: (err)  => {
                toast.error('Ошибка при получении темы');
                return { type: ADMIN_THEME_PUT_DATA, payload: {error: err} }
            }
        }
    }
} );
// Получить форматы темы
export const getThemeFormatsAction = (id: string) => {
    return dispatch( {
        type: ADMIN_THEME_GET_DATA,
        payload: {
            urlParams: [id, 'layouts'],
            actions: {
                inSuccess: ({response}) => {
                    return { type: THEMES_PUT_THEME_FORMATS, payload: response
                    }
                },
                inFail: (err)  => {
                    toast.error('Ошибка при получении форматов темы', {
                        autoClose: 3000
                    });
                    return { type: THEMES_PUT_THEME_FORMATS, payload: {error: err} }
                }
            }
        }
    } );
}
// Перезаписать формат темы
export const updateThemeFormatAction = (formatData:any) => {
    return dispatch( {
        type: THEMES_PUT_THEME_FORMAT,
        payload: formatData
    } );
}

// Обновить тему
export const updateThemeAction = (id: string, data) => dispatch( {
    type: ADMIN_THEME_UPDATE,
    payload: {
        urlParams: [id],
        ...data,
        actions: {
            inSuccess: ({response}) => {
                toast.success(`Тема обновлена`, {
                    autoClose: 3000
                });
                return { type: ADMIN_THEME_CLEAR }
            },
            inFail: (err)  => {
                toast.error(`Ошибка обновления темы`, {
                    autoClose: 3000
                });
                return { type: ADMIN_THEME_PUT_DATA, payload: {error: err} }
            }
        }
    }
} );

// Удалить тему
export const deleteThemeAction = (id: string) => dispatch( {
    type: ADMIN_THEME_DELETE,
    payload: {
        urlParams: [id],
        actions: {
            inSuccess: ({response}) => {
                toast.success(`Тема успешно удалена`, {
                    autoClose: 3000
                });
                clearThemesAction();
                return { type: ADMIN_THEME_PUT_DATA, payload: null }
            },
            inFail: (err)  => {
                toast.error(`Ошибка удаления темы`, {
                    autoClose: 3000
                });
                return { type: ADMIN_THEME_PUT_DATA, payload: {error: err} }
            }
        }
    }
} );

// Смена статуса публикации темы
export const changeThemeStatusAction = (id: string, publish) => dispatch( {
    type: ADMIN_CHANGE_THEME_STATUS,
    payload: {
        urlParams: [id, 'change_status'],
        status: publish ? 'published' : 'draft',
        actions: {
            inSuccess: ({response}) => {
                toast.success(publish ? 'Тема опубликована' : 'Тема снята с публикации', {
                    autoClose: 3000
                });
                clearThemesAction();
                return { type: ADMIN_THEME_CLEAR }
            },
            inFail: (err)  => {
                toast.error(`Ошибка публикации темы`, {
                    autoClose: 3000
                });
                return { type: ADMIN_THEME_PUT_DATA, payload: {error: err} }
            }
        }
    }
} );
// Очистка данных темы
export const clearThemeDataAction = () => dispatch( {
    type: ADMIN_THEME_CLEAR
} );

// Создание формата темы
export const createThemeLayoutAction = ( layout: any, preview: any, themeId: string ) => new Promise( ( resolve, reject ) => {
    WS.createThemeLayout( {layout, preview, themeId} ).then( ( data ) => {
        resolve( data );

    } ).catch( ( err ) => {
        toast.error('Ошибка при создании темы', {
            autoClose: 3000
        });
        console.error( 'Ошибка при создании темы', err );
        reject( err );
    } );
});