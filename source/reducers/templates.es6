import createReducer from "./createReducer";

import {
    EDITOR_SET_TEMPLATES,
} from "const/actionTypes";

//import { stickersInPackAdapter } from "../server/adapters/stickes";

/**
 * Работа со шаблонами
 */
export default createReducer(
    {
        svg: null,
        layout: null,
        layoutId: null
    },
    {
        [ EDITOR_SET_TEMPLATES ]:
            ( state, { payload } ) => {
                return {
                    ...state,
                    svg: payload.svg,
                    layout: payload.layout,
                    layoutId: payload.layoutId
                }
            },
    }
);