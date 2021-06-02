// @ts-ignore
import { store } from "components/App";

// @ts-ignore
import { toast } from '__TS/libs/tools';

// @ts-ignore
import { IUpdateContentBackground } from '__TS/interaces/backgrounds';

//получаем диспетчер Redux
const dispatch = store.dispatch;

import {
    ADMIN_BACKGROUNDS_GET_BACKGROUNDS,
    ADMIN_BACKGROUNDS_GET_BACKGROUND_PACK,
    EDITOR_BACKGROUND_SET_PACKS,
    EDITOR_BACKGROUND_SET_SELECTED_PACK,
    EDITOR_BACKGROUND_SET_BACKGROUND_COLLECTION,
    EDITOR_BACKGROUND_DELETE_FROM_THEME,
    ADMIN_THEME_BACKGROUND_DELETE
// @ts-ignore
} from "const/actionTypes";
import { currentControlElementIdSelector } from "../components/Editor/_selectors";
import { ILayout } from "../interfaces/layout";
import { productLayoutSelector } from "../selectors/layout";
import { updateLayoutInReduxAndServerByDebounceAction } from "./layout";


/**
 * Удалить фон из темы по id
 * */
export const deleteBackgroundFromThemeByIdAction = ( { id, packId }: { id: string, packId?: string } ) => {
    return dispatch({
        type: ADMIN_THEME_BACKGROUND_DELETE,
        payload: {
            urlParams: packId ? [packId, 'unset_background', id] : [id],
            actions: {
                inSuccess: ( { response } ) => {
                    toast.success('Фон удалён', {
                        autoClose: 3000
                    });
                    return { type: EDITOR_BACKGROUND_DELETE_FROM_THEME, payload: {
                            id: id
                        } };
                },
                inFail: ( err ) => {
                    // @ts-ignore
                    toast.error('Ошибка при удалении фона');
                }
            }
        }
    } );
};

/**
 * Получить все паки фоноов
 * */
export const getBackgroundsPacksAction = () => {
    return dispatch({
        type: ADMIN_BACKGROUNDS_GET_BACKGROUNDS, //TODO пока используем админский redux
        payload: {
            actions: {
                inProgress: () => {
                    return { type: EDITOR_BACKGROUND_SET_PACKS, payload: {
                            backgroundsPacks: 'progress'
                        } }
                },
                inSuccess: ( { response } ) => {
                    return { type: EDITOR_BACKGROUND_SET_PACKS, payload: {
                            backgroundsPacks: response
                        } };
                },
                inFail: ( err ) => {
                    // @ts-ignore
                    toast.error('Ошибка получение коллекций фонов' );
                    return { type: EDITOR_BACKGROUND_SET_PACKS, payload: {
                            backgroundsPacks: []
                        } }
                }
            }
        }
    } );
};

/**
 * Получить фоны по id пака
 * @param id
 */
export const getBackgroundsByPacksIdAction = ( id: string ) => {
    return dispatch({
        type: ADMIN_BACKGROUNDS_GET_BACKGROUND_PACK,
        payload: {
            urlParams: [ id ],
            actions: {
                inProgress: () => {
                    return {
                        type: EDITOR_BACKGROUND_SET_BACKGROUND_COLLECTION,
                        payload: {
                            id: id,
                            isLoading: true
                        }
                    }
                },
                inSuccess: ( { response } ) => {
                    return {
                        type: EDITOR_BACKGROUND_SET_BACKGROUND_COLLECTION,
                        payload: {
                            id: id,
                            data: response
                        }
                    }
                },
                inFail: ( err ) => {
                    return {
                        type: EDITOR_BACKGROUND_SET_BACKGROUND_COLLECTION,
                        payload: {
                            id: id,
                            error: err
                        }
                        // return { type: ADMIN_STICKERS_SET_STICKERS, payload: {error: err} }
                    }
                }
            }
        }
    } );
};

/** Назначить выбранный пак фонов
 * @params backgroundPackId
 */
export const setSelectedBackgroundsPackAction = ( backgroundPackId: string ) => {
    return dispatch( {
        type: EDITOR_BACKGROUND_SET_SELECTED_PACK,
        payload: backgroundPackId
    } );
}

/**
 * обновляем блок фона
 * @param params
 */
export const updateBackgroundContentAction = ( params :IUpdateContentBackground ) => dispatch( ( dispatch, getState ) => {
    const state = getState();

    //получаем данные выбранного элемента
    const currentControlElementId: string | number = currentControlElementIdSelector( state );

    //получаем layout
    const layout = <ILayout>productLayoutSelector( state );

    if ( !layout.contents[ currentControlElementId ] ) return;

    layout.contents[ currentControlElementId ] = {...layout.contents[ currentControlElementId ], ...params };

    updateLayoutInReduxAndServerByDebounceAction( { layout: layout } );
});

export const removeBackgroundAction = ( {contentId} ) => dispatch( ( dispatch, getState ) => {
    //получаем layout
    const layout = <ILayout>productLayoutSelector( getState() );

    if ( !layout.contents[ contentId ] ) return;

    layout.contents[ contentId ] = {...layout.contents[ contentId ],
        ...{
            backgroundType: 'fill',
            backgroundId: null,
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            r: 0,
            isPattern: false,
            opacity: 1,
            mirroredX: false,
            mirroredY: false,
            pxWidth: 0,
            pxHeight: 0
        }
    };

    updateLayoutInReduxAndServerByDebounceAction( { layout: layout } );
});