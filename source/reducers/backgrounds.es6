import createReducer from "./createReducer";

import {
    EDITOR_BACKGROUND_SET_PACKS,
    EDITOR_BACKGROUND_SET_SELECTED_PACK,
    EDITOR_BACKGROUND_SET_BACKGROUND_COLLECTION,
    EDITOR_BACKGROUND_SET_BACKGROUND_THEME_COLLECTION,
    EDITOR_BACKGROUND_DELETE_FROM_THEME, EDITOR_CLEAR_THEME_DATA
} from "const/actionTypes";
import { backgroundsPackAdapter, backgroundsInPackAdapter } from "../server/adapters/backgrounds";
/**
 * Работа с фонами
 */
export default createReducer(
    {
        backgrounds: {},              // Список фонов сгруппированных по id
        currentBackgroundPackId: "",  // id выбранного пака фонов
        backgroundsPacks: null,       // Содержимое разных паков фонов
        backgroundsThemePacks: null, // группа фоны темы
    },
    {
        // Запись удаления фона темы
        [ EDITOR_BACKGROUND_DELETE_FROM_THEME ]:
            ( state, { payload } ) => {
                let backgrounds = state.backgrounds;
                let backgroundsThemePacks = state.backgroundsThemePacks;

                if ( backgrounds[ 'theme' ] ) {
                    backgrounds[ 'theme' ] = backgrounds[ 'theme' ].filter( ( { id } ) => id !== payload.id );
                }

                if ( backgrounds[ 'theme' ] && backgrounds[ 'theme' ].length === 0 ) delete (backgrounds[ 'theme' ]);

                if (!backgrounds[ 'theme' ]) {
                    backgroundsThemePacks = [];
                }

                return {
                    ...state,
                    backgroundsThemePacks: backgroundsThemePacks,
                    backgrounds: backgrounds
                }
            },
        // Запись коллекций фонов темы
        [ EDITOR_BACKGROUND_SET_BACKGROUND_THEME_COLLECTION ]:
            ( state, { payload } ) => {

                let backgrounds = state.backgrounds;
                let backgroundsThemePacks = state.backgroundsThemePacks;

                if ( !backgroundsThemePacks ) backgroundsThemePacks = [];

                if ( backgroundsThemePacks?.[ 0 ]?.name !== 'Фоны темы' ) {
                    backgroundsThemePacks.unshift( {
                                                       id: payload.id,
                                                       name: 'Фоны темы',
                                                       sortIndex: 0
                                                   } );
                }


                if ( payload.addOnly ) {
                    const bGbyId = backgrounds[ payload.id ] || [];

                    backgrounds[ payload.id ] = [
                        ...bGbyId,
                        ...backgroundsInPackAdapter( payload.data )
                    ];
                } else {
                    backgrounds[ payload.id ] = backgroundsInPackAdapter( payload.data )
                }


                return {
                    ...state,
                    backgroundsThemePacks: backgroundsThemePacks,
                    backgrounds: backgrounds
                }
            },

        // Запись коллекций фонов
        [ EDITOR_BACKGROUND_SET_BACKGROUND_COLLECTION ]:
            ( state, { payload } ) => {
                const backgrounds = state.backgrounds;
                backgrounds[ payload.id ] = payload.isLoading ? 'progress' : payload.data ? backgroundsInPackAdapter( payload.data ) : null;

                return {
                    ...state,
                    backgrounds: backgrounds
                }
            },

        // Запись списка всех паков фонов
        [ EDITOR_BACKGROUND_SET_PACKS ]:
            ( state, { payload } ) => {
                const backgroundsPacks = Array.isArray( payload.backgroundsPacks ) ? backgroundsPackAdapter( payload.backgroundsPacks ) : payload.backgroundsPacks;

                return ({
                    ...state,
                    //currentBackgroundPackId: Array.isArray( backgroundsPacks ) && backgroundsPacks.length ? backgroundsPacks[ 0 ].id : "",
                    backgroundsPacks: backgroundsPacks,
                })
            },

        [ EDITOR_BACKGROUND_SET_SELECTED_PACK ]:
            ( state, { payload } ) => {
                return ({
                    ...state,
                    currentBackgroundPackId: payload
                })
            },
        [ EDITOR_CLEAR_THEME_DATA ]:
            ( state ) => {
                return ({
                    ...state,
                    backgroundsThemePacks: null
                })
            },
    }
);

