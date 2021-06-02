import { lazy } from "react";
import {
    modalAuthSelector,
    modalThemeInfoSelector,
    modalConditionSelector,
    modalSpecProjectSelector,
    modalPreviewAlbumSelector,
    modalOrderDeliveryInfoSelector,
    modalPaymentDeclinedSelector,
    modalCreatePhotoFolderSelector,
    modalShowPhotosFoldersSelector,
    modalPaymentAcceptedSelector,
    modalPaymentInfoSelector,
    modalPhotosUploadSelector,
    modalDeleteConfirmSelector,
    modalContactsSelector,
    modalUploadSocialPhotosSelector,
    modalMyPhotosSelector,
    modalPosterConfigSelector,
    modalAdminDialogSelector,
    modalProductProblemInfo,
    modalProductPhotoQuality,
    modalSimplePreviewSelector
} from 'selectors/modals'

import {
    modalConditionAction,
    modalSpecProjectAction,
    modalPreviewAlbumAction,
    modalPaymentDeclinedAction,
    modalCreatePhotoFolderAction,
    modalPaymentAcceptedAction,
    modalPaymentInfoAction,
    modalDeleteConfirmAction,
    modalUploadSocialPhotosAction,
    modalMyPhotosAction,
    modalPhotosFoldersAction,
    modalContactsMapAction,
    modalOrderDeliveryInfoAction,
    modalPhotosUploadAction,
    modalPosterConfigAction,
    modalAdminDialogAction,
    modalProductPhotoQualityAction
} from 'actions/modals'

import {
    modalUploadStickersAction,
    modalCreateThemeAction,
    modalUploadBackgroundsAction,
    modalAdminThemeCopyAction
} from '__TS/actions/modals'
import {
    modalAutoFillAction
} from '__TS/actions/photo'

import {
    modalUploadStickersSelector,
    modalCreateThemeSelector,
    modalAdminThemePreviewSelector,
    modalUploadBackgroundsSelector,
    modalAutoFillSelector,
    modalAdminThemeCopySelector
} from '__TS/selectors/modals'

import {modalUserAuthAction} from "actions/user";
import {modalGalleryThemeInfoAction} from "components/_pages/GalleryPage/actions/themes";

import {previewPhotoIdSelector} from "components/_modals/PreviewPhoto/selectors";

import { retry } from 'libs/helpers';

export default {
    auth: {
        component: lazy( () => retry( () => import('modals/Auth') ) ),
        selector: modalAuthSelector,
        action: modalUserAuthAction,
        size: 'xs',
    },
    theme: {
        component: lazy( () => retry( () => import('modals/ThemePreview') ) ),
        selector: modalThemeInfoSelector,
        action: modalGalleryThemeInfoAction,
        title: 'Загрузка темы'
    },
    modalSpecProjectSelector: {
        component: lazy( () => retry( () => import('modals/SpecProject') ) ),
        selector: modalSpecProjectSelector,
        action: modalSpecProjectAction,
        size: 'xs',
        title: 'Введите код доступа'
    },
    modalPreviewAlbumSelector: {
        component: lazy( () => retry( () => import('modals/PreviewAlbum') ) ),
        selector: modalPreviewAlbumSelector,
        action: modalPreviewAlbumAction,
        title: 'Загрузка альбома'
    },
    modalSimplePreview: {
        component: lazy( () => retry( () => import('modals/SimplePreview') ) ),
        selector: modalSimplePreviewSelector,
        minimal: true,
    },
    modalThemePreview: {
        component: lazy( () => retry( () => import('__TS/components/_modals/AdminThemePreview') ) ),
        selector: modalAdminThemePreviewSelector,
        minimal: true,
    },
    modalThemeCopy: {
        component: lazy( () => retry( () => import('__TS/components/_modals/ModalThemeCopy') ) ),
        selector: modalAdminThemeCopySelector,
        action: modalAdminThemeCopyAction,
        size: 'xs',
        title: 'Копирование темы'
    },
    modalDeleteConfirm: {
        component: lazy( () => retry( () => import('modals/DeleteConfirm') ) ),
        selector: modalDeleteConfirmSelector,
        action: modalDeleteConfirmAction,
        title: 'Подтвердите действие',
        size: 'xs',
    },
    modalUploadSocialPhotos: {
        component: lazy(() => retry( () => import('modals/UploadSocialPhotos'))),
        selector: modalUploadSocialPhotosSelector,
        action: modalUploadSocialPhotosAction,
        title: 'Загрузка фотографий из соцсетей',
    },
    condition: {
        component: lazy( () => retry( () => import('modals/Condition') ) ),
        selector: modalConditionSelector,
        action: modalConditionAction,
        size: 'md',
    },
    orderDeliveryInfo: {
        component: lazy( () => retry( () => import('modals/OrderDeliveryInfo') ) ),
        selector: modalOrderDeliveryInfoSelector,
        action: modalOrderDeliveryInfoAction,
        title: 'Информация о заказе',
        size: 'xl',
    },
    paymentAccepted: {
        component: lazy( () => retry( () => import('modals/PaymentAccepted') ) ),
        selector: modalPaymentAcceptedSelector,
        action: modalPaymentAcceptedAction,
        title: 'Оплата успешно выполнена',
        size: 'xs',
    },
    paymentDeclined: {
        component: lazy( () => retry( () => import('modals/PaymentDeclined') ) ),
        selector: modalPaymentDeclinedSelector,
        action: modalPaymentDeclinedAction,
        title: 'Оплата не удалась',
        size: 'xs',
    },
    paymentInfo: {
        component: lazy( () => retry( () => import('modals/PaymentInfo') ) ),
        selector: modalPaymentInfoSelector,
        action: modalPaymentInfoAction,
        size: 'xs',
    },
    createPhotoFolder: {
        component: lazy( () => retry( () => import('modals/CreatePhotoFolder') ) ),
        selector: modalCreatePhotoFolderSelector,
        action: modalCreatePhotoFolderAction,
        title: 'Введите имя папки',
        size: 'xs',
    },
    showPhotosFolders: {
        component: lazy( () => retry( () => import('modals/PhotosFolders') ) ),
        selector: modalShowPhotosFoldersSelector,
        action: modalPhotosFoldersAction,
        title: 'Выберите папку',
        size: 'xs',
    },
    showPhotosUpload: {
        component: lazy( () => retry( () => import('modals/PhotosUpload') ) ),
        selector: modalPhotosUploadSelector,
        action: modalPhotosUploadAction,
        title: 'Загрузка фотографий',
    },
    contacts: {
        component: lazy(() => retry( () => import('modals/ContactsMap'))),
        selector: modalContactsSelector,
        action: modalContactsMapAction,
        title: 'Наши Контакты',
    },

    myPhotos: {
        component: lazy(() =>  retry( () =>import('modals/MyPhotos'))),
        selector: modalMyPhotosSelector,
        action: modalMyPhotosAction,
        title: 'Мои фотографии'
    },
    autoFill: {
        component: lazy(() =>  retry( () =>import('__TS/components/_modals/ModalAutoFill'))),
        selector: modalAutoFillSelector,
        action: modalAutoFillAction,
        title: 'Выберите фотографии для размещения'
    },
    posterConfig: {
        component: lazy(() => retry( () => import('modals/PosterConfig'))),
        selector: modalPosterConfigSelector,
        action: modalPosterConfigAction,
        size: 'xl',
    },
    adminDialog: {
        component: lazy(() => retry( () => import('modals/AdminDialog'))),
        selector: modalAdminDialogSelector,
        action: modalAdminDialogAction,
        title: ' '
    },
    photoPreview: {
        component: lazy(() => retry( () => import('modals/PreviewPhoto'))),
        selector: previewPhotoIdSelector,
        minimal: true
    },
    productProblemInfo: {
        component: lazy(() => retry( () => import('modals/ProductProblemInfo'))),
        selector: modalProductProblemInfo,
        title: 'Внимание! В данный продукт были внесены изменения.',
        size: 'lg',
    },
    productPhotoQuality: {
        component: lazy(() => retry( () => import('modals/ProductPhotoQuality'))),
        selector: modalProductPhotoQuality,
        action: modalProductPhotoQualityAction,
        title: 'Просмотр в реальном масштабе при печати',
        size: 'lg',
    },

    modalUploadStickers: {
        component: lazy(() => retry( () => import('__TS/components/_modals/ModalUploadStickers'))),
        selector: modalUploadStickersSelector,
        action: modalUploadStickersAction,
        title: 'Загрузка стикеров',
        size: 'lg',
    },
    modalCreateTheme: {
        component: lazy(() => retry( () => import('__TS/components/_modals/ModalCreateTheme'))),
        selector: modalCreateThemeSelector,
        action: modalCreateThemeAction,
        title: 'Создание темы',
        size: 'xs',
    },
    modalUploadBackgrounds: {
        component: lazy(() => retry( () => import('__TS/components/_modals/ModalUploadBackgrounds'))),
        selector: modalUploadBackgroundsSelector,
        action: modalUploadBackgroundsAction,
        title: 'Загрузка фонов',
        size: 'lg',
    },

}






