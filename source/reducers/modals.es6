//редюсер октрытия и закрытия окна авторизации/регистрации
import {
    MODAL_GALLERY_THEME_INFO,
    MODAL_AUTH,
    MODAL_CONDITION,
    MODAL_PREVIEW_ALBUM,
    MODAL_SPEC_PROJECT,
    MODAL_ORDER_DELIVERY_INFO,
    MODAL_PAYMENT_DECLINED,
    MODAL_PAYMENT_ACCEPTED,
    MODAL_PAYMENT_INFO,
    MODAL_CREATE_PHOTO_FOLDER,
    MODAL_PHOTOS_FOLDERS,
    MODAL_PHOTOS_UPLOAD,
    MODAL_DELETE_CONFIRM,
    MODAL_CONTACTS,
    MODAL_UPLOAD_SOCIAL_PHOTOS,
    MODAL_EDITOR_ADD_PHOTOS,
    MODAL_EDITOR_AUTOFILL,
    MODAL_POSTER_CONFIG,
    MODAL_ADMIN_DIALOG,
    MODAL_PREVIEW_PHOTO,
    MODAL_PRODUCT_PROBLEM_INFO,
    MODAL_PHOTO_QUALITY,
    MODAL_UPLOAD_STICKERS,
    MODAL_CREATE_THEME,
    MODAL_SIMPLE_PREVIEW,
    MODAL_ADMIN_THEME_PREVIEW,
    MODAL_ADMIN_THEME_COPY,
    MODAL_UPLOAD_BACKGROUNDS,
    MODAL_DIALOG_ADD,
    MODAL_DIALOG_REMOVE
} from 'const/actionTypes';
//import {modalAdminDialogAction} from "../actions/modals";

const defaultState = {
    previewAlbum: null,
    specProject: null,
    themeInfo: null,
    auth: null,
    condition: null,
    contacts: null,
    orderDeliveryInfo: null,
    userAgreement: null,
    paymentAccepted: null,
    paymentDeclined: null,
    paymentInfo: null,
    createPhotoFolder: null,
    showPhotosFolders: null,
    showPhotosUpload: null,
    deleteConfirm: null,
    uploadGooglePhotos: null,
    uploadInstagramPhotos: null,
    uploadVkPhotos: null,
    uploadYandexPhotos: null,
    posterConfig: null,
    adminDialog: null,
    previewPhoto: null,
    productProblemInfo: null,
    productPhotoQuality: null,
    modalUploadStickers: null,
    simplePreview: null,
    adminThemePreview: null,
    adminThemeCopy: null,
    modalUploadBackgrounds: null,
    autoFill: null,
    modalDialog: []
};

export function modals( state = defaultState, { type, payload } ) {
    switch ( type ) {
        case MODAL_AUTH:                 return {...state, auth: payload};
        case MODAL_CONTACTS:             return {...state, contacts: payload};
        case MODAL_CONDITION:            return {...state, condition: payload};
        case MODAL_SPEC_PROJECT:         return {...state, specProject: payload};
        case MODAL_PREVIEW_ALBUM:        return {...state, previewAlbum: payload};
        case MODAL_PAYMENT_ACCEPTED:     return {...state, paymentAccepted: payload};
        case MODAL_PAYMENT_DECLINED:     return {...state, paymentDeclined: payload};
        case MODAL_PAYMENT_INFO:         return {...state, paymentInfo: payload};
        case MODAL_GALLERY_THEME_INFO:   return {...state, themeInfo: payload};
        case MODAL_CREATE_PHOTO_FOLDER:  return {...state, createPhotoFolder: payload};
        case MODAL_PHOTOS_FOLDERS:       return {...state, showPhotosFolders: payload};
        case MODAL_PHOTOS_UPLOAD:        return {...state, showPhotosUpload: payload && state.showPhotosUpload && { ...state.showPhotosUpload, ...payload} || payload};
        case MODAL_ORDER_DELIVERY_INFO:  return {...state, orderDeliveryInfo: payload};
        case MODAL_DELETE_CONFIRM:       return {...state, deleteConfirm: payload};
        case MODAL_UPLOAD_SOCIAL_PHOTOS: return {...state, uploadSocialPhotos: payload};
        case MODAL_EDITOR_ADD_PHOTOS:    return {...state, myPhotos: payload};
        case MODAL_EDITOR_AUTOFILL:      return {...state, autoFill: payload};
        case MODAL_POSTER_CONFIG:        return {...state, posterConfig: payload};
        case MODAL_ADMIN_DIALOG:         return {...state, adminDialog: payload};
        case MODAL_PREVIEW_PHOTO:        return {...state, previewPhoto: payload};
        case MODAL_PRODUCT_PROBLEM_INFO: return {...state, productProblemInfo: payload};
        case MODAL_PHOTO_QUALITY:        return {...state, productPhotoQuality: payload};
        case MODAL_SIMPLE_PREVIEW:       return {...state, simplePreview: payload};
        case MODAL_UPLOAD_STICKERS:      return {...state, modalUploadStickers: payload};
        case MODAL_CREATE_THEME:         return {...state, modalCreateTheme: payload};
        case MODAL_ADMIN_THEME_PREVIEW:  return {...state, adminThemePreview: payload};
        case MODAL_ADMIN_THEME_COPY:     return {...state, adminThemeCopy: payload};
        case MODAL_UPLOAD_BACKGROUNDS:   return {...state, modalUploadBackgrounds: payload};

        case MODAL_DIALOG_ADD:           return {...state, modalDialog: [...state.modalDialog, payload]};
        case MODAL_DIALOG_REMOVE:        return {...state, modalDialog: state.modalDialog.filter((m)=> m.id !== payload)};

        default:
            return state;
    }
}
