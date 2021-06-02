import { SET_SPEC_PROJECT, GALLERY_SET_PAGE, GALLERY_GET_THEMES_FROM_SERVER, GALLERY_SET_CATEGORIES, GALLERY_SET_CURRENT_FORMAT, GALLERY_PUT_THEMES } from 'const/actionTypes';
import createReducer from "./createReducer";


export default createReducer(
    {
        selectedCategory: 0,
        categories: null,
        themes: [],
        page: 1,
        //totalPages: 1,
        inProgress: false,
        specProject: null
    },
    {
        [SET_SPEC_PROJECT]:
            (state, {payload}) => ({ ...state,
                specProject: payload,
                page: 1,
                selectedCategory: 0
            }),
        [GALLERY_SET_PAGE]:
            (state, {payload}) => ({ ...state, page: payload }),

        [GALLERY_GET_THEMES_FROM_SERVER]:
            (state, {payload}) => ({ ...state, inProgress: true }),

        [GALLERY_SET_CATEGORIES]:
            (state, {payload}) => ({ ...state,
                                    selectedCategory: 0,
                                    categories: payload}),

        [GALLERY_SET_CURRENT_FORMAT]:
            (state, {payload}) => ({ ...state, currentFormat: payload }),

        [GALLERY_PUT_THEMES]:
            (state, {payload}) => {
                const data = payload.pageData.map((i)=> {
                    i.random = Math.random();
                    return i;
                });
                let newThemes = {
                    [payload.key]: {
                        data: data,
                        totalElements: payload.totalElements,
                        time: + new Date()
                    }
                };
                return {
                    ...state,
                    inProgress: false,
                    page: payload.currentPage,
                    themes: {...state.themes, ...newThemes}
                };
            }
    }
);