import {
    EDITOR_SET_TAB,
    EDITOR_TOGGLE_PAGES_PANEL,
    EDITOR_SET_PHOTOS_LIBRARY,
    EDITOR_SET_THEMES_LIBRARY,
    EDITOR_SET_TEXT_LIBRARY,
    EDITOR_SET_FRAMES_LIBRARY,
    EDITOR_SET_STICKERS_LIBRARY,
    EDITOR_SET_TEMPLATES_LIBRARY,
    EDITOR_GET_PHOTOS_LIBRARY,
    EDITOR_GET_THEMES_LIBRARY,
    EDITOR_GET_TEXT_LIBRARY,
    EDITOR_GET_FRAMES_LIBRARY,
    EDITOR_GET_STICKERS_LIBRARY,
    EDITOR_GET_TEMPLATES_LIBRARY,
    EDITOR_SET_PHOTOS_LIBRARY_SELECTION,
    EDITOR_SET_THEMES_LIBRARY_SELECTION,
    MY_PHOTOS_PREVIEW_PHOTO,
    EDITOR_SELECT_PHOTO,
    EDITOR_SELECT_THEME
} from "const/actionTypes";

import { toast } from '__TS/libs/tools';

import TEXT_MY_PHOTOS from 'texts/my_photos';
import {EDITOR_TABS} from "./_config";
import {
    framesLibrarySelector,
    photosLibrarySelector,
    stickersLibrarySelector, templatesLibrarySelector,
    textLibrarySelector,
    themesLibrarySelector
} from "./_selectors";

/**
 * Экшены для редактора
 */

export const setTabAction  = ( tab ) => ({ type: EDITOR_SET_TAB, payload: tab });
export const togglePagesPanelAction  = (  ) => ({ type: EDITOR_TOGGLE_PAGES_PANEL });

/**
 * Получить фотографии редактора
 */
export const getLibraryPhotosAction = (id) => {
    return {
        type: EDITOR_GET_PHOTOS_LIBRARY,
        payload: {
            id: id,
            actions: {
                inSuccess: ({response}) => {
                    return { type: EDITOR_SET_PHOTOS_LIBRARY, payload: {list:response, add: true} }
                },
                inFail: (err)  => {
                    toast.error('Не удалось получить фотографии', {
                        autoClose: 3000
                    });
                    // window.sendErrorLog( 'getLibraryPhotosAction error:', {error: err} );
                    return { type: EDITOR_SET_PHOTOS_LIBRARY, payload: {error: err} }

                }
            }
        }
    }
};
/**
 * Получить фоны редактора
 */
export const getLibraryThemesAction = (id) => {
    return {
        type: EDITOR_GET_THEMES_LIBRARY,
        payload: {
            id: id,
            actions: {
                inSuccess: ({response}) => {
                    return { type: EDITOR_SET_THEMES_LIBRARY, payload: {list:response, add: true} }
                },
                inFail: (err)  => {
                    return { type: EDITOR_SET_PHOTOS_LIBRARY, payload: {error: err} }
                }
            }
        }
    }
};
/**
 * Добавить фотографии в редактор
 */
export const addLibraryPhotosAction = (list) => {
    return {
        type: EDITOR_SET_PHOTOS_LIBRARY,
        payload: {list:list, add: true}
    }
};
/**
 * Выбрать фотографию
 */
export const selectLibraryPhotosAction = (list) => {
    return {
        type: EDITOR_SET_PHOTOS_LIBRARY,
        payload: {list:list, add: true}
    }
};
/**
 * Выбрать фон
 */
export const selectLibraryThemesAction = (list) => {
    return {
        type: EDITOR_SET_PHOTOS_LIBRARY,
        payload: {list:list, add: true}
    }
};
/**
 * Переключение мультивыбора
 */

export const toggleLibrarySelectionAction = (tab) => {
    switch (tab) {
        case EDITOR_TABS.PHOTOS:    return {
            type: EDITOR_SET_PHOTOS_LIBRARY_SELECTION
        };
        case EDITOR_TABS.THEMES:    return {
            type: EDITOR_SET_THEMES_LIBRARY_SELECTION
        };

        default:
            console.log('не верный tab');
            return null;
    }

};

export const getLibraryAction = (tab, id) => {
    switch (tab) {
        case EDITOR_TABS.PHOTOS:    return getLibraryPhotosAction(id);
        case EDITOR_TABS.THEMES:    return getLibraryThemesAction(id);

        default:
            console.log('не верный tab');
            return null;
    }
};

/**
 * Просмотр фотографии
 */
export const previewPhotoAction = ( o ) => {
    return {
        type: MY_PHOTOS_PREVIEW_PHOTO,
        payload: o
    }
};
/**
 * Выбор фотографии
 */
export const selectLibraryItemAction = ( tab, data ) => {
    console.log('tab',tab);
    console.log('data',data);
    switch (tab) {
        case EDITOR_TABS.PHOTOS:    return {
            type: EDITOR_SELECT_PHOTO,
            payload: data
        };
        case EDITOR_TABS.THEMES:    return {
            type: EDITOR_SELECT_THEME,
            payload: data
        };

        default:
            console.log('не верный tab');
            return null;
    }
};