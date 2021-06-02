// @ts-ignore
import { store } from "components/App";
// @ts-ignore
import { modalPosterConfigAction } from "actions/modals";
// @ts-ignore
import { toast } from '__TS/libs/tools';
// @ts-ignore
import {
    EDITOR_SET_TAB,
    EDITOR_SET_LIBRARY_RESIZING,
    EDITOR_SET_MAGNETIC,
    EDITOR_ADD_NOT_GOOD_PHOTO,
    EDITOR_DELETE_NOT_GOOD_PHOTO,
    EDITOR_SET_CONTROL_ELEMENT_ID,
    EDITOR_ADD_NOT_ACCEPTED_PHOTO,
    EDITOR_DELETE_NOT_ACCEPTED_PHOTO,
    EDITOR_CLEAR_NOT_GOOD_AND_NOT_ACCEPTED_PHOTO,
    EDITOR_TOGGLE_PHOTO_SHOW_ONLY_USED,
    EDITOR_RATIO,
    EDITOR_SET_FULLSCREEN_LOADER,
    EDITOR_STICKERS_SET_STICKERS_COLLECTION,
    EDITOR_BACKGROUND_SET_BACKGROUND_THEME_COLLECTION,
    PRODUCT_AREA_SET_LIST_IDS,
    PRODUCT_RESET_CHANGES_COUNT,
    EDITOR_CLEAR_THEME_DATA,
    EDITOR_SET_SELECTED_AREA,
    SET_EXIT_CONFIRM_MODAL,

    // @ts-ignore
} from "const/actionTypes";
// @ts-ignore
import { modalMyPhotosAction, modalAutoFillAction } from "__TS/actions/photo";
// @ts-ignore
import { updateLibraryPhotosInProductLayoutOnServerAction, autoFillPhotosAction } from "__TS/actions/layout";
// @ts-ignore
import { IPhoto } from "__TS/interfaces/photo";
// @ts-ignore
import { IStickers } from "__TS/interfaces/stickers";
// @ts-ignore
import { ILayoutContentPhoto } from "__TS/interfaces/layout";
// @ts-ignore
import { IlibraryItem } from "__TS/components/Library/_interfaces";
import { uploadSticker } from "../../libs/upload";

// @ts-ignore
import { EDITOR_TABS } from '__TS/components/Editor/_config'
import { currentTabSelector, currentBgIdSelector } from "./_selectors";
// @ts-ignore
import { actionSetCurrentControlElementId } from "components/LayoutConstructor/actions.es6";

//получаем диспетчер Redux
const dispatch = store.dispatch;

/** Interfaces */
interface IPhotoInPhoto {
    photo: IPhoto[]
}

/**
 * Экшены для редактора
 */
export const setNavBarTabAction = ( tab: string ) => dispatch( ( dispatch, getState ) => {
    const state = getState();
    const currentTab: string = currentTabSelector( state );
    const currentBgId: string = currentBgIdSelector( state );

    if ( tab === EDITOR_TABS.BACKGROUNDS ) {
        setControlElement( { blockId: currentBgId, blockType: 'background' } );
    } else if ( currentTab === EDITOR_TABS.BACKGROUNDS ) {
        setControlElement( { blockId: 0, blockType: '' } );
    }

    dispatch( { type: EDITOR_SET_TAB, payload: tab } );
});

export const setLibraryResizingAction = ( active: boolean ) => dispatch( { type: EDITOR_SET_LIBRARY_RESIZING, payload: active } );

export const setShowFormatModalAction = ( { title, preview }: { title: string, preview?: string } ) => dispatch( modalPosterConfigAction(
                                                                        { modalTitle: title, preview: preview }
                                                                    ));

//показываем окно добавления фотографий
export const showSelectPhotoModalAction = ( isAdmin: boolean = false ) => {
    modalMyPhotosAction( {
        callback: ( photosList: IPhotoInPhoto ) => updateLibraryPhotosInProductLayoutOnServerAction( { photosList: photosList.photo, isAdmin: isAdmin } ),
        modalTitle: 'Выберите фотографии',
        maxSelectCount: 10000
    } );
}
//показываем окно авторазмещения
export const showAutoFillModalAction = ( {photosList = [], emptyBlocksCount = 0}: { photosList: IlibraryItem[], emptyBlocksCount: number } ) => {
    modalAutoFillAction( {
        photosList: photosList,
        emptyBlocksCount: emptyBlocksCount,
        callback: ( photosList: any[] ) => autoFillPhotosAction( { photosList: photosList } ),
    } );
}
//показываем окно добавления стикеров
export const showUploadStickersModalAction = (themeId: string) => new Promise((resolve, reject)=> {
    uploadSticker( { themeId: themeId, acceptFormats: [ 'png' ] } ).then( ( data: any ) => {
        addStickersInPackAction('theme', {stickerList: data}, true );
        resolve();
    } ).catch( ( err ) => {
        reject( err );
        console.error( 'ERROR ', err );
    } )
});

// добавляем фоны
export const addBackgroundsInThemePackAction = (  packId: string, backgrounds: any, addOnly: boolean = false) => dispatch( {
    type: EDITOR_BACKGROUND_SET_BACKGROUND_THEME_COLLECTION,
    payload: { id: packId, data: backgrounds, addOnly: addOnly }
} );

// добавляем стикеры
export const addStickersInPackAction = ( packId: string, stickers: IStickers, addToPack: boolean = false ) => dispatch( {
    type: EDITOR_STICKERS_SET_STICKERS_COLLECTION,
    payload: { id: packId, data: stickers, addToPack: addToPack }
} );

// очищаем фоны и стикеры (при загрузке редактора например)
export const clearEditorThemeDataAction = (  ) => dispatch( {
    type: EDITOR_CLEAR_THEME_DATA
} );

export const setControlElement = ( { blockId, blockType }: { blockId: string | number, blockType: string } ) => dispatch( {
    type: EDITOR_SET_CONTROL_ELEMENT_ID,
    payload: { blockId: blockId, blockType: blockType }
} );

export const toggleMagneticAction = () => dispatch( {
    type: EDITOR_SET_MAGNETIC
} );

export const photoLibraryShowOnlyNotUsedToggleAction = () => dispatch( {
    type: EDITOR_TOGGLE_PHOTO_SHOW_ONLY_USED
} );

export const setAddNotGoodPhoto = ( content: ILayoutContentPhoto ) => dispatch( {
    type: EDITOR_ADD_NOT_GOOD_PHOTO,
    payload: {
        id: content.id,
        url: content.url,
        pxHeight: content.pxHeight,
        pxWidth: content.pxWidth
    }
} );

export const setDeleteNotGoodPhoto = ( { id }: { id: string } ) => dispatch( {
    type: EDITOR_DELETE_NOT_GOOD_PHOTO,
    payload: {
        id: id
    }
} );

export const setAddNotAcceptedPhoto = ( content: ILayoutContentPhoto ) => dispatch( {
    type: EDITOR_ADD_NOT_ACCEPTED_PHOTO,
    payload: {
        id: content.id,
        url: content.url,
        pxHeight: content.pxHeight,
        pxWidth: content.pxWidth
    }
} );

export const setDeleteNotAcceptedPhoto = ( { id }: { id: string } ) => dispatch( {
    type: EDITOR_DELETE_NOT_ACCEPTED_PHOTO,
    payload: {
        id: id
    }
} );

export const setClearNotGoodAndNotAcceptedPhoto = () => dispatch( {
    type: EDITOR_CLEAR_NOT_GOOD_AND_NOT_ACCEPTED_PHOTO
} );

export const setRatioAction = ( ratio: number ) => dispatch( {
    type: EDITOR_RATIO,
    payload: {
        ration: ratio
    }
} );
export const setFullscreenLoader = ( show: boolean ) => dispatch( {
    type: EDITOR_SET_FULLSCREEN_LOADER,
    payload: show
} );


// Устанавливаем новый порядок areas
export const saveAreasOrderAction = ( areas: string[] ) => dispatch( {
    type: PRODUCT_AREA_SET_LIST_IDS,
    payload: areas
} );

// Устанавливаем текуйщую area
export const setAreaSelectedAction = ( areaNum: number ) => {
    dispatch( actionSetCurrentControlElementId( 0 )) // снимаем выделение с блока
    return dispatch( {
        type: EDITOR_SET_SELECTED_AREA,
        payload: areaNum
    } );
}


// Сбрасываем счётчик изменений после сохранения
export const resetLayoutChangesCountAction = () => dispatch( {
    type: PRODUCT_RESET_CHANGES_COUNT
} );

// Сбрасываем счётчик изменений после сохранения
export const setExitConfirmModalAction = (o: any) => dispatch( {
    type: SET_EXIT_CONFIRM_MODAL,
    payload: o
} );
//
export const setCurrentControlElementAction = ({ blockId, blockType }: { blockId: string, blockType: string }) =>
    dispatch(actionSetCurrentControlElementId({ blockId, blockType }))