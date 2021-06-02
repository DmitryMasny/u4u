import { THEME_LAYOUT_GET_FROM_SERVER, THEME_LAYOUT_PUT } from 'const/actionTypes';
import camelcaseKeysDeep from 'camelcase-keys-deep';
//селектор
export const previewThemeSelector           = (state) => state.previewTheme.layout;
export const previewThemeInProgressSelector = (state) => state.previewTheme.inProgress;

//получение тем с сервера
export const getPreviewThemeServerAction = ( id ) => ({
    type: THEME_LAYOUT_GET_FROM_SERVER,
    payload: {
        urlParams: [id],
        actions: {
            inFail: ( result ) => {
                return { type: 0 }
            },
            inSuccess: ( { request, response } ) => ({
                type: THEME_LAYOUT_PUT,
                payload: camelcaseKeysDeep( response )
            })
        }
    }
});