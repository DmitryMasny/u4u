import {
    ALBUM_LAYOUT_GET_FROM_SERVER,
    ALBUM_LAYOUT_GET_FROM_SERVER_FAIL,
    ALBUM_LAYOUT_PUT
} from 'const/actionTypes';
import camelcaseKeysDeep from 'camelcase-keys-deep';

const defaultState = {
    layout: null,
    inProgress: null
};

export function previewAlbum( state = defaultState, {type, payload}) {
    switch ( type ) {
        case ALBUM_LAYOUT_GET_FROM_SERVER:
            return {
                ...state,
                inProgress: true
            };
        case ALBUM_LAYOUT_GET_FROM_SERVER_FAIL:
            return {
                ...state,
                inProgress: false
            };
        case ALBUM_LAYOUT_PUT:
            delete (payload[ '_id' ]);
            return {
                ...state,
                layout: camelcaseKeysDeep( payload ),
                inProgress: false
            };
        default:
            return state;
    }
}
