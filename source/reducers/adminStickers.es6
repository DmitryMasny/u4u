import createReducer from "./createReducer";

import {
    ADMIN_STICKERS_SET_STICKERS,
    ADMIN_STICKERS_SET_STICKER_PACK,
    ADMIN_STICKERS_CLEAR,
    ADMIN_STICKERS_SET_STICKER,
    ADMIN_STICKERS_SELECT_STICKERS,
    ADMIN_STICKERS_SELECT_STICKERPACK,
    ADMIN_STICKERS_ADD_UPLOADED,
    ADMIN_STICKERS_SET_STICKER_PACK_STICKERS,
    ADMIN_STICKERS_REMOVE_FROM_PACK,
} from 'const/actionTypes';


/**
 * Админка Стикеров
 */
export default createReducer(
    {
        stickersPacksList: null,    // Список всех стикерпаков
        currentStickerPackId: '',   // id выбранного стикерпака
        stickersPacks: {            // Содержимое разных стикерпаков

        },
        config: null
    },
    {
        // Запись списка всех стикерпаков
        [ADMIN_STICKERS_SET_STICKERS]:
            (state, { payload }) => {
            // console.log('ADMIN_STICKERS_SET_STICKERS =>',payload);
                return ({
                    ...state,
                    stickersPacksList: payload,
                    // ...(!state.config && Array.isArray(payload) && {config: payload[0].config})//TODO: stickers config in redux state
                })
            },

        // Запись содержимого конкретного стикерпака
        [ADMIN_STICKERS_SET_STICKER_PACK]:
            (state, { payload }) => {
                console.log('ADMIN_STICKERS_SET_STICKER_PACK payload',payload);
                let stickersListWithNewIcon = null, stickerPacksListNew = null, newIcon = null;
                const currentSP = state.stickersPacks[payload.id];

                if ( payload.iconFrom ) {
                    stickersListWithNewIcon = currentSP && currentSP.stickersList.map((sticker)=>{
                        if (sticker.id === payload.iconFrom) newIcon = sticker;
                        return {...sticker, tags: {...sticker.tags, useForPreview: sticker.id === payload.iconFrom}}
                    });
                    stickerPacksListNew = newIcon && state.stickersPacksList.map((sp)=> sp.id === payload.id ? {...sp, thumb: newIcon}: sp);
                } else if ( payload.name ) {
                    stickerPacksListNew = state.stickersPacksList.map((sp)=> sp.id === payload.id ? {...sp, name:  payload.name }: sp);
                }

                return ({
                    ...state,
                    stickersPacks: {
                        ...state.stickersPacks,
                        [payload.id]: {
                            ...payload.data,
                            stickersList: payload.data.stickersList || stickersListWithNewIcon || currentSP && currentSP.stickersList
                        },
                    },
                    ...(stickerPacksListNew ? { stickersPacksList: stickerPacksListNew } : {})
                })
            },

        // Запись стикеров конкретного стикерпака
        [ADMIN_STICKERS_SET_STICKER_PACK_STICKERS]:
            (state, { payload }) => {
            // console.log('ADMIN_STICKERS_SET_STICKER_PACK_STICKERS payload',payload);
                const currentPackId = payload.packId || state.currentStickerPackId;
                const currentSP = state.stickersPacks[currentPackId];

                return ({
                    ...state,
                    stickersPacks: {
                        ...state.stickersPacks,
                        [currentPackId]: currentSP ? {
                            ...currentSP,
                            stickersList: payload.stickersList
                        } : {},
                    },
                })
            },

        // Обновление стикера
        [ADMIN_STICKERS_SET_STICKER]:
            (state, { payload }) => {
            const currentPackId = payload.packId || state.currentStickerPackId;
            const currentSP = state.stickersPacks[currentPackId];
            console.log('ADMIN_STICKERS_SET_STICKER', {currentSP, payload});
                return ({
                    ...state,
                    stickersPacks: {
                        ...state.stickersPacks,
                        [currentPackId]: currentSP ? {
                            ...currentSP,
                            stickersList: currentSP.stickersList.map((sticker)=>sticker.id === payload.id ? {
                                ...sticker,
                                ...payload.data
                            } : sticker)
                        } : {},
                    },
                })
            },

        // Мультивыбор стикера - Отменить выбор/ выбрать все
        [ADMIN_STICKERS_SELECT_STICKERS]:
            (state, { payload }) => {
                const currentPackId = payload.packId || state.currentStickerPackId;
                const currentSP = state.stickersPacks[currentPackId];
                return ({
                    ...state,
                    stickersPacks: {
                        ...state.stickersPacks,
                        [currentPackId]: currentSP ? {
                            ...currentSP,
                            stickersList: currentSP.stickersList.map((sticker)=>({
                                ...sticker,
                                selected: !payload.deselect
                            }))
                        } : {},
                    },
                })
            },

        // Выбрать стикерпак
        [ADMIN_STICKERS_SELECT_STICKERPACK]:
            (state, { payload }) => {
            let id = payload || '';
            if (!id) {
                id = state.stickersPacks && Object.values(state.stickersPacks).sort((a, b)=> a.sortIndex - b.sortIndex)[0];
                id = id && id.id || '';
            }
                return ({...state, currentStickerPackId: id})
            },

        // Запись загруженного файла в redux
        [ADMIN_STICKERS_ADD_UPLOADED]:
            (state, { payload }) => {
            console.log('ADMIN_STICKERS_ADD_UPLOADED ',payload);
                const currentPackId = payload.packId || state.currentStickerPackId;
                const currentSP = state.stickersPacks[currentPackId];
                return ({
                    ...state,
                    stickersPacks: {
                        ...state.stickersPacks,
                        [currentPackId]: {
                            ...currentSP,
                            stickersList: [
                                ...payload.data,
                                ...currentSP.stickersList
                            ]
                        }
                    },
                })
            },

        // Убрать удаленный стикер из redux
        [ADMIN_STICKERS_REMOVE_FROM_PACK]:
            (state, { payload }) => {
                const currentPackId = payload.packId || state.currentStickerPackId;
                const currentSP = state.stickersPacks[currentPackId];
                let idList = payload.idList || (payload.id ? [payload.id] : null);
                return idList ? ({
                    ...state,
                    stickersPacks: {
                        ...state.stickersPacks,
                        [currentPackId]: {
                            ...currentSP,
                            stickersList: currentSP.stickersList.filter((x)=>{
                                for (let i = 0; i < idList.length; i++) {
                                    if (x.id === idList[i]) {
                                        idList.splice(i, 1);
                                        return false;
                                    }
                                }
                                return true;
                            })
                        },
                        ...(payload.clearPack ? {[payload.clearPack]: null} : {})
                    },
                }) : state
            },

        // Очистить
        [ADMIN_STICKERS_CLEAR]:
            (state) => {
                return ({...state, stickersPacksList: null, stickersPacks: {}, currentStickerPackId: ''})
            },
    }
);