// @ts-ignore
import { store } from "components/App";

// @ts-ignore
import { toast } from '__TS/libs/tools';

import {
    ADMIN_STICKERS_GET_STICKERS,
    ADMIN_STICKERS_SET_STICKERS,
    ADMIN_STICKERS_GET_STICKER_PACK,
    ADMIN_STICKERS_SET_STICKER_PACK,
    ADMIN_STICKERS_STICKER_PACK_CREATE,
    ADMIN_STICKERS_STICKER_PACK_UPDATE,
    ADMIN_STICKERS_STICKER_PACK_DELETE,
    ADMIN_STICKERS_SET_STICKER,
    ADMIN_STICKERS_SELECT_STICKERS,
    ADMIN_STICKERS_MOVE_STICKERS,
    ADMIN_STICKERS_CLEAR,
    ADMIN_STICKERS_SELECT_STICKERPACK,
    ADMIN_STICKERS_STICKER_UPLOAD,
    ADMIN_STICKERS_ADD_UPLOADED,
    ADMIN_STICKERS_STICKER_UPDATE,
    ADMIN_STICKERS_STICKER_DELETE,
    ADMIN_STICKERS_STICKER_PACK_SORT,
    ADMIN_STICKERS_STICKER_SORT,
    ADMIN_STICKERS_SET_STICKER_PACK_STICKERS,
    EDITOR_STICKERS_SET_PACKS,
    EDITOR_STICKERS_SET_SELECTED_PACK,
    EDITOR_STICKERS_SET_STICKERS_COLLECTION
// @ts-ignore
} from "const/actionTypes";

//получаем диспетчер Redux
const dispatch = store.dispatch;

/** Получить все стикерпаки */
export const getStickersPacksAction = () => {
    return dispatch({
        type: ADMIN_STICKERS_GET_STICKERS, //TODO пока используем админский redux
        payload: {
            actions: {
                inProgress: () => {
                    return { type: EDITOR_STICKERS_SET_PACKS, payload: {
                        stickersPacks: 'progress'
                    } }
                },
                inSuccess: ( { response } ) => {
                    return { type: EDITOR_STICKERS_SET_PACKS, payload: {
                        stickersPacks: response
                    } };
                },
                inFail: ( err ) => {
                    toast.error('Ошибка получение коллекций стикеров' );
                    return { type: EDITOR_STICKERS_SET_PACKS, payload: {
                        stickersPacks: []
                    } }
                }
            }
        }
    } );
};

/**
 * Получить стикеры по id пака
 * @param id
 */
export const getStickersByPacksIdAction = ( id: string ) => {
    return dispatch({
        type: ADMIN_STICKERS_GET_STICKER_PACK,
        payload: {
            urlParams: [ id ],
            actions: {
                inProgress: () => {
                    return {
                        type: EDITOR_STICKERS_SET_STICKERS_COLLECTION,
                        payload: {
                            id: id,
                            isLoading: true
                        }
                    }
                },
                inSuccess: ( { response } ) => {
                    return {
                        type: EDITOR_STICKERS_SET_STICKERS_COLLECTION,
                        payload: {
                            id: id,
                            data: response
                        }
                    }
                },
                inFail: ( err ) => {
                    return {
                        type: EDITOR_STICKERS_SET_STICKERS_COLLECTION,
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

/** Назначить выбранный стикерпак */
export const setSelectedStickerAction = ( stickerPackId: string ) => {
    return dispatch( {
        type: EDITOR_STICKERS_SET_SELECTED_PACK,
        payload: stickerPackId
    } );
}
