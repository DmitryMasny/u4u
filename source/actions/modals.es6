import {
    MODAL_CONDITION,
    MODAL_SPEC_PROJECT,
    MODAL_PREVIEW_ALBUM,
    MODAL_CONTACTS,
    MODAL_ORDER_DELIVERY_INFO,
    MODAL_PAYMENT_ACCEPTED,
    MODAL_CREATE_PHOTO_FOLDER,
    MODAL_PAYMENT_DECLINED,
    MODAL_PAYMENT_INFO,
    MY_PHOTOS_CREATE_FOLDER,
    MODAL_PHOTOS_FOLDERS,
    MY_PHOTOS_SET_NEW_FOLDER,
    MODAL_DELETE_CONFIRM,
    MODAL_PHOTOS_UPLOAD,
    MODAL_UPLOAD_SOCIAL_PHOTOS,
    MODAL_EDITOR_ADD_PHOTOS,
    MODAL_POSTER_CONFIG,
    MODAL_ADMIN_DIALOG,
    MODAL_PREVIEW_PHOTO,
    MODAL_PRODUCT_PROBLEM_INFO,
    MODAL_PHOTO_QUALITY,
    MODAL_SIMPLE_PREVIEW,
} from 'const/actionTypes';


//condition
export const modalConditionAction    = ( show = true ) => ({ type: MODAL_CONDITION, payload: show });

//превью альбома
export const modalPreviewAlbumAction = ( o = null ) => ({ type: MODAL_PREVIEW_ALBUM, payload: o });
//превью альбома
export const modalSimplePreviewAction = ( o = null ) => ({ type: MODAL_SIMPLE_PREVIEW, payload: o });

//спецпроект
export const modalSpecProjectAction = ( show = true ) => ({ type: MODAL_SPEC_PROJECT, payload: show });

//наши контакты
export const modalContactsMapAction  = ( show = true ) => ({ type: MODAL_CONTACTS, payload: show });

//информация о доставке заказа
export const modalOrderDeliveryInfoAction  = ( obj = null ) => ({ type: MODAL_ORDER_DELIVERY_INFO, payload: obj });

//информация о успешной оплате
export const modalPaymentAcceptedAction  = ( show = true ) => ({ type: MODAL_PAYMENT_ACCEPTED, payload: show });

//информация о неудачной оплате
export const modalPaymentDeclinedAction  = ( show = true ) => ({ type: MODAL_PAYMENT_DECLINED, payload: show });

//информация о оплате
export const modalPaymentInfoAction  = ( obj = null ) => ({ type: MODAL_PAYMENT_INFO, payload: obj });

// модалка названия новой папки
export const modalCreatePhotoFolderAction  = ( obj = null ) => ({ type: MODAL_CREATE_PHOTO_FOLDER, payload: obj });

// модалка подтверждение удаления фоток или папки
export const modalDeleteConfirmAction  = ( obj = null ) => ({ type: MODAL_DELETE_CONFIRM, payload: obj });

// создать новую папку
export const createPhotoFolderAction  = ( name ) => ({
    type: MY_PHOTOS_CREATE_FOLDER,
    payload: {
        name: name,
        // urlParams: [id, 'generate-layout'],
        actions: {
            inSuccess: ( data ) => ({ type: MY_PHOTOS_SET_NEW_FOLDER, payload: data.response }),
            inFail: ( err ) => ({ type: MY_PHOTOS_SET_NEW_FOLDER, payload: { error: err && err.error } })
        }
    }
});

// модалка выбора папки
export const modalPhotosFoldersAction  = ( o ) => ({ type: MODAL_PHOTOS_FOLDERS, payload: o });

// модалка загрузки
export const modalPhotosUploadAction  = ( o ) => ({ type: MODAL_PHOTOS_UPLOAD, payload: o });

// модалка загрузки фоток из соцсетей (Google, Instagram, VK, Yandex)
export const modalUploadSocialPhotosAction  = ( o ) => ({ type: MODAL_UPLOAD_SOCIAL_PHOTOS, payload: o });

// модалка добавления фото в редактор
export const modalMyPhotosAction  = ( o ) => ({ type: MODAL_EDITOR_ADD_PHOTOS, payload: o });

// модалка настроек постера
export const modalPosterConfigAction  = ( o ) => ({ type: MODAL_POSTER_CONFIG, payload: o });

// модалка админки
export const modalAdminDialogAction  = ( o ) => ({ type: MODAL_ADMIN_DIALOG, payload: o });

// модалка админки
export const modalPreviewPhotoAction  = ( o ) => ({ type: MODAL_PREVIEW_PHOTO, payload: o });

// модалка проблемы с продуктом
export const modalProductProblemInfo  = ( o ) => ({ type: MODAL_PRODUCT_PROBLEM_INFO, payload: o });

// модалка оценки качества изображения
export const modalProductPhotoQualityAction  = ( o ) => ({ type: MODAL_PHOTO_QUALITY, payload: o });

