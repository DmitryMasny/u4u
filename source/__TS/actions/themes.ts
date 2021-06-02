// @ts-ignore
import { store } from "components/App";

// @ts-ignore
// import { toast } from '__TS/libs/tools';

import {
    THEMES_CLEAR,
    THEMES_GET_THEME_DATA,
    THEMES_PUT_THEME_DATA,
    THEMES_COPY_THEME,
// @ts-ignore
} from "const/actionTypes";

//получаем диспетчер Redux
const dispatch = store.dispatch;


// Очистить страницу тем
export const clearThemesAction = () => dispatch( {
    type: THEMES_CLEAR
} );


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

// Копирование темы
export const copyThemeAction = ({themeId, themeName, productType, callback}: {themeId: string, themeName: string, productType: string, callback: any }) => dispatch({
    type: THEMES_COPY_THEME,
    payload: {
        urlParams: [themeId, 'clone'],
        'new_theme_name': themeName,
        'new_product_group_slug': productType,
        actions: {
            inSuccess: ( { response } ) => {
                clearThemesAction()
                callback && callback(response)
            },
            inFail: ( err ) => {
                return { type: 0 }
            }
        }
    }
});