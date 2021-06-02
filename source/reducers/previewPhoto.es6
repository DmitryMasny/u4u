import {
    MY_PHOTOS_PREVIEW_PHOTO,
    MY_PHOTOS_PREVIEW_PHOTO_SLIDE,
    MY_PHOTOS_REMOVE_PHOTOS,
    MY_PHOTOS_DELETE_PHOTOS,
    MY_PHOTOS_REMOVE_FROM_FOLDER,
    MY_PHOTOS_SET_PHOTO,
    MY_PHOTOS_ROTATE_PHOTO,
    MY_PHOTOS_SELECT_FOLDER,
    MY_PHOTOS_MODAL_PROGRESS,
    MY_PHOTOS_MODAL_REMOVE_PHOTO
} from 'const/actionTypes';

const defaultState = {
    photoId:    null,
    photoUrl:   null,
    next:       null,
    prev:       null,
    folderId:   null,
    index:      null,
    list:       null,
    inProgress: false,
    actions: null,
    noActions: false
};

export function previewPhoto( state = defaultState, {type, payload}) {
    switch ( type ) {
        case MY_PHOTOS_DELETE_PHOTOS:
        case MY_PHOTOS_REMOVE_FROM_FOLDER:
        case MY_PHOTOS_MODAL_PROGRESS:
            return { ...state, inProgress: true };


        case MY_PHOTOS_SELECT_FOLDER:
             return state.photoId ? defaultState : state;

        case MY_PHOTOS_PREVIEW_PHOTO:
            if ( !payload || !payload.list ) return defaultState;

            for ( let i = 0; i < payload.list.length; i++ ) {
                if ( payload.list[ i ].photoId === payload.id ) {
                    return {
                        ...state,
                        photoId: payload.id,
                        photoUrl: payload.list[i].url,
                        folderId: payload.folderId,
                        next: payload.list[i+1] && payload.list[i+1].photoId,
                        prev: payload.list[i-1] && payload.list[i-1].photoId,
                        list: payload.list,
                        size: payload.size,
                        thumbSize: payload.thumbSize,
                        actions: payload.actions,
                        index: i,
                        inProgress: false,
                        noActions: payload.noActions || false
                    };
                }
            }
            return state;

        case MY_PHOTOS_PREVIEW_PHOTO_SLIDE:
            const  isNext = payload === 'next';
            const  nextPhoto = isNext ? state.list[state.index + 1] : state.list[state.index - 1];

            return {
                ...state,
                photoId: nextPhoto.photoId,
                photoUrl: nextPhoto.url,
                angle: nextPhoto.angle,
                size: nextPhoto.size,
                inProgress: nextPhoto.inProgress,
                next: isNext ? !!state.list[state.index + 2] : true,
                prev: isNext ? true : !!state.list[state.index - 2],
                index: isNext ? state.index+1 : state.index-1,
            };

        case MY_PHOTOS_REMOVE_PHOTOS:
            if (!state.list) return state;
            const newList = state.list.filter((item)=> item.id && !~payload.list.indexOf(item.id));

            if (!newList || !newList.length) return defaultState;

            const  newIsNext = (state.list.length - 1) > state.index;
            const  newNextPhoto = newIsNext ? state.list[state.index + 1] : state.list[state.index - 1];

            return newNextPhoto ? {
                ...state,
                photoId: newNextPhoto.photoId,
                photoUrl: newNextPhoto.url,
                next: newIsNext ? !!newList[state.index + 1] : false,
                prev: newIsNext ? !!newList[state.index - 1] : !!newList[state.index - 2],
                index: newIsNext ? state.index : state.index-1,
                list: newList,
                inProgress: false
            } : [];

        case MY_PHOTOS_MODAL_REMOVE_PHOTO:
            if (!state.list) return state;
            const newList2 = state.list.filter((item)=> (item.id || item.photoId) !== payload);

            if (!newList2 || !newList2.length) return defaultState;

            const  newIsNext2 = (state.list.length - 1) > state.index;
            const  newNextPhoto2 = newIsNext2 ? state.list[state.index + 1] : state.list[state.index - 1];

            return newNextPhoto2 ? {
                ...state,
                photoId: newNextPhoto2.photoId,
                photoUrl: newNextPhoto2.url,
                next: newIsNext2 ? !!newList2[state.index + 1] : false,
                prev: newIsNext2 ? !!newList2[state.index - 1] : !!newList2[state.index - 2],
                index: newIsNext2 ? state.index : state.index-1,
                list: newList2,
                inProgress: false
            } : [];

        case MY_PHOTOS_ROTATE_PHOTO:
            return {
                ...state,
                inProgress: true,
                list: state.list.map((photo)=>{
                    if (photo.photoId === payload.photoId) {
                        return {...photo, inProgress: true, angle: payload.angle }
                    } else return photo;
                }),
            };

        case MY_PHOTOS_SET_PHOTO:
            if (!state.photoId) return state;
            return {
                ...state,
                ... (state.photoId === payload.photoId) && {
                    ... !payload.data.error && { photoUrl:  payload.data.url },
                    inProgress: false,
                    angle: 0
                },
                list: state.list.map((photo)=>{
                    if (photo.photoId === payload.photoId) {
                        return payload.data.error ?
                        {...photo, inProgress: false, angle: 0}
                        :
                        {...photo, ...payload.data, angle: 0}
                    } else return photo;
                }),
            };

        default:
            return state;
    }
}
