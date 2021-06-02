import { GALLERY_SET_CURRENT_FORMAT } from 'const/actionTypes';

//получение категорий с сервера
export const gallerySetCurrentFormatAction = ( format = false ) => ({type: GALLERY_SET_CURRENT_FORMAT, payload: format});

export const gallerySetSpecProjectAction = ( format = false ) => ({type: GALLERY_SET_CURRENT_FORMAT, payload: format});

