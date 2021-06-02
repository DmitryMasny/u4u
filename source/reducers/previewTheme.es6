import {
    THEME_LAYOUT_GET_FROM_SERVER,
    THEME_LAYOUT_PUT,
    THEME_BACKGROUNDS_PUT,
    THEME_BACKGROUNDS_GET_FROM_SERVER
} from 'const/actionTypes';
const defaultState = {
    layout: null,
    inProgress: null,
    backgrounds: null,
    backsInProgress: null
};

export function previewTheme( state = defaultState, { type, payload } ) {
    switch ( type ) {
        case THEME_LAYOUT_GET_FROM_SERVER:
            return {
                ...state,
                inProgress: true
            };
        case THEME_LAYOUT_PUT:
            return {
                ...state,
                layout: payload,
                inProgress: false
            };
        case THEME_BACKGROUNDS_GET_FROM_SERVER:
            return {
                ...state,
                inProgress: true
            };
        case THEME_BACKGROUNDS_PUT:
            return {
                ...state,
                backgrounds: payload,
                inProgress: false
            };
        default:
            return state;
    }
}
