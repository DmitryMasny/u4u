// @ts-ignore
import { store } from "components/App";
// @ts-ignore
import {
    contentLayoutByBlockIdSelector,
    productLayoutSelector
// @ts-ignore
} from '__TS/selectors/layout';
// @ts-ignore
import { productLayoutTemplatesSelector } from '__TS/selectors/templates';

// @ts-ignore
import { productPhotoByIdSelector, productPhotosSelector } from '__TS/selectors/photo';
// @ts-ignore
import { stickerByIdSelector } from '__TS/selectors/stickers';
// @ts-ignore
import { toast } from '__TS/libs/tools';
// @ts-ignore
import { backgroundByIdSelector } from '__TS/selectors/backgrounds';
// @ts-ignore
import { THEME_CUTS_MAP } from 'const/productsTypes';

// @ts-ignore
import { userRoleIsVisitor } from '__TS/selectors/user';
import {
    ILayout,
    ILayoutBlock,
    ILayoutFormat,
    ILayoutOption,
    IBlockOrderType,
    ILayoutContentPhoto,
    ILayoutContentText,
    ILayoutColor
// @ts-ignore
} from '__TS/interfaces/layout';
// @ts-ignore
import { IPhoto } from '__TS/interfaces/photo';
// @ts-ignore
import { IStickers } from '__TS/interfaces/stickers';

import {
    addPhotoToLayout,
    addPhotoInBlockLayout,
    addTextToLayout,
    addStickerToLayout,
    addShapeToLayout,
    addBackgroundToLayout,
    updateBlockWithContentLayout,
    updateFormatOptionsAndProductInfoInLayout,
    createFormatAndOptionAdapter,
    orderBlockChaneInLayout,
    deleteBlockWidthPhotoToLayout,
    productLayoutSetIsCompleted,
    updateTextContent,
    copyBlock,
    mirroringBlock,
    deletePhotoFromBlockToLayout,
    addThemeToPageToLayout
// @ts-ignore
} from '__TS/libs/layout';
import {
    setControlElement,
    setDeleteNotGoodPhoto,
    setDeleteNotAcceptedPhoto,
    setClearNotGoodAndNotAcceptedPhoto,
    resetLayoutChangesCountAction,
// @ts-ignore
} from '__TS/components/Editor/_actions';
// @ts-ignore
import { setFullScreenLoaderAction } from "__TS/actions/main";
// @ts-ignore
import { createOrder } from 'server/commands/postersCommand';
import {
    productSetSelectByIdAction,
    productSetFormatSelectByIdAction,
    productSetFormatRotationAction,
    productSetOptionAction
// @ts-ignore
} from "__TS/actions/products";
// @ts-ignore
import { userLoginShowAction } from "actions/user"
// @ts-ignore
import WS from 'server/ws.es6';
// @ts-ignore
import { generateAllProductPreview } from "components/LayoutConstructor/preview.js";
// @ts-ignore
import { PRODUCT_PUT_PRODUCT_DATA, PRODUCT_SET_IS_COMPLETED, PRODUCT_CLEAR_DATA } from "const/actionTypes";
// @ts-ignore
import { LS_RECOVER_LAYOUT, TIME_SAVE_INTERVAL } from '__TS/components/Editor/_config';
// @ts-ignore
import { addStickersInPackAction, addBackgroundsInThemePackAction } from '__TS/components/Editor/_actions';
import {
    currentControlElementIdSelector,
    currentControlElementTypeSelector,
    currentControlWidthPxSelector,
    ratioSelector
} from "../components/Editor/_selectors";

// @ts-ignore
import { templatesSelector } from "../selectors/templates";
import { IBackground, IBackgroundPack } from "../interfaces/backgrounds";
// @ts-ignore
import { isCalendar } from 'libs/helpers';

// @ts-ignore
import {sendMetric, METRICS} from '__TS/libs/metrics'
// @ts-ignore
import {dialogAddAction} from '__TS/actions/modals';


let saveDebounceTimer: any = null;

//получаем диспетчер Redux
const dispatch = store.dispatch;

/** Interfaces */
interface IReduxAction {
    type: string;
    payload?: any;
}

interface ILayoutFullData {
    layout: ILayout,
    photos?: IPhoto[],
    stickers?: IStickers | null,
    backgrounds?: IBackgroundPack | null
}

interface IThemeTargetLayout {
    width: string;
    height: string;
    id: string;
}

/**
 * Обновляем страницу на указанный шаблона темы
 * @param sourceAreaId
 * @param areaId
 */
export const addTemplateToPageAction = ( { sourceAreaId, areaId }: { sourceAreaId: string, areaId: string } ) => dispatch( ( dispatch, getState ) => {

    //получаем layout
    const layout = <ILayout>productLayoutSelector( getState() );

    //получаем layout
    const layoutTheme = <ILayout>productLayoutTemplatesSelector( getState() );

    if ( !layout || !layoutTheme ) return null;

    const result: { layout: ILayout, photosRemovedIds: string[] } = addThemeToPageToLayout( {
        layout: layout,
        layoutTheme: layoutTheme,
        sourceAreaId: sourceAreaId,
        areaId: areaId,
    } );

    result.photosRemovedIds.map( id => {
        setDeleteNotGoodPhoto( { id: id } );
        setDeleteNotAcceptedPhoto( { id: id } );
    } );

    updateLayoutInReduxAndServerByDebounceAction( { layout: result.layout, checkUsedPhotos: true } );
} );

/**
 * обновляем данные выбранного продукта в redux на основе layout
 * @param layout
 */
const setSelectedDataInProduct = ( { layout }: { layout: ILayout } ) => {

    productSetSelectByIdAction( {
        productSlug: layout.productSlug,
        selectedId: layout.productId
    } );

    productSetFormatSelectByIdAction( {
        id: layout.format.id,
        productSlug: layout.productSlug
    } );

    productSetFormatRotationAction( {
        productSlug: layout.productSlug,
        formatId: layout.format.id,
        formatWidth: layout.format.width,
        formatHeight: layout.format.height
    } );

    if ( layout.options && layout.options.length ) {
        layout.options.map( option => {
            productSetOptionAction( {
                productSlug: layout.productSlug,
                formatId: layout.format.id,
                id: option.formatOptionId,
                filterId: option.id
            } );

        } );
    }
}

/**
 * записываем layout продукта в Redux
 */
export const setLayoutToReduxAction = (layoutData: ILayoutFullData) => {

    productLayoutSaveReduxAction( {
        product: layoutData,
        fromServer: true,
        checkUsedPhotos: true
    } );

    // Добавляем стикеры темы
    if ( layoutData.stickers &&
        layoutData.stickers.stickerList &&
        layoutData.stickers.stickerList.length ) addStickersInPackAction( 'theme', layoutData.stickers )

    // Добавляем стикеры темы
    if ( layoutData.backgrounds &&
        layoutData.backgrounds.backgroundList &&
        layoutData.backgrounds.backgroundList.length ) addBackgroundsInThemePackAction( 'theme', layoutData.backgrounds )

}

/**
 * Отмечаем использованные фотографии в layout
 * @param layout
 * @param photos
 * @param stickers
 */
const setMarkUsedPhotos = ( { layout, photos, ...other }: ILayoutFullData ): ILayoutFullData => {
    if ( !layout ) {
        console.log( 'Нет layout в компонете /action/layout.ts: setMarkUsedPhotos' );
    } else {
        const contentsKey = Object.keys( layout.contents );

        if ( contentsKey && contentsKey.length && photos && photos.length ) {
            //убираем все маркеры
            photos = photos.map( ( photo: IPhoto ) => {
                photo.usedCount = 0;
                return photo;
            } );

            contentsKey.map( key => {

                const content: ILayoutContentPhoto = layout.contents[ key ];

                photos = photos.map( ( photo: IPhoto ) => {

                    if ( photo.photoId === content.photoId ) {
                        if ( photo.usedCount ) {
                            photo.usedCount++;
                        } else {
                            photo.usedCount = 1;
                        }
                    }

                    return photo;
                } );

            } );
        }
    }

    return {
        ...other,
        layout: layout,
        photos: photos,
    }
}

/**
 * Проверка LocalStorage на наличие сохраненного layout
 * @param layoutFullData
 * @param layoutId
 */
const checkLSRecoverLayout = ( layoutFullData, layoutId ) => new Promise( ( resolve, reject ) => {
    const lsSaveData = JSON.parse(localStorage.getItem(LS_RECOVER_LAYOUT));

    //Если есть сохраненка этого layout в LS то загружаем
    if (lsSaveData) {
        if ( lsSaveData.id === layoutId ) {
            dialogAddAction( {
                title: 'Внимание!',
                text: [
                    'На вашем устройстве обнаружено аварийное сохранение проекта.',
                    'Выберите, какое сохранение вы хотите загрузить.',
                    'Загружая сохранение с сервера, ваше аварийное сохранение будет утеряно.'
                ],
                size: 'sm',
                blocked: true,
                actions: [ {
                    text: 'С моего устройства',
                    intent: 'primary',
                    action: ()=> resolve({
                        ...layoutFullData,
                        layout: lsSaveData
                    }),
                    modalClosingBtn: true
                },{
                    divider: true
                },{
                    text: 'Загрузить с сервера',
                    action: ()=> resolve(layoutFullData),
                    modalClosingBtn: true
                } ]
            });
            localStorage.removeItem(LS_RECOVER_LAYOUT);
        } else {
            resolve(layoutFullData)
        }
    } else resolve(layoutFullData);
});

/**
 * получаем layout продукта по id
 * @param productId
 */
export const getLayoutByIdAction = (
    { layoutId, saveToRedux = false, isThemeLayout = false, relatedObjects = null }: { layoutId: string, saveToRedux?: boolean, isThemeLayout?: boolean, relatedObjects?: string[] } ) => new Promise( ( resolve, reject ) => {

    WS.getProductLayout( layoutId, isThemeLayout, relatedObjects ).then( ( layoutFullData: ILayoutFullData ) => {
        // Функция выполняющая все необходимае действия с полученным layout
        const initLayoutData = ( layout ) => {

            // Сохраняем в Redux
            if ( saveToRedux ) setLayoutToReduxAction(layout);

            //устанавливаем выбранные параметры из layout в продукты
            if ( !isThemeLayout ) setSelectedDataInProduct( { layout: layout.layout } );

            resolve( layout );
        }
        // Определяем какой layout надо использовать - с сервера или с LocalStorage
        checkLSRecoverLayout( layoutFullData, layoutId).then( ( lastLayout: ILayoutFullData ) => {
            initLayoutData(lastLayout);
        }).catch( ( err ) => {
            initLayoutData(layoutFullData);
            console.error( 'Ошибка при получении восстановленной копии проекта', err );
        } );

    } ).catch( ( err ) => {
        reject( err );
        console.error( 'Не удалось получить layout с сервера', err );
    } );
} );


/**
 * Кладем layout продукта в Redux, по отдельности (layout, photo)
 * @param product
 */
export const productLayoutSetIsCompletedAction = ( { isCompleted }: { isCompleted: boolean } ) => dispatch( ( dispatch, getState ) => {
    const layout = <ILayout>{ ...productLayoutSelector( getState() ) };
    const result: { layout: ILayout, isUpdated: boolean } = productLayoutSetIsCompleted( {
        layout: layout,
        isCompleted: isCompleted
    } );

    if ( result.isUpdated ) {
        updateLayoutInReduxAndServerByDebounceAction( { layout: result.layout } )
    }
} );


/**
 * Кладем продукт (layout, photos...) в Redux
 * @param product
 * @param fromServer
 * @param forceUpdate
 * @param checkUsedPhotos
 */
export const productLayoutSaveReduxAction = ( { product, fromServer = false, forceUpdate = false, checkUsedPhotos = false }: { product: ILayoutFullData, fromServer?: boolean, forceUpdate?: boolean, checkUsedPhotos?: boolean } ) => {

    const layoutFullDataWithMarketPhotos: ILayoutFullData = checkUsedPhotos ? setMarkUsedPhotos( product ) : product;

    return dispatch( <IReduxAction>{
        type: PRODUCT_PUT_PRODUCT_DATA,
        payload: {
            layout: layoutFullDataWithMarketPhotos.layout || {},
            photos: layoutFullDataWithMarketPhotos.photos || null,
            fromServer: fromServer,
            forceUpdate: forceUpdate
        }
    } );
}

/**
 * Мержим массив id фотографий с уже существующим в layout.photoIds, и сохраняем на сервере
 * результат с сервера снова сохраняем в redux
 * @param photosList
 * @param isAdmin
 */
export const updateLibraryPhotosInProductLayoutOnServerAction = ( { photosList, isAdmin }: { photosList: IPhoto[], isAdmin: boolean } ) => dispatch( ( dispatch, getState ) => {

    const photoIds: Array<string> = photosList.map( ( photoItem: IPhoto ) => photoItem.photoId );
    const layout = <ILayout>{ ...productLayoutSelector( getState() ) };

    //объедененный массив id фотогографий
    const concatArray = [ ...photoIds, ...layout.photoIds ];
    const layoutNew: ILayout = {
        ...layout,
        photoIds: Array.from( new Set( [ ...concatArray ] ) )
    };

    //сохраняем обновленный layout на сервер
    updateLayoutInReduxAndServerByDebounceAction( { layout: layoutNew, updateOnServer: true, isAdmin: isAdmin } );
} );

/**
 * Удаляем из layout.photoIds (библиотеки layout) фотографию с соотвествующим id и обновляем данные на сервере
 * @param photoId
 * @param callback
 */
export const removePhotoInLayoutLibraryByIdAndSaveOnServerAction = ( photoId: string, callback?: any ) => dispatch( ( dispatch, getState ) => {
    const layout = <ILayout>productLayoutSelector( getState() );
    const layoutNew: ILayout = {
        ...layout,
        photoIds: layout.photoIds.filter( ( id: string ) => ( id !== photoId ) )
    }

    //сохраняем обновленный layout на сервер
    updateLayoutInReduxAndServerByDebounceAction( { layout: layoutNew, updateOnServer: true, callback } );
} );


/**
 * Удаляем фотографию из блока
 * @param photoId
 */

export const removePhotoFromBlockAction = ( { blockId }: { blockId: string | number } ) => dispatch( ( dispatch, getState ) => {

    //получаем layout
    const layout = <ILayout>productLayoutSelector( getState() );

    const deleteResult: { layout: ILayout, contentId: string } = deletePhotoFromBlockToLayout( {
        layout: layout,
        blockId
    } );

    setDeleteNotGoodPhoto( { id: deleteResult.contentId } );
    setDeleteNotAcceptedPhoto( { id: deleteResult.contentId } );

    updateLayoutInReduxAndServerByDebounceAction( { layout: deleteResult.layout, checkUsedPhotos: true } );

} );

/**
 * Удаляем блок со страницы
 * @param photoId
 */
export const deleteBlockAction = ( { blockId }: { blockId: string } ) => dispatch( ( dispatch, getState ) => {
    //получаем layout
    const layout = <ILayout>productLayoutSelector( getState() );

    const deleteResult: { layout: ILayout, contentId: string } = deleteBlockWidthPhotoToLayout( {
        layout: layout,
        blockId
    } );

    setDeleteNotGoodPhoto( { id: deleteResult.contentId } );
    setDeleteNotAcceptedPhoto( { id: deleteResult.contentId } );

    setControlElement( { blockId: 0, blockType: '' } );

    updateLayoutInReduxAndServerByDebounceAction( { layout: deleteResult.layout, checkUsedPhotos: true } );
} );

/**
 * Делаем копию блока (со смещением)
 */
export const copyBlockAction = () => dispatch( ( dispatch, getState ) => {
    const storeObj = getState();

    //получаем layout
    const layoutObj = <ILayout>productLayoutSelector( storeObj );

    //получаем id выбранного элемента
    const currentControlElementId: string | number = currentControlElementIdSelector( storeObj );

    //обновляем блок в layout
    const { layout, newBlockId, newBlockType } = copyBlock( { layout: layoutObj, blockId: currentControlElementId } );

    //устанавливаем выбранный элемент по id
    newBlockId && setControlElement( { blockId: newBlockId, blockType: newBlockType } );

    newBlockId && updateLayoutInReduxAndServerByDebounceAction( { layout: layout } );
} );

/**
 * Дазворачиваем (отражаем) контент по горизонтали
 */
export const mirroringBlockAction = () => dispatch( ( dispatch, getState ) => {
    const storeObj = getState();

    //получаем layout
    const layoutObj = <ILayout>productLayoutSelector( storeObj );

    //получаем id выбранного элемента
    const currentControlElementId: string | number = currentControlElementIdSelector( storeObj );

    //обновляем блок в layout
    const { layout } = mirroringBlock( { layout: layoutObj, blockId: currentControlElementId } );

    updateLayoutInReduxAndServerByDebounceAction( { layout: layout } );
} );

/**
 * Обновляем блок текста (без переноса) без сохранения на сервер!
 * @param controlWidthPx
 * @param textLines
 * @param text
 * @param fontId
 * @param fontSize
 * @param lineHeight
 * @param bold
 * @param italic
 * @param horizontal
 * @param vertical
 * @param color
 * @param bgColor
 * @param padding
 * @param borderRadius
 * @param shadowSize
 * @param shadowColor
 * @param strokeWidth
 * @param strokeColor
 */
export const updateTextContentAction = ( { controlWidthPx = 0, textLines = [], text = null, fontId = 0, fontSize = 0, lineHeight = 0, bold = null, italic = null, horizontal, vertical, color, bgColor, padding, borderRadius, shadowSize, shadowColor, strokeWidth, strokeColor }: { controlWidthPx?: number; textLines?: string[], text?: string, fontId?: number, fontSize?: number, lineHeight?: number, bold?: boolean, italic?: boolean, horizontal?: string, vertical?: string; color?: ILayoutColor, bgColor?: ILayoutColor, shadowSize?: number, shadowColor?: ILayoutColor, padding?: number, borderRadius?: number, strokeWidth?: number, strokeColor?: ILayoutColor } ) => dispatch( ( dispatch, getState ) => {
    const storeObj = getState();

    //получаем данные выбранного элемента
    const currentControlElementId: string | number = currentControlElementIdSelector( storeObj );
    const currentControlWidthPx: string = currentControlWidthPxSelector( storeObj );

    //получаем content layout
    const contentLayout: ILayoutContentText = contentLayoutByBlockIdSelector( storeObj, currentControlElementId );

    //получаем layout
    const layoutObj = <ILayout>productLayoutSelector( storeObj );

    //обновляем блок в layout
    const layout = updateTextContent( {
        layout: layoutObj,
        contentId: contentLayout.id,
        blockId: currentControlElementId,
        controlWidthPx: controlWidthPx || parseInt( currentControlWidthPx ),
        text: text,
        fontId: fontId,
        fontSize: fontSize,
        lineHeight: lineHeight,
        bold: bold,
        italic: italic,
        horizontal: horizontal,
        vertical: vertical,
        color: color,
        bgColor: bgColor,
        padding: padding,
        borderRadius: borderRadius,
        shadowSize: shadowSize,
        shadowColor: shadowColor,
        strokeWidth: strokeWidth,
        strokeColor: strokeColor,
        textLines: textLines
    } );

    updateLayoutInReduxAndServerByDebounceAction( { layout: layout } );
} );

/**
 * Добавляем на страницу текст
 */
export const addTextToPageAction = ( { pageId = '', areaNumber = 0 }: { pageId?: string, areaNumber?:number } ) => dispatch( ( dispatch, getState ) => {
    const storeObj = getState();

    //получаем layout
    const layoutObj = <ILayout>productLayoutSelector( storeObj );

    //получаем коэфициент соотношение svg координат к браузерным
    const ratio: number = ratioSelector( storeObj );

    //если нет pageId то берем id первой страницы
    if ( !pageId ) {
        //если указана area то находим первую ее страницу
        if ( areaNumber ) {
            const areaId: string = layoutObj.areasList[ areaNumber - 1];
            pageId = layoutObj.areas[areaId]?.pages[0];
        } else {
            return null;
        }
    }

    //добавляем текст в layout
    const { layout, id }: { layout: ILayout, id: string } = addTextToLayout( {
        layout: layoutObj,
        pageId: pageId
    } );

    //устанавливаем выбранный элемет по id
    setControlElement( { blockId: id, blockType: 'text' } );

    updateLayoutInReduxAndServerByDebounceAction( { layout: layout } );
} );

/**
 * Добавляем на страницу фигуру
 * @param photoId
 * @param pageId
 * @param dropPosition
 */
export const addShapeToPageAction = ( { shapeId, shapeSvg, pageId, dropPosition }: { shapeId: string, shapeSvg: string, pageId: string, dropPosition?: { x: number, y: number } } ) => dispatch( ( dispatch, getState ) => {
    const storeObj = getState();
    //получаем layout
    const layoutObj = <ILayout>productLayoutSelector( storeObj );

    //добавляем фигуру в layout
    const { layout, id }: { layout: ILayout, id: string } = addShapeToLayout( {
        layout: layoutObj,
        shapeSvg: shapeSvg,
        pageId: pageId,
        dropPosition: dropPosition
    } );

    //устанавливаем выбранный элемет по id
    setControlElement( { blockId: id, blockType: 'shape' } );

    updateLayoutInReduxAndServerByDebounceAction( { layout: layout } );
} );

/**
 * Добавляем на страницу фотографию
 * @param photoId
 * @param pageId
 * @param dropPosition
 */
export const addPhotoToPageAction = ( { photoId, pageId, dropPosition }: { photoId: string, pageId: string, dropPosition?: { x: number, y: number } } ) => dispatch( ( dispatch, getState ) => {
    const storeObj = getState();
    //получаем layout
    const layoutObj = <ILayout>productLayoutSelector( storeObj );

    //получим объект фотографии по id фотографию
    const photoObject = productPhotoByIdSelector( storeObj, { photoId: photoId } );
    if ( !photoObject ) return;

    //добавляем фотографию в layout
    const { layout, id }: { layout: ILayout, id: string } = addPhotoToLayout( {
        layout: layoutObj,
        photo: photoObject,
        pageId: pageId,
        dropPosition: dropPosition
    } );

    //устанавливаем выбранный элемет по id
    setControlElement( { blockId: id, blockType: 'photo' } );

    updateLayoutInReduxAndServerByDebounceAction( { layout: layout, checkUsedPhotos: true } );
} );

/**
 * @param photoId
 * @param pageId
 * @param blockId
 */
export const addPhotoToPhotoBlockAction = ( { photoId, blockId }: { photoId: string, blockId: string } ) => dispatch( ( dispatch, getState ) => {


    const storeObj = getState();
    //получаем layout
    const layoutObj = <ILayout>productLayoutSelector( storeObj );

    //получим объект фотографии по id фотографию
    const photoObject = productPhotoByIdSelector( storeObj, { photoId: photoId } );
    if ( !photoObject ) return;

    const { layout }: { layout: ILayout } = addPhotoInBlockLayout( {
        layout: layoutObj,
        photo: photoObject,
        blockId: blockId
    } );

    //устанавливаем выбранный элемет по id
    setControlElement( { blockId: blockId, blockType: 'photo' } );

    updateLayoutInReduxAndServerByDebounceAction( { layout: layout, checkUsedPhotos: true } );
} );

/**
 * Авторазмещение фотографий
 */
export const autoFillPhotosAction = ( { photosList }: { photosList: any[] } ) => dispatch( ( dispatch, getState ) => {

    const storeObj = getState();
    //получаем layout
    const layoutObj = <ILayout>productLayoutSelector( storeObj );
    let sortedBlocks = []

    for ( let i = 0; i < layoutObj.areasList.length; i++ ) {
        const areaName = layoutObj.areasList[i]
        const area = areaName && layoutObj.areas[areaName]
        if ( !area ) return;
        for ( let j = 0; j < area.pages.length; j++ ) {
            const pageName = area.pages[j]
            const page = pageName && layoutObj.pages[pageName]
            if ( !page ) return;
            const pageBlocksList = page.blocksList.map((blockName) => layoutObj.blocks[blockName])
                                                .filter( x => x.type === 'photo' && !x.content )
                                                .sort((a,b) => (a.y*1.1 + a.x) - (b.y*1.1 + b.x) )

            sortedBlocks.push(...pageBlocksList)
        }
    }

    if ( !sortedBlocks.length ) return;

    let filledLayout = layoutObj

    for ( let i = 0; (i < sortedBlocks.length) && (i < photosList.length); i++ ) {
        //получим объект фотографии по id фотографию
        const photoObject = productPhotoByIdSelector( storeObj, { photoId: photosList[i].id } );
        if ( !photoObject ) return;

        const { layout }: { layout: ILayout } = addPhotoInBlockLayout( {
            layout: filledLayout,
            photo: photoObject,
            blockId: sortedBlocks[i].id
        } );

        filledLayout = layout
    }

    updateLayoutInReduxAndServerByDebounceAction( { layout: filledLayout, checkUsedPhotos: true } );

} );

/**
 * Добавляем на страницу стикер
 * @param photoId
 * @param pageId
 */
export const addStickerToPageAction = ( { stickerId, stickerSetId, pageId, dropPosition }: { stickerId: string, stickerSetId: string, pageId: string, dropPosition?: { x: number, y: number } } ) => dispatch( ( dispatch, getState ) => {
    const storeObj = getState();
    //получаем layout
    const layoutObj = <ILayout>productLayoutSelector( storeObj );

    //получим объект стикера по id
    const stickerObject = stickerByIdSelector( storeObj, { stickerId: stickerId, stickerSetId: stickerSetId } );
    
    if ( !stickerObject ) return;

    //добавляем стикер в layout
    const { layout, id }: { layout: ILayout, id: string } = addStickerToLayout( {
        layout: layoutObj,
        sticker: stickerObject,
        pageId: pageId,
        dropPosition: dropPosition
    } );

    //устанавливаем выбранный элемет по id
    setControlElement( { blockId: id, blockType: 'sticker' } );

    updateLayoutInReduxAndServerByDebounceAction( { layout: layout } );
} );

/**
 * Добавляем на страницу фон
 * @param photoId
 * @param pageId
 */
export const addBackgroundToPageAction = ( { pageId = null, bgId = null, bgSetId = null }: { pageId?: string, bgId?: string, bgSetId?: string } ) => dispatch( ( dispatch, getState ) => {
    const storeObj = getState();
    //получаем layout
    const layoutObj = <ILayout>productLayoutSelector( storeObj );

    //получим объект фона по id
    const bgObject = backgroundByIdSelector( storeObj, { bgId: bgId, bgSetId: bgSetId } );

    if ( !bgObject ) return;

    //устанавливаем выбранный элемет по id
    setControlElement( { blockId: 0, blockType: '' } );

    //добавляем фотографию в layout
    const { layout, id }: { layout: ILayout, id: string } = addBackgroundToLayout( {
        layout: layoutObj,
        bgObject: bgObject,
        pageId: pageId
    } );

    //return;

    //устанавливаем выбранный элемет по id
    setControlElement( { blockId: id, blockType: 'background' } );

    updateLayoutInReduxAndServerByDebounceAction( { layout: layout } );
} );


/**
 * Изменяем позицию блока в массиве (реализация z-index)
 * @param blockId
 * @param direction
 */
export const blockSortOrderAction = ( { blockId, direction }: { blockId: string, direction: IBlockOrderType } ) => dispatch( ( dispatch, getState ) => {
    //получаем layout
    const layout = <ILayout>productLayoutSelector( getState() );
    //const page = Object.keys( layout.pages )[ 0 ]

    const newLayout = orderBlockChaneInLayout( {
        layout: layout,
        blockId: blockId,
        direction: direction
    } );

    updateLayoutInReduxAndServerByDebounceAction( { layout: newLayout } );
} );


/**
 * Обновляем блок и фотографию
 * @param block
 * @param contentPhoto
 */
export const updateBlockWithContentAction = ( { block = null, contentPhoto = null }: { block?: ILayoutBlock, contentPhoto?: ILayoutContentPhoto } ) => dispatch( ( dispatch, getState ) => {
    const layout = <ILayout>productLayoutSelector( getState() );
    const layoutNew: ILayout = updateBlockWithContentLayout( {
        layout: layout,
        block: block,
        contentPhoto: contentPhoto
    } );

    updateLayoutInReduxAndServerByDebounceAction( { layout: layoutNew } );
} );

/**
 * Обновляем продукт и формат в layout
 * @param block
 */
export const updateProductAndFormatInLayout = ( { data } ) => dispatch( ( dispatch, getState ) => {
    const layout = <ILayout>productLayoutSelector( getState() );
    const { formatObject, optionsList }: { formatObject: ILayoutFormat, optionsList: ILayoutOption[] } = createFormatAndOptionAdapter( data );

    const result: { layout: ILayout, clearWorkList: boolean } = updateFormatOptionsAndProductInfoInLayout( {
        layout: layout,
        format: formatObject,
        options: optionsList,
        name: data.productName,
        description: data.productDescription,
        productId: data.productId,
        productSlug: data.productSlug
    } );

    //убираем все плохие фотографии из массива
    if ( result.clearWorkList ) {
        setClearNotGoodAndNotAcceptedPhoto();
    }

    //обновляем данные выбранного продукта в продуктах
    setSelectedDataInProduct( { layout: layout } );

    updateLayoutInReduxAndServerByDebounceAction( { layout: result.layout } );
} );

/**
 * Создание заказа
 * @param layoutId
 * @param history
 */
export const makeOrderAction = ( { layoutId, history }: { layoutId: string, history: any } ) => new Promise( ( resolve, reject ) => {

    setFullScreenLoaderAction( true );

    getLayoutByIdAction( { layoutId: layoutId } )
        .then( ( product: ILayoutFullData ) => {
            createOrder( product.layout.id, history, product.layout, false, false )
                .then( () => {
                    setFullScreenLoaderAction( false )
                } )
                .catch( ( err ) => {
                    console.error( 'Не удалось положить заказ в корзину', err );
                    setFullScreenLoaderAction( false )
                } );
        } ).catch( ( err ) => {
        console.error( err );
        setFullScreenLoaderAction( false );
    } );
} );

/**
 * Создание заказа с проверкой авторизации
 * @param layoutId
 * @param history
 * @param needSaveLayoutBeforeOrder
 * @param productSlug
 */
export const makeOrderActionOnlyForUser = ( { layoutId, history, needSaveLayoutBeforeOrder = false, productSlug = '' }: { layoutId: string, history: any, needSaveLayoutBeforeOrder?: boolean, productSlug?: string } ) => dispatch( ( dispatch, getState ) => {

    setFullScreenLoaderAction( true );

    // отправка метрики
    const sendOrderMetrics = () => {
        if ( isCalendar(productSlug) ) {
            sendMetric( METRICS.ORDER_CALENDAR );
        }
    }

    //создание заказа
    const makeOrder = () => {
        const isUserVisitor: boolean = userRoleIsVisitor( getState() );
        if ( isUserVisitor ) {
            setFullScreenLoaderAction( false );
            dispatch( userLoginShowAction( true, () => {
                setFullScreenLoaderAction( true );
                sendOrderMetrics();
                makeOrderAction( { layoutId: layoutId, history: history } ).then();
            } ) );
        } else {
            sendOrderMetrics();
            makeOrderAction( { layoutId: layoutId, history: history } ).then();
        }
    }

    if ( needSaveLayoutBeforeOrder ) {
        const layout = <ILayout>productLayoutSelector( getState() );

        //сохраняем на сервер
        updateLayoutOnServerAction( { layout: layout, forceUpdate: true } ).then( () => {
            makeOrder();
        } ).catch( () => {
            setFullScreenLoaderAction( false );
            console.error( 'Не удалось сохранить layout на сервер' )
        } );
    } else {
        makeOrder();
    }

} );

/**
 * Удалить layout и фото
 */
export const removeLayoutAndPhotosFromRedux = () => dispatch( {
    type: PRODUCT_CLEAR_DATA
} );

/**
 * Обновляем layout и по debounce сохраняем данные на сервере
 * @param layout
 * @param callback
 * @param updateOnServer
 * @param isAdmin
 * @param checkUsedPhotos
 */
export const updateLayoutInReduxAndServerByDebounceAction = ( { layout, callback, updateOnServer = false, isAdmin, checkUsedPhotos }: { layout: ILayout, callback?: any, updateOnServer?: boolean, isAdmin?: boolean, checkUsedPhotos?: boolean } ) => {

    const photosList:Array<IPhoto> = [ ...productPhotosSelector( store.getState() ) ];
    const product = { layout: layout, photos: photosList }

    if (updateOnServer) {
        updateLayoutOnServerAction( { layout: layout, forceUpdate: true, isAdmin } ).then(()=>callback && callback());
    } else {
        //сохраняем в redux
        productLayoutSaveReduxAction( { product: product, checkUsedPhotos: checkUsedPhotos } );

        //функция сохранения
        const saveToServer = () => {
            const layoutNew = <ILayout>{ ...productLayoutSelector( store.getState() ) };
            updateLayoutOnServerAction( { layout: layoutNew } ).then(()=>callback && callback());
        }

        if ( saveDebounceTimer ) clearTimeout( saveDebounceTimer );

        saveDebounceTimer = setTimeout( saveToServer, TIME_SAVE_INTERVAL );
    }
}

/**
 * Обновляем layout на стороне сервера
 * @param layout
 * @param notSaveToRedux
 */
export const updateLayoutOnServerAction = ( { layout, saveToRedux = true, forceUpdate = false, isAdmin = false }: { layout: ILayout, saveToRedux?: boolean, forceUpdate?: boolean, isAdmin?: boolean } ) => new Promise( ( resolve, reject ) => {
    //сохраняем обновленный layout на сервер
    const preview = generateAllProductPreview( { productData: { layout } } );

    //console.log('SAVE!', generatePosterPreview( state ));
    //если уже активен timeout на сохранение layout, удаляем его

    if ( saveDebounceTimer ) clearTimeout( saveDebounceTimer );

    if ( isAdmin ) {
        WS.updateThemeLayout( layout, preview ).then( ( productData: ILayoutFullData ) => {
            if ( saveToRedux ) productLayoutSaveReduxAction( {
                product: productData,
                fromServer: true,
                forceUpdate: forceUpdate,
                checkUsedPhotos: true
            } );
            resetLayoutChangesCountAction();
            resolve( productData );
        } ).catch( ( err ) => {
            reject( err );
            console.error( 'Не удалось обновить данные на сервера', err );
        } );
    } else {
        WS.updateProductLayoutByProductGroupSlug( layout, preview ).then( ( productData: ILayoutFullData ) => {
            //обновляем данные в Redux
            if ( saveToRedux ) productLayoutSaveReduxAction( {
                product: productData,
                fromServer: true,
                forceUpdate: forceUpdate,
                checkUsedPhotos: true
            } );
            resetLayoutChangesCountAction();
            resolve( productData );
        } ).catch( ( err ) => {
            reject( err );
            console.error( 'Не удалось обновить данные на сервера', err );
        } );
    }
} );

/**
 * Обновляем layout на сервере с возвращением промиса
 */
export const justUpdateLayoutOnServerAction = ( { isAdmin = false, saveToRedux = false, forceUpdate = false }: { isAdmin?: boolean, saveToRedux?: boolean, forceUpdate?: boolean } | undefined ) => dispatch( ( dispatch, getState ) => new Promise( ( resolve, reject ) => {

    //Получим state
    const layout = <ILayout>productLayoutSelector( getState() );

    //обновляем layout на сервере
    updateLayoutOnServerAction( {
        layout: layout,
        saveToRedux: saveToRedux,
        forceUpdate: forceUpdate,
        isAdmin: isAdmin
    } )
        .then( ( productData: ILayoutFullData ) => {
            if ( productData ) {

                resolve( productData.layout )
            }
        } )
        .catch( ( err ) => {
            console.log('Ошибка при сохранении на сервере', err);
            toast.error('Не удалось сохранить макет!')
            reject( {layout: layout, error: err} );
        });

} ) );


// export const resizeLayoutItems = ( o, formatSizes , isBlocksResize = false ) => {
//     for (let key of Object.keys(o)) {
//         const
//             newX = isBlocksResize && o[key].x < 0 ? o[key].x : Math.round(o[key].x * formatSizes.proportions.w),
//             newY = isBlocksResize && o[key].y < 0 ? o[key].y : Math.round(o[key].y * formatSizes.proportions.h);
//
//         let newW = o[key].w * formatSizes.proportions.w, newH = o[key].h * formatSizes.proportions.h;
//
//         // Если блок выходит за линию обреза мы пересчитываем размер замудрено
//         if ( isBlocksResize ) {
//             // размеры отступов блока за линию обреза
//             let leftOutside = 0, rightOutside = 0, topOutside = 0, bottomOutside = 0;
//
//             if (o[key].x < 0) leftOutside = o[key].x * -1;
//             if ((o[key].x + o[key].w) > formatSizes.w) rightOutside = o[key].x + o[key].w - formatSizes.w;
//             if (o[key].y < 0) topOutside = o[key].y * -1;
//             if ((o[key].y + o[key].h) > formatSizes.h) bottomOutside = o[key].y + o[key].h - formatSizes.h;
//
//             // считаем размер части блока которая не выходит за обрез
//             const middleW = o[key].w - leftOutside - rightOutside,
//                 middleH = o[key].h - topOutside - bottomOutside;
//
//             // суммируем
//             newW =  Math.round(middleW * formatSizes.proportions.w + leftOutside + rightOutside);
//             newH =  Math.round(middleH * formatSizes.proportions.h + topOutside + bottomOutside);
//         }
//
//         o[key] = {
//             ...o[key],
//             x: newX,
//             y: newY,
//             w: newW,
//             h: newH,
//             //для блоков добавляем информацию, по которой потом можем масштабировать содержимое блока
//             ...(isBlocksResize ? {      // насколько изменился размер блока
//                 xW: newW / o[key].w,    // по ширине
//                 xH: newH / o[key].h,    // по высоте
//             } : {})
//         }
//     }
//     return o;
// }

/**
 * Масштабирование страниц
 * @param o - объект страниц, который надо пересчитать
 * @param formatSizes - размеры конечного формата
 */
const resizePages = ( o, formatSizes ) => {
    for ( let key of Object.keys( o ) ) {
        o[ key ] = {
            ...o[ key ],
            w: Math.round( o[ key ].w * formatSizes.proportions.w ),
            h: Math.round( o[ key ].h * formatSizes.proportions.h ),
        }
    }
    return o;
}

/**
 * Масштабирование блоков layout'а
 * @param o - объект блоков, который надо пересчитать
 * @param formatSizes - размеры конечного формата
 * @param newSize - размеры конечного формата
 */
const resizeBlocks = ( o, formatSizes, newSize ) => {
    for ( let key in o ) {
        if (o.hasOwnProperty(key)) {
            if ( o[ key ].type === 'background' ) {
                o[ key ] = {
                    ...o[ key ],
                    x: formatSizes.fields.left * -1,
                    y: formatSizes.fields.top * -1,
                    w: newSize.width + formatSizes.fields.left + formatSizes.fields.right,
                    h: newSize.height + formatSizes.fields.top + formatSizes.fields.bottom
                }
            } else {
                const   // координаты центра блока относительно центра страницы
                    cX = o[ key ].x - formatSizes.centerX + o[ key ].w / 2,
                    cY = o[ key ].y - formatSizes.centerY + o[ key ].h / 2;
                const   // масштабируем - новые координаты относительно центра страницы и размеры
                    nX = cX * formatSizes.proportions.w,
                    nY = cY * formatSizes.proportions.h,
                    nW = o[ key ].w * formatSizes.scale,
                    nH = o[ key ].h * formatSizes.scale;

                // Пересчитываем координаты относительно верхнего левого угла
                o[ key ] = {
                    ...o[ key ],
                    x: Math.round( nX - nW / 2 + formatSizes.centerX * formatSizes.proportions.w ),
                    y: Math.round( nY - nH / 2 + formatSizes.centerY * formatSizes.proportions.h ),
                    w: Math.round( nW ),
                    h: Math.round( nH )
                }
            }
        }

    }
    return o;
}
/**
 * Масштабирование содержимого блоков
 * @param o - объект лейаута, который надо пересчитать
 * @param formatSizes
 * @param newSize
 */
const resizeContents = ( o, formatSizes, newSize ) => {
    for ( let key in o ) {
        if ( o.hasOwnProperty( key ) ) {
            switch ( o[key].type ) {
                case 'background':
                    let x = Math.round( o[key].x * formatSizes.scale ),
                        y = Math.round( o[key].y * formatSizes.scale ),
                        w = Math.round( o[key].w * formatSizes.scale ),
                        h = Math.round( o[key].h * formatSizes.scale );

                    const newSizeWithCuts = {
                        width: newSize.width + formatSizes.fields.left + formatSizes.fields.right,
                        height: newSize.height + formatSizes.fields.top + formatSizes.fields.bottom
                    }

                    //если высота фона меньше высоты формата
                    if ( h < newSizeWithCuts.height ) {
                        const rat = h / newSizeWithCuts.height || 1; //если 0, то выставляем 1

                        //квеличиваем на разницу
                        w = w / rat;
                        h = h / rat;
                    }

                    //если ширина фона меньше высоты формата
                    if ( w < newSizeWithCuts.width ) {
                        const rat = w / newSizeWithCuts.width || 1; //если 0, то выставляем 1

                        //увеличиваем на разницу
                        w = w / rat;
                        h = h / rat;
                    }

                    //проверяем относительно сдвига
                    if ( x + w < newSizeWithCuts.width ) {
                        x = newSizeWithCuts.width - w
                    }
                    if ( y + h < newSizeWithCuts.height ) {
                        y = newSizeWithCuts.height - h
                    }

                    o[key] = {
                        ...o[key],
                        x: x,
                        y: y,
                        w: w,
                        h: h
                    };
                    break;
                case 'photo':
                    o[key] = {
                        ...o[key],
                        x: Math.round( o[key].x * formatSizes.scale ),
                        y: Math.round( o[key].y * formatSizes.scale ),
                        w: Math.round( o[key].w * formatSizes.scale ),
                        h: Math.round( o[key].h * formatSizes.scale ),
                    };
                    break;
                case 'text':
                    o[key] = {
                        ...o[key],
                        w: Math.round( o[key].w * formatSizes.scale ),
                        h: Math.round( o[key].h * formatSizes.scale ),
                        size: Math.round( o[key].size * formatSizes.scale ),
                        strokeWidth: Math.round( o[key].strokeWidth * formatSizes.scale )
                    };
                    break;
            }
        }
    }
    return o;
}

// const getThemeCuts = ( productGroupSlug ) => THEME_CUTS_MAP[productGroupSlug];

/**
 * Меняем формат layout'а
 *  * @param layout - объект лейаута, который надо пересчитать
 *  * @param targetLayout - целевой layout - в какой формат надо пересчитать
 *  * @param themeId - id темы
 */
const reformatLayout = ( layout: ILayout, targetLayout: IThemeTargetLayout, themeId?: string ) => {
    const formatSizes = {
        fields: {
            left: layout.format.cuts.left + (layout.format.padding.left || 0),
            right: layout.format.cuts.right + (layout.format.padding.right || 0),
            top: layout.format.cuts.top + (layout.format.padding.top || 0),
            bottom: layout.format.cuts.bottom + (layout.format.padding.bottom || 0)
        },
        w: parseInt( layout.format.width ),
        h: parseInt( layout.format.height ),
        // пропорции, на сколько изменился формат
        proportions: {
            w: parseInt( targetLayout.width ) / parseInt( layout.format.width ),
            h: parseInt( targetLayout.height ) / parseInt( layout.format.height ),
        },
        scale: 1,   // Множитель размера всех блоков
        centerX: 0, // Центр страницы
        centerY: 0,
    };

    formatSizes.scale = Math.min( formatSizes.proportions.w, formatSizes.proportions.h );
    formatSizes.centerX = formatSizes.w / 2;
    formatSizes.centerY = formatSizes.h / 2;

    const newSize: { width: number, height: number } = {
        width: parseInt( targetLayout.width ),
        height: parseInt( targetLayout.height )
    };

    const newPages = resizePages( layout.pages, formatSizes );
    const newBlocks = resizeBlocks( layout.blocks, formatSizes, newSize );
    const newContents = resizeContents( layout.contents, formatSizes, newSize );


    return {
        ...layout,
        id: targetLayout.id,
        themeId: themeId || layout.themeId || '',
        format: {
            ...layout.format,
            width: targetLayout.width + '',
            height: targetLayout.height + '',
            formatSlug: `${ targetLayout.width }_${ targetLayout.height }`,
        },
        pages: newPages,
        blocks: newBlocks,
        contents: newContents,
    }
};

/**
 * Создаем копию layout темы
 */
export const copyThemeLayoutAction = ( layoutId: string, targetLayout: IThemeTargetLayout | IThemeTargetLayout[], themeId: string ) => new Promise( ( resolve, reject ) => {
    let formatsQueue = [];
    let sourceLayout = null;

    // Разгребаем очередь форматов на замену
    const checkFormatQueue = ( productData = null ) => {
        // достаем первый элемент из массива и отправляем его на сервер
        // когда массив кончился шлём resolve
        if ( formatsQueue.length ) {
            const nextFormat = formatsQueue.shift();
            replaceThemeLayout( nextFormat );
        } else resolve( productData );
    }

    // Заменяем theme layout на сервере
    const replaceThemeLayout = ( targetLayout: IThemeTargetLayout ) => {
        // Изменяем размер target layout на новый формат и пересчитываем содержимое
        const newLayout = reformatLayout( JSON.parse( JSON.stringify( sourceLayout ) ), targetLayout, themeId );

        if ( !newLayout.id ) {
            // Если нет id - layout еще не создан
            // Значит создаем
            WS.createThemeLayout( {
                    layout: newLayout,
                    preview: generateAllProductPreview( {
                        productData: {
                            layout: newLayout
                        }
                    } ),
                    themeId: themeId
            } ).then( ( productData: ILayoutFullData ) => {
                checkFormatQueue( productData );
            } ).catch( ( err ) => {
                reject( err );
                toast.error( 'Ошибка при копировании формата темы' );
                console.error( 'Не удалось копировать layout', err );
            } );
        } else {
            //Обновляем этот layout на сервере
            WS.replaceThemeLayout( newLayout, generateAllProductPreview( {
                productData: {
                    layout: newLayout
                }
            } ) ).then( ( productData: ILayoutFullData ) => {
                checkFormatQueue( productData );
            } ).catch( ( err ) => {
                reject( err );
                toast.error( 'Ошибка при копировании формата темы' );
                console.error( 'Не удалось копировать layout', err );
            } );
        }
    }

    // Запрашиваем source layout по id
    WS.getProductLayout( layoutId, true, [] ).then( ( layout: { layout: ILayout } ) => {
        formatsQueue = Array.isArray( targetLayout ) && targetLayout || [ targetLayout ];
        sourceLayout = layout.layout;
        checkFormatQueue();
    } ).catch( ( err ) => {
        console.log( 'err', err );
        toast.error( 'Ошибка при копировании формата темы', {
            autoClose: 3000
        } );
    } );


} );
