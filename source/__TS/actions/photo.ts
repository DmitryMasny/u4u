import { store } from "components/App";
import { IPhoto } from "__TS/interfaces/photo";

import { productPhotosSelector } from '__TS/selectors/photo';

// @ts-ignore
import { MY_PHOTOS_PREVIEW_PHOTO, MODAL_EDITOR_AUTOFILL, MODAL_EDITOR_ADD_PHOTOS, MY_PHOTOS_MODAL_REMOVE_PHOTO, MY_PHOTOS_MODAL_PROGRESS } from "const/actionTypes";

//получаем диспетчер Redux
const dispatch = store.dispatch;

/** Interfaces */
interface IModalMyPhotosAction {
    callback: any;
    modalTitle: string;
    maxSelectCount: number;
    droppedFiles?: any[];
}

/**
 * Экшен Показываем слайдер превью фотографий
 * @param photoId
 * @param actions
 */
export const showPreviewPhotoSliderAction = ( photoId : string, actions = null ) => {
    const photosList: Array<IPhoto> = [ ...productPhotosSelector( store.getState() ) ];
    dispatch( {
        type: MY_PHOTOS_PREVIEW_PHOTO,
        payload: {
            id: photoId,
            list: photosList,
            actions: actions,
            noActions: true
        }
    } );
}
export const removePhotoInPreviewAction = ( photoId : string ) => {
    dispatch( {
        type: MY_PHOTOS_MODAL_REMOVE_PHOTO,
        payload: photoId
    } );
}
export const removePhotoInProgressAction = (  ) => {
    dispatch( {
        type: MY_PHOTOS_MODAL_PROGRESS
    } );
}

/**
 * Экшен модалка добавления фото в редактор
 * @param props
 */
export const modalMyPhotosAction = ( props: IModalMyPhotosAction ) => dispatch( {
    type: MODAL_EDITOR_ADD_PHOTOS,
    payload: props
} );

/**
 * Экшен модалка авторазмещения фото в редакторе
 * @param props
 */
export const modalAutoFillAction = ( props: any = null ) => dispatch( {
    type: MODAL_EDITOR_AUTOFILL,
    payload: props
} );
