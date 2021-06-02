import createReducer from "./createReducer";

import {
    ADMIN_BACKGROUNDS_SET_BACKGROUNDS,
    ADMIN_BACKGROUNDS_SET_BACKGROUND_PACK,
    ADMIN_BACKGROUNDS_CLEAR,
    ADMIN_BACKGROUNDS_SET_BACKGROUND,
    ADMIN_BACKGROUNDS_SELECT_BACKGROUNDS,
    ADMIN_BACKGROUNDS_SELECT_BACKGROUND_PACK,
    ADMIN_BACKGROUNDS_ADD_UPLOADED,
    ADMIN_BACKGROUNDS_REMOVE_FROM_PACK,
} from 'const/actionTypes';


/**
 * Админка Стикеров
 */
export default createReducer(
    {
        backgroundPacksList: null,    // Список всех коллекций фонов
        currentBackgroundPackId: '',   // id выбранной коллекции фонов
        backgroundPacks: {            // Содержимое разных коллекций фонов

        },
        config: null
    },
    {
        // Запись списка всех коллекций фонов
        [ADMIN_BACKGROUNDS_SET_BACKGROUNDS]:
            (state, { payload }) => {
                return ({
                    ...state,
                    backgroundPacksList: payload,
                    ...(!state.config && Array.isArray(payload) && {config: payload[0].config})
                })
            },

        // Запись содержимого конкретной коллекции фонов
        [ADMIN_BACKGROUNDS_SET_BACKGROUND_PACK]:
            (state, { payload }) => {
                console.log('ADMIN_BACKGROUNDS_SET_BACKGROUND_PACK payload',payload);
                let backgroundsListWithNewIcon = null, backgroundPacksListNew = null, newIcon = null;
                const currentBP = state.backgroundPacks[payload.id];

                if ( payload.iconFrom ) {
                    backgroundsListWithNewIcon = currentBP && currentBP.backgroundsList.map((background)=>{
                        if (background.id === payload.iconFrom) newIcon = background;
                        return {...background, tags: {...background.tags, useForPreview: background.id === payload.iconFrom}}
                    });
                    backgroundPacksListNew = newIcon && state.backgroundPacksList.map((sp)=> sp.id === payload.id ? {...sp, thumb: newIcon}: sp);
                } else if ( payload.name ) {
                    backgroundPacksListNew = state.backgroundPacksList.map((sp)=> sp.id === payload.id ? {...sp, name:  payload.name }: sp);
                }

                return ({
                    ...state,
                    backgroundPacks: {
                        ...state.backgroundPacks,
                        [payload.id]: {
                            ...payload.data,
                            backgroundsList: payload.data.backgroundsList || backgroundsListWithNewIcon || currentBP && currentBP.backgroundsList
                        },
                    },
                    ...(backgroundPacksListNew ? { backgroundPacksList: backgroundPacksListNew } : {}),
                    ...(!state.config && payload.data && payload.data.config && {config: payload.data.config})
                })
            },

        // Запись стикеров конкретной коллекции фонов
        // [ADMIN_BACKGROUNDS_SET_BACKGROUND_PACK_BACKGROUNDS]:
        //     (state, { payload }) => {
        //     // console.log('ADMIN_BACKGROUNDS_SET_BACKGROUND_PACK_BACKGROUNDS payload',payload);
        //         const currentPackId = payload.packId || state.currentBackgroundPackId;
        //         const currentBP = state.backgroundPacks[currentPackId];
        //
        //         return ({
        //             ...state,
        //             backgroundPacks: {
        //                 ...state.backgroundPacks,
        //                 [currentPackId]: currentBP ? {
        //                     ...currentBP,
        //                     backgroundsList: payload.backgroundsList
        //                 } : {},
        //             },
        //         })
        //     },

        // Обновление фона
        [ADMIN_BACKGROUNDS_SET_BACKGROUND]:
            (state, { payload }) => {
            const currentPackId = payload.packId || state.currentBackgroundPackId;
            const currentBP = state.backgroundPacks[currentPackId];
            console.log('ADMIN_BACKGROUNDS_SET_BACKGROUND', {currentBP, payload});
                return ({
                    ...state,
                    backgroundPacks: {
                        ...state.backgroundPacks,
                        [currentPackId]: currentBP ? {
                            ...currentBP,
                            backgroundsList: currentBP.backgroundsList.map((background)=>background.id === payload.id ? {
                                ...background,
                                ...payload.data
                            } : background)
                        } : {},
                    },
                })
            },

        // Мультивыбор фона - Отменить выбор/ выбрать все
        [ADMIN_BACKGROUNDS_SELECT_BACKGROUNDS]:
            (state, { payload }) => {
                const currentPackId = payload.packId || state.currentBackgroundPackId;
                const currentBP = state.backgroundPacks[currentPackId];
                return ({
                    ...state,
                    backgroundPacks: {
                        ...state.backgroundPacks,
                        [currentPackId]: currentBP ? {
                            ...currentBP,
                            backgroundsList: currentBP.backgroundsList.map((background)=>({
                                ...background,
                                selected: !payload.deselect
                            }))
                        } : {},
                    },
                })
            },

        // Выбрать коллекцию фонов
        [ADMIN_BACKGROUNDS_SELECT_BACKGROUND_PACK]:
            (state, { payload }) => {
            let id = payload || '';
            if (!id) {
                id = state.backgroundPacks && Object.values(state.backgroundPacks).sort((a, b)=> a.sortIndex - b.sortIndex)[0];
                id = id && id.id || '';
            }
                return ({...state, currentBackgroundPackId: id})
            },

        // Запись загруженного файла в redux
        [ADMIN_BACKGROUNDS_ADD_UPLOADED]:
            (state, { payload }) => {
            console.log('ADMIN_BACKGROUNDS_ADD_UPLOADED ',payload);
                const currentPackId = payload.packId || state.currentBackgroundPackId;
                const currentBP = state.backgroundPacks[currentPackId];
                return ({
                    ...state,
                    backgroundPacks: {
                        ...state.backgroundPacks,
                        [currentPackId]: {
                            ...currentBP,
                            backgroundsList: [
                                ...payload.data,
                                ...currentBP.backgroundsList
                            ]
                        }
                    },
                })
            },

        // Убрать удаленный фон из redux
        [ADMIN_BACKGROUNDS_REMOVE_FROM_PACK]:
            (state, { payload }) => {
                const currentPackId = payload.packId || state.currentBackgroundPackId;
                const currentBP = state.backgroundPacks[currentPackId];
                let idList = payload.idList || (payload.id ? [payload.id] : null);
                return idList ? ({
                    ...state,
                    backgroundPacks: {
                        ...state.backgroundPacks,
                        [currentPackId]: {
                            ...currentBP,
                            backgroundsList: currentBP.backgroundsList.filter((x)=>{
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
        [ADMIN_BACKGROUNDS_CLEAR]:
            (state) => {
                return ({...state, backgroundPacksList: null, backgroundPacks: {}, currentBackgroundPackId: ''})
            },
    }
);