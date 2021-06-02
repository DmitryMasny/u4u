import createReducer from "./createReducer";

import {
    SET_WINDOW_SIZES,
    SET_WINDOW_SCROLL,
    SET_FUTURE
} from 'const/actionTypes';


let defaultState = {
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    windowMedia: null,
    windowIsMobile: null,
    windowOrientation: null,
    windowScroll: 0,
    showFuture: false
};

//SSR
if ( process.env.server_render ) {
    defaultState = {
        windowWidth: 1025,
        windowHeight: 978,
        windowMedia: "lg",
        windowIsMobile: false,
        windowOrientation: "landscape",
        windowScroll: 0
    }
}

export default createReducer(
    defaultState,
    {
        [SET_WINDOW_SIZES]: //размеры окна
            ( state, {payload} ) => ({
                ...state,
                windowWidth: payload.width,
                windowHeight: payload.height,
                windowMedia: payload.media,
                windowIsMobile: payload.isMobile,
                windowOrientation: payload.orientation,
            }),
        [SET_WINDOW_SCROLL]: //scroll окна
            ( state, {payload} ) => ({
                ...state,
                windowScroll: payload.scroll,
            }),
        [SET_FUTURE]:
            ( state, {payload} ) => ({
                ...state,
                showFuture: !state.showFuture,
            })
    }
);