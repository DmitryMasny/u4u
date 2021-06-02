import { MODAL_PREVIEW_ALBUM, ALBUM_LAYOUT_GET_FROM_SERVER, ALBUM_LAYOUT_PUT, ALBUM_LAYOUT_GET_FROM_SERVER_FAIL } from 'const/actionTypes';

import { toast } from '__TS/libs/tools';

//селектор
export const previewAlbumSelector           = (state) => state.previewAlbum.layout;
export const previewAlbumInProgressSelector = (state) => state.previewAlbum.inProgress;

//получение тем с сервера
export const getPreviewAlbumServerAction = ( id ) => ({
    type: ALBUM_LAYOUT_GET_FROM_SERVER,
    payload: {
        urlParams: [id],
        actions: {
            inProgress: () => ({
                type:0
            }),
            inFail: ( result ) => {
                toast.error('Не удалось получить альбом.', {
                    autoClose: 3000
                });
                return [{
                            type: ALBUM_LAYOUT_GET_FROM_SERVER_FAIL,
                            payload: result
                        }, {
                            type: MODAL_PREVIEW_ALBUM,
                            payload: null
                        }]
            },
            inSuccess: ( { request, response } ) => ({
                type: ALBUM_LAYOUT_PUT,
                payload: response
            })
        }
    }
});