import { THEME_LAYOUT_GET_FROM_SERVER, THEME_LAYOUT_PUT, THEME_BACKGROUNDS_PUT, THEME_BACKGROUNDS_GET_FROM_SERVER } from 'const/actionTypes';

//селектор
export const previewThemeIdSelector              = state => state.previewTheme.layout.theme;
export const previewThemeBacksSelector           = state => state.previewTheme.backgrounds;
export const previewThemeBacksInProgressSelector = state => state.previewTheme.backsInProgress;

//получение фонов с сервера
export const getThemeBacksFromServerAction = ( id ) => ({
    type: THEME_BACKGROUNDS_GET_FROM_SERVER,
    payload: {
        urlParams: [id],
        actions: {
            inFail: ( result ) => {
                return { type: 0 }
            },
            inSuccess: ( { request, response } ) => ({
                type: THEME_BACKGROUNDS_PUT,
                payload: response.themeElements
            })
        }
    }
});
