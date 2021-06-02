import createReducer from "./createReducer";

import {
    EDITOR_STICKERS_SET_PACKS,
    EDITOR_STICKERS_SET_SELECTED_PACK,
    EDITOR_STICKERS_SET_STICKERS_COLLECTION,
    EDITOR_STICKERS_UPDATE_STICKER,
    EDITOR_CLEAR_THEME_DATA
} from "const/actionTypes";
import { stickerPackAdapter, stickersInPackAdapter } from "../server/adapters/stickes";
/**
 * Работа со стикерами
 */
export default createReducer(
    {
        stickers: {
            'theme': []
        },              // Список стикеров сгруппированных по id
        currentStickerPackId: "",  // id выбранного стикерпака
        themeStickersCount: 0,      // количество стикеров темы
        stickersPacks: null        // Содержимое разных стикерпаков
    },
    {
        // запись стикеров стикерпака
        [ EDITOR_STICKERS_SET_STICKERS_COLLECTION ]:
            ( state, { payload } ) => {
                const stickers = state.stickers;

                if ( payload.addToPack && stickers[ payload.id ] ) {
                    stickers[ payload.id ] = [
                        ...stickersInPackAdapter( payload.data ),
                        ...stickers[ payload.id ],
                    ]
                } else {
                    stickers[ payload.id ] = payload.isLoading ? 'progress' : payload.data ? stickersInPackAdapter( payload.data ) : null;
                }

                // считаем кол-во стикеров темы
                let themeStickersCount = 0;
                if ( payload.id === 'theme' && stickers[ payload.id ] ) {
                    // console.log('stickers[ payload.id ]', stickers[ payload.id ]);
                    themeStickersCount = stickers[ payload.id ].length || 0;
                }

                return {
                    ...state,
                    stickers: stickers,
                    ...(themeStickersCount ? {themeStickersCount: themeStickersCount} : {})
                }
            },
        // Обновление стикера в стикерпаке
        [ EDITOR_STICKERS_UPDATE_STICKER ]:
            ( state, { payload } ) => {
                // console.log('EDITOR_STICKERS_UPDATE_STICKER', payload);
                if (!payload || !payload.id || !payload.data || !payload.data.id ) return state;
                const targetStickerSet = state.stickers && state.stickers[payload.id];

                return {
                    ...state,
                    stickers: {
                        ...state.stickers,
                        [payload.id]: targetStickerSet
                            .map(
                                (s)=>s.id === payload.data.id ? ( payload.data.isDeleting ? null : {
                                    ...s,
                                    ...payload.data
                                } ) : s
                            )
                            .filter((s)=>s)
                    }
                }
            },

        // Запись списка всех стикерпаков
        [ EDITOR_STICKERS_SET_PACKS ]:
            ( state, { payload } ) => {
                const themeStickerPack = {
                    id: "theme",
                    name:"Стикеры темы",
                    sortIndex: -2
                };
                let stickersPacks = payload.stickersPacks;
                if ( payload.stickersPacks && Array.isArray( payload.stickersPacks ) && payload.stickersPacks.length ) {
                    stickersPacks = [themeStickerPack, ...stickerPackAdapter( payload.stickersPacks )];
                }

                return ({
                    ...state,
                    currentStickerPackId: Array.isArray( stickersPacks ) && stickersPacks.length ? stickersPacks[0].id : "",
                    stickersPacks: stickersPacks,
                })
            },
        [ EDITOR_STICKERS_SET_SELECTED_PACK ]:
            ( state, { payload } ) => {
                return ({
                    ...state,
                    currentStickerPackId: payload
                })
            },
        [ EDITOR_CLEAR_THEME_DATA ]:
            ( state ) => {
                return ({
                    ...state,
                    'theme': []
                })
            },
    }
);

