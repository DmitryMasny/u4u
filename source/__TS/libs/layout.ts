import {
    ILayout,
    ILayoutArea,
    ILayoutAreas,
    //ILayoutList,
    ILayoutPage,
    ILayoutPages,
    ILayoutBlock,
    ILayoutBlocks,
    ILayoutContents,
    //TypeProductType,
    ILayoutFormat,
    ILayoutOption,
    ICreateLayout,
    ILayoutCuts,
    ILayoutPrintOptions,
    ILayoutContentPhoto,
    ILayoutContentText,
    IBlockOrderType, ILayoutColor,
    IContentTextShadowPosition,
    ICreateContentBackground
    //ILayoutPadding
// @ts-ignore
} from '__TS/interfaces/layout';
// @ts-ignore
import { simpleID, moveElementDown, moveElementUp, rotateFormatId } from '__TS/libs/tools';

// @ts-ignore
import { IPhoto } from '__TS/interfaces/photo';
// @ts-ignore
import { FONTS } from '__TS/fonts/fontConfig';
import { ISticker } from "../interfaces/stickers";
// @ts-ignore
import { calcImageSizeInBlock } from '__TS/libs/layout';
// @ts-ignore
import { THEME_CUTS_MAP, DEFAULT_THEME_CUTS } from 'const/productsTypes';

// @ts-ignore
import { getPagesStructure, IPageStructure, IPageStructurePage } from '__TS/products/pagesTypes';

//Работа с layout продукта
interface ICreateBlock {
    id?: string;
    x: number;
    y: number;
    w: number;
    h: number;
    r?: number;
    contentId?: string;
    contentType?: string;
    disableActivity?: boolean;
    fixedProportions?: boolean;
    mirroring?: boolean;
}

interface ICreatePage {
    x: number;
    y: number;
    w: number;
    h: number;
    editable: boolean;
    blocksIds?: string[];
    type: string;
    pageType: string;
}

interface ICreateArea {
    type: string;
    editable: boolean;
    pages: string[];
    printOptions: ILayoutPrintOptions;
}

interface ICreateEmptyOnePageLayout {
    areasList: string[],
    areas: ILayoutAreas,
    pages: ILayoutPages
}

interface ICreateEmptyOnePageLayoutParams {
    type: string;
    format: ILayoutFormat,
    x?: number;
    y?: number,
    w: number;
    h: number;
    pagesStructure: IPageStructure;
}

interface ICreateContentSticker {
    id?: string;
    type: string;
    stickerId: string;
    stickerSetId: string;
    svg?: string;
    fixedProportions: boolean;
    viewBoxWidth?: number;
    viewBoxHeight?: number;
}

interface ICreateContentShape {
    id?: string;
    type: string;
    svg?: string;
    fixedProportions: boolean;
    viewBoxWidth?: number;
    viewBoxHeight?: number;
}

interface ICreateContentPhoto {
    id?: string;
    photoId: string;
    x: number;
    y: number;
    w: number;
    h: number;
    pxWidth: number;
    pxHeight: number;
    url: string;
    r?: number;
    orig: string;
    importFrom: string;
    type?: string;
}

interface ICreateContentText {
    id?: string;
    fontFamilyId?: number;
    color?: ILayoutColor;
    size?: number;
    dx?: number;
    dy?: number;
    lineHeight?: number;
    bold?: boolean;
    italic?: boolean;
    horizontal?: string;
    vertical?: string;
    text?: string;
    textLines?: string[];
    strokeColor?: ILayoutColor;
    strokeWidth?: number;
    padding?: number;
    borderRadius?: number;
    bgColor?: ILayoutColor;
    shadowColor?: ILayoutColor;
    shadowSize?: number;
    shadowPosition?: IContentTextShadowPosition
}

interface IUpdateFormatOptionsAndProductInfoInLayout {
    layout: ILayout;
    format: ILayoutFormat;
    options: ILayoutOption[];
    name: string;
    description: string;
    productId: string;
    productSlug: string;
}

interface IcreateLayoutFromTheme {
    areasList: string[],
    areas: ILayoutAreas,
    pages: ILayoutPages,
    blocks: ILayoutBlocks,
    contents: ILayoutContents
}

interface IGetLayoutParents {
    layout: ILayout;
    areaId?: string;
    pageId?: string;
    blockId?: string;
    contentId?: string;
}
interface IGetLayoutParentsReturn {
    block: ILayoutBlock;
    page: ILayoutPage;
    area: ILayoutArea;
    areaIndex: number;
}

/**
 * Создаем контент стикера
 * @param id
 * @param type
 * @param stickerId
 * @param stickerSetId
 * @param svg
 * @param fixedProportions
 * @param viewBoxWidth
 * @param viewBoxHeight
 */
const createContentSticker = ( { id = null, type, stickerId, stickerSetId, svg, fixedProportions, viewBoxWidth, viewBoxHeight }: ICreateContentSticker ): ICreateContentSticker => {

    const result = {
        id: id || simpleID(),
        type: type,
        stickerId: stickerId,
        stickerSetId: stickerSetId,
        fixedProportions: fixedProportions,
    }

    if ( svg ) {
        result['svg'] = svg;
        result['viewBoxWidth'] = viewBoxWidth;
        result['viewBoxHeight'] = viewBoxHeight;
    }

    return result;
};

/**
 * Создаем контент фигуры
 * @param id
 * @param type
 * @param svg
 * @param fixedProportions
 * @param viewBoxWidth
 * @param viewBoxHeight
 */
const createContentShape = ( { id = null, type, svg, fixedProportions, viewBoxWidth, viewBoxHeight }: ICreateContentShape ): ICreateContentShape => {
    return {
        id: id || simpleID(),
        type: type,
        fixedProportions: fixedProportions,
        viewBoxWidth: viewBoxWidth,
        viewBoxHeight: viewBoxHeight,
        svg: svg
    }
};

/**
 * Создает контент с фоном
 * @param id
 * @param backgroundType
 * @param x
 * @param y
 * @param w
 * @param h
 * @param r
 * @param bgColor
 * @param pxWidth
 * @param pxHeight
 * @param imageId
 * @param isPattern
 * @param mirroredX
 * @param mirroredY
 * @param opacity
 * @param type
 */
const createContentBackground = ( { id = null, backgroundType, x, y, w, h, r = 0, bgColor = { r: 255, g: 255, b: 255, a: 1 }, pxWidth, pxHeight, backgroundId = null, isPattern = false, patternWidth = 100, patternHeight= 100, mirroredX = false, mirroredY = false, opacity = 1, type = 'background' }: ICreateContentBackground ): ICreateContentBackground => {
    return {
        id: id || simpleID(),             // id
        backgroundType: backgroundType,   // png/jpg/fill
        backgroundId: backgroundId,       // позиция слева
        x: x,                             // позиция слева
        y: y,                             // позиция от верха
        w: w,                             // Ширина
        h: h,                             // Высота
        r: r,                             // Угол поворота фона
        pxWidth: pxWidth,                 // Ширина картинки оригинала в px
        pxHeight: pxHeight,               // Высота картинки оригинала в px
        isPattern: isPattern,             // Патерн или нет
        patternWidth: patternWidth,       // Размер паттерна
        patternHeight: patternHeight,     // Размер паттерна
        bgColor: bgColor,                 // Цвет закраски фона
        mirroredX: mirroredX,             // Отражение картинки/патерна по Х
        mirroredY: mirroredY,             // Отражение картинки/патерна по Y
        opacity: opacity,                 // Прозрачность картинки/патерна
        type: type
    }
};

/**
 * Создает контент с фото
 * @param id
 * @param x
 * @param y
 * @param w
 * @param h
 * @param url
 * @param type
 * @param r
 * @param pxWidth
 * @param pxHeight
 * @param photoId
 * @param orig
 * @param importFrom
 */
const createContentPhoto = ( { id = null, x, y, w, h, url, r = 0, pxWidth, pxHeight, photoId, orig, importFrom, type = 'photo' }: ICreateContentPhoto ): ILayoutContentPhoto => {
    return {
        id: id || simpleID(),
        importFrom: importFrom,
        photoId: photoId,
        pxWidth: pxWidth,
        pxHeight: pxHeight,
        type: type,
        orig: orig,
        url: url,
        r: r,
        w: w,
        h: h,
        x: x,
        y: y
    }
};


/**
 * Создаем контент с текстом
 * @param id
 * @param fontFamilyId
 * @param color
 * @param size
 * @param dx
 * @param dy
 * @param lineHeight
 * @param bold
 * @param italic
 * @param horizontal
 * @param vertical
 * @param text
 * @param textLines
 * @param strokeColor
 * @param strokeWidth
 * @param padding
 * @param borderRadius
 * @param bgColor
 * @param shadowColor
 * @param shadowSize
 * @param shadowPosition
 */
const createContentText = ( {   id = null,
                                fontFamilyId = 1,
                                color = { r: 0, g: 0, b: 0, a: 1 },
                                size = 14,
                                dx = 0,
                                dy = 15.96,
                                lineHeight = 1.14,
                                bold = false,
                                italic = false,
                                horizontal = 'left',
                                vertical = 'middle',
                                text = '',
                                textLines = [],
                                strokeColor = { r: 0, g: 0, b: 0, a: 1 },
                                strokeWidth = 0,
                                padding = 0,
                                borderRadius = 0,
                                bgColor = { r: 255, g: 255, b: 255, a: 0 },
                                shadowColor = { r: 0, g: 0, b: 0, a: 1 },
                                shadowSize = 0,
                                shadowPosition = {
                                    x: 0,
                                    y: 0
                                }
                            }: ICreateContentText ): ILayoutContentText => {
    return {
        id: id || simpleID(),
        type: 'text',
        fontFamilyId: fontFamilyId,
        color: color,
        size: size,
        dx: dx,
        dy: dy,
        lineHeight: lineHeight,
        bold: bold,
        italic: italic,
        horizontal: horizontal,
        vertical: vertical,
        text: text,
        textLines: textLines,
        strokeColor: strokeColor,
        strokeWidth: strokeWidth,
        padding: padding,
        borderRadius: borderRadius,
        bgColor: bgColor,
        shadowColor: shadowColor,
        shadowSize: shadowSize,
        shadowPosition: shadowPosition
    }
};

/**
 * Создаем блок
 * @param id
 * @param x
 * @param y
 * @param w
 * @param h
 * @param contentId
 * @param contentType
 * @param disableActivity
 * @param r
 * @param fixedProportions
 * @param mirroring
 */
const createBlock = ( { id = null, x, y, w, h, contentId = '', contentType = '', disableActivity = false, r = 0, fixedProportions = true, mirroring = false}: ICreateBlock ): ILayoutBlock => {
    return {
        id: id || simpleID(),
        type: contentType,
        disableActivity: disableActivity,
        w: w,
        h: h,
        x: x,
        y: y,
        r: r,
        content: contentId,
        fixedProportions: fixedProportions,
        mirroring: mirroring
    };
};

/**
 * Создаем страницу
 * @param type
 * @param editable
 * @param blocksIds
 * @param w
 * @param h
 * @param x
 * @param y
 */
const createPage = ( { type, editable = true, blocksIds = [], w, h, x, y }: ICreatePage ): ILayoutPage => {
    return {
        id: simpleID(),
        type: type,
        editable: editable,
        w: w,
        h: h,
        x: x,
        y: y,
        blocksList: blocksIds
    }
};

/**
 * Создаем Area
 * @param type
 * @param editable
 * @param pages
 * @param printOptions
 */
const createArea = ( { type, editable, pages, printOptions }: ICreateArea ): ILayoutArea => {
    return {
        id: simpleID(),
        type: type,
        editable: editable,
        pages: pages,
        printOptions: printOptions
    }
}

/**
 * Создаем путой layout (без blocks и contents с фоном).
 * @param type
 * @param printOptions
 * @param x
 * @param y
 * @param w
 * @param h
 */
const createEmptyLayout = ( { type, format, x = 0, y = 0, w, h, pagesStructure }: ICreateEmptyOnePageLayoutParams ): { pages: {}; contents: {}; blocks: {}; areas: {}; areasList: string[] } => {

    let areas = {};
    let pages = {};
    let areasIds = [];


    //создаем области и страницы
    for ( let area: number = 0; area < pagesStructure.startAreas; area++ ) {

        const pageType = pagesStructure.pages &&
                         pagesStructure.pages[ area ] &&
                         pagesStructure.pages[ area ].type !== 'empty' &&
                         pagesStructure.pages[ area ].type || 'page';

        const areaType = pagesStructure.areas &&
                         pagesStructure.areas[ area ] &&
                         pagesStructure.areas[ area ].type !== 'empty' &&
                         pagesStructure.areas[ area ].type || 'page';

        const pageItem = createPage( {
            type: type,
            pageType: pageType,
            editable: true,
            x: x,
            y: y,
            w: w,
            h: h
        } );

        //создаем одну Area
        const areaItem: ILayoutArea = createArea( {
            type: areaType,//type,
            editable: true,
            pages: [
                pageItem.id
            ],
            printOptions: {
                cropTop: format.cuts.top || 0,
                cropBottom:  format.cuts.bottom || 0,
                cropLeft:  format.cuts.left || 0,
                cropRight:  format.cuts.right || 0
            }
        } );

        areasIds.push( areaItem.id );
        areas[ areaItem.id ] = areaItem;
        pages[ pageItem.id ] = pageItem;
    }

    return {
        areasList: areasIds,
        areas: areas,
        pages: pages,
        blocks: {},
        contents: {},
    }
}

/**
 * Создаем layout из темы
 */
const createLayoutFromTheme = ( layout: ILayout ): IcreateLayoutFromTheme => {
    //console.log('theme layout',layout);

    //убираем id layout, так как при создании сервер назначит новый
    layout.id = '';
    layout.photoIds = [];

    //убираем контент с фото из блоков
    for ( let key in layout.blocks ) {
        let block = layout.blocks[ key ];
        if ( block.type === 'photo' ) {
            block.content =  null;
        }
    }

    //убираем все блоки с контеном с фото
    for ( let key in layout.contents ) {
        let block = layout.contents[ key ];
        if ( block.type === 'photo' || block.type === 'empty_photo' ) {
            delete ( layout.contents[ key ] );
        }
    }

    return layout;
}


function svgTextMultiline( textArray, elementId, controlWidthPx, size, fontName, fontUrl, bold, italic ) {
//  text = strip(text);

    if ( !controlWidthPx ) {
        let elementControl = document.getElementById( 'layoutControlBlock' );
        let block = elementControl.querySelector( '.rect' );
        if ( block ) controlWidthPx = block.clientWidth;
    }

    //console.log( 'controlWidthPx', controlWidthPx );

    var elementMain = document.getElementById( elementId );
    var element = elementMain.cloneNode( false );

    // @ts-ignore
    element.removeAttribute( 'id' );
    // @ts-ignore
    element.removeAttribute( 'path' );
    // @ts-ignore
    element.removeAttribute( 'transform' );
    // @ts-ignore
    element.removeAttribute( 'clip-path' );

    // @ts-ignore
    element.setAttribute( 'font-size', size );
    // @ts-ignore
    element.setAttribute( 'font-family', fontName );
    // @ts-ignore
    element.setAttribute( 'style', `font-size: ${ size }; font-family: '${ fontName }; font-weight: ${ bold ? 'bold' : 'normal' }; font-style: ${ italic ? 'italic' : 'normal' }` );

    //@ts-ignore
    elementMain.parentNode.insertBefore( element, elementMain );

    var width = controlWidthPx;

    let result = [];

    let double = 1

    for ( let i = 0; i < textArray.length; i++ ) {
        var text = textArray[ i ];

        if ( text.length === 0 ) {
            double++;
            continue;
        }

        var words = text.split( ' ' );
        var line = '';


        /* Make a tspan for testing */
        // @ts-ignore
        element.innerHTML = '<tspan id="PROCESSING">busy</tspan >';

        for ( var n = 0; n < words.length; n++ ) {
            var testLine = line + words[ n ] + ' ';

            var testElem = document.getElementById( 'PROCESSING' );
            /*  Add line in testElement */
            testElem.innerHTML = testLine;
            /* Messure textElement */
            var metrics = testElem.getBoundingClientRect();
            let testWidth = metrics.width;

            if ( testWidth > width && n > 0 ) {
                if ( double > 1 ) {
                    for ( var d = 1; d < double; d++ ) {
                        result.push( '' );
                    }
                    double = 1;
                }
                result.push( line );
                //result.push('<tspan x="0" dy="' + y*double + '">' + line + '</tspan>');
                line = words[ n ] + ' ';
            } else {
                line = testLine;
            }
        }

        if ( line.length ) {
            if ( double > 1 ) {
                for ( var d = 1; d < double; d++ ) {
                    result.push( '' );
                }
                double = 1;
            }
            result.push( line );
            //result.push('<tspan x="0" dy="' + y*double + '">' + line + '</tspan>');
        }

        var el = document.getElementById( "PROCESSING" );
        if ( el ) el.remove();

        if ( double > 1 ) double = 1;
    }
    // @ts-ignore
    element.remove();

    //element.innerHTML = result.join('');
    return result;
}

/**
 * Отражение содержимого блока по вертикали
 * @param layout
 * @param blockId
 */
export const mirroringBlock = ( { layout, blockId }: { layout: ILayout, blockId: string | number } ): { layout: ILayout } => {

    //получим блок
    const block = layout.blocks[ blockId ];

    //инвертируем переключатель
    block.mirroring = !block.mirroring;

    return {
        layout: layout
    };
}

/**
 * Копируем блок с содержимым
 * @param layout
 * @param blockId
 */
export const copyBlock = ( { layout, blockId }: { layout: ILayout, blockId: string } ): { layout: ILayout, newBlockId: string, newBlockType: string } => {

    const DELTA_POSITION_BY_PROTOTYPE: number = 15;

    //получаем блок по id
    const block: ILayoutBlock = layout.blocks[ blockId ];

    //если блока нет, возвращаем null
    if ( !block ) return {
        newBlockType: null,
        newBlockId: null,
        layout: layout
    };

    //получаем контент по id
    const content: any = layout.contents[ block.content ];

    //если контента нет, возвращаем null
    if ( !content ) return  {
        newBlockType: null,
        newBlockId: null,
        layout: layout
    };

    let newContent: any = {};

    switch ( block.type ) {
        case 'photo':
            newContent = createContentPhoto( {...content,
                id: null,
                x: content.x + DELTA_POSITION_BY_PROTOTYPE,
                y: content.y + DELTA_POSITION_BY_PROTOTYPE,
            } );

            break;
        case 'text':
             newContent = createContentText( {...content,
                id: null,
                x: content.x + DELTA_POSITION_BY_PROTOTYPE,
                y: content.y + DELTA_POSITION_BY_PROTOTYPE,
            } );

            break;
        case 'sticker':
            newContent = createContentSticker( {...content,
                id: null
            } );

            break;
    }

    const newBlock: ILayoutBlock = createBlock( {
        x: block.x + DELTA_POSITION_BY_PROTOTYPE,
        y: block.y + DELTA_POSITION_BY_PROTOTYPE,
        w: block.w,
        h: block.h,
        r: block.r,
        contentId: newContent.id,
        contentType: block.type,
        disableActivity: block.disableActivity,
        fixedProportions: block.fixedProportions,
        mirroring: block.mirroring
    } );

    //находим к какой странице принадлежит данный блок
    for ( let pageId in layout.pages ) {

        //находим позицию блока в массиве блоков
        const blockPosition: number = layout.pages[ pageId ].blocksList.indexOf( blockId );

        if ( ~blockPosition ) {
            layout.contents[ newContent.id ] = newContent;
            layout.pages[ pageId ][ 'blocksList' ].push( newBlock.id );
            layout.blocks[ newBlock.id ] = newBlock;

            break;
        }
    }

    return {
        newBlockType: newBlock.type,
        newBlockId: newBlock.id,
        layout: layout
    };
}

/**
 * Обновляем свойста текстового контента
 * @param layout
 * @param textLines
 * @param contentId
 * @param blockId
 * @param controlWidthPx
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
export const updateTextContent = ( { layout, textLines = [], contentId, blockId, controlWidthPx, text, fontId = 0, fontSize = 0, lineHeight = 0, bold = null, italic = null, horizontal, vertical, color, bgColor, padding = null, borderRadius = null, shadowSize = null, shadowColor, strokeWidth = null, strokeColor }: { text?: string, textLines?: string[], fontId?: number, fontSize?: number, lineHeight?: number, horizontal?: string; vertical?: string; color?: ILayoutColor, bgColor?: ILayoutColor, padding?: number, layout: ILayout, contentId: string, blockId: string, controlWidthPx: number, bold?: boolean, italic?: boolean, borderRadius?: number, shadowSize?: number, shadowColor: ILayoutColor, strokeWidth?: number, strokeColor?: ILayoutColor } ): ILayout => {

    const content: any = layout.contents[ contentId ];
    const block: ILayoutBlock = layout.blocks[ blockId ];

    //текст
    if ( text ) content.text = text;

    //bold
    if ( bold !== null ) content.bold = bold;

    //italic
    if ( italic !== null ) content.italic = italic;

    //шрифт
    if ( fontId ) content.fontFamilyId = fontId;

    //позиция по горизонтали
    if ( horizontal ) content.horizontal = horizontal;

    //позиция по вертикали
    if ( vertical ) content.vertical = vertical;

    //цвет шрифта
    if ( color ) content.color = color;

    //размер фона
    if ( borderRadius !== null ) content.borderRadius = borderRadius;

    //размер тени
    if ( shadowSize !== null ) content.shadowSize = shadowSize;

    //цвет тени
    if ( shadowColor ) content.shadowColor = shadowColor;

    //толщина обводки
    if ( strokeWidth!== null ) content.strokeWidth = strokeWidth;

    //цвет обводки
    if ( strokeColor ) content.strokeColor = strokeColor;

    //отступ текста от блока
    if ( padding !== null ) {
        content.padding = padding;
        block.w = block.w - content.padding * 2 + padding * 2;
        block.h = block.h - content.padding * 2 + padding * 2;
    }

    //цвет фона расстояние
    if ( bgColor ) content.bgColor = bgColor;

    //межстрочное расстояние
    if ( lineHeight ) {
        content.lineHeight = lineHeight;
        content.dy = content.size * lineHeight;
    }

    //если есть размер текста, то меняем размер
    if ( fontSize ) {
        content.size = fontSize;
        content.dy = fontSize * content.lineHeight;
    }

    const selected = FONTS.filter( font => font.id === content.fontFamilyId );
    const fontName = selected && selected[ 0 ] && selected[ 0 ].name;
    const fontUrl = selected && selected[ 0 ] && selected[ 0 ].types && selected[ 0 ].types.regular.font;

    //если меняется text или fontId то нужно пересчитать размеры блока
    //if ( text || fontId || fontSize || lineHeight || bold || padding ) {

    if ( text ) {
        const textId: string = `text_${ content.id }`;
        const mainMultiLineNext: string[] = ( text || content.text ).split( '\n' );

        if ( !textLines.length ) {
            content.textLines = svgTextMultiline( mainMultiLineNext, textId, controlWidthPx, content.size, fontName, fontUrl, content.bold, content.italic );
        } else {
            content.textLines = textLines;
        }

        const height: number = ( content.textLines.length || 1 ) * content.dy;
        const heightWithPadding = height + ( padding ? padding : content.padding ) * 2;

        //если высота контента больше блока, то увеличиваем размер блока
        if ( heightWithPadding > block.h ) block.h = heightWithPadding
    }

    return { ...layout }
}

/**
 * Создаем Layout продукта
 * @param id
 * @param theme
 * @param userId
 * @param name
 * @param productId
 * @param productSlug
 * @param description
 * @param format
 * @param options
 * @param photoIds
 * @param productType
 */
export const createLayout = ({
                                 id = '',
                                 themeLayout = null,
                                 userId,
                                 name,
                                 productId,
                                 productSlug,
                                 description,
                                 format,
                                 options,
                                 isCreateThemeFormat,
                                 productGroupSlug,
                                 photoIds,
                                 productType = 'poster'
                             }: ICreateLayout): ILayout => {

    /* пока не используется типизация продукта
    switch ( productType ) {
        case 'poster':
        case "photo":
        case "canvas":
        default:
    }*/
    if (isCreateThemeFormat && productGroupSlug) {
        const printOptions = THEME_CUTS_MAP[productGroupSlug] || DEFAULT_THEME_CUTS;
        format = {
            ...format,
            ...printOptions
        }
    }

    const { areasList, areas, pages, blocks, contents } = themeLayout ?
        createLayoutFromTheme( themeLayout )
        :
        createEmptyLayout(
        {
            type: productType,
            pagesStructure: getPagesStructure( { productSlug: productSlug || productGroupSlug } ),
            format,
            w: parseInt( format.width ),
            h: parseInt( format.height )
        } );

    //console.log('isCreateThemeFormat',isCreateThemeFormat);
    // @ts-ignore
    let layout: ILayout =  {
        id: id, //string;
        name: name, //string;
        saveIteration: 0, //number;
        productId: productId, //string;
        productSlug: productSlug, //string;
        description: description, //string;
        userTitle: name, //string;
        /*theme: {
            id: "",     // string;
            layoutParentId: "",     // string;
            name: ""    // string;
        },*/
        userId: userId, // string;
        lastChanged: 0, //number;
        preview: "", // string;
        format: format, //ILayoutFormat;
        options: options, //ILayoutOption[];
        techOptions: [], //string[];
        areasList: areasList, //string[];
        areas: areas,//ILayoutAreas;
        pages: pages, //ILayoutPages;
        blocks: blocks, //ILayoutBlocks;
        contents: contents, //ILayoutContents;
        photoIds: photoIds, //string[];
        ...(isCreateThemeFormat ? {
            productGroupSlug: productGroupSlug,
        } : {
            isCompleted: false, //boolean;
            isDeleted: false, //boolean;
            isPaid: false, //boolean;
            inCart: false, //boolean;
        })
    }

    //Добавим фоны на страницы, если их нет
    for ( let key in layout.areas ) {
        const pagesIds = layout.areas[ key ].pages;

        if ( !pagesIds || !pagesIds.length ) return;

        pagesIds.map( pageId => {
            const blocksIds = layout.pages[ pageId ].blocksList;

            let isBackgroundYet = false;
            blocksIds.map( blockId => {
                if ( layout.blocks[ blockId ].type === 'background' ) isBackgroundYet = true;
            });
            if ( !isBackgroundYet ) {
                const result = addBackgroundToLayout( { layout: layout, pageId: pageId } );
                layout = result.layout;
            }
        });
    }

    return layout;
}
/**
 * Добавляем текст в layout
 * @param layout
 * @param pageId
 */
export const addTextToLayout = ( { layout, pageId }: { layout: ILayout, pageId: string } ): { layout: ILayout, id: string } => {

    //размеры формата
    const formatWidth: number = parseInt( layout.format.width ),
          formatHeight: number = parseInt( layout.format.height ),
          formatProportion = formatWidth / formatHeight;

    //размеры тектового блока
    const textWidth: number = formatWidth / 2,
          textHeight: number = formatHeight / 2;

    //считаем размер текста относительно размера страницы
    const fontSize = Math.round( Math.max( formatWidth, formatHeight ) / 30 );

    //создаем контент с тектом
    const textContent: ILayoutContentText = createContentText( {
        size: fontSize,
        dy: fontSize * 1.14
    } );

    //создаем блок с ссылкой по id на контент текста
    const block: ILayoutBlock = createBlock( {
        x: formatWidth / 2 - textWidth / 2,
        y: formatHeight / 2 - textWidth / 2,
        w: textWidth,
        h: textContent.dy + textContent.size / 2,
        contentId: textContent.id,
        contentType: 'text',
        disableActivity: false,
        fixedProportions: false
    } );

    layout.contents[ textContent.id ] = textContent;
    layout.blocks[ block.id ] = block;
    layout.pages[ pageId ].blocksList.push( block.id );
    layout.isCompleted = true;

    return {
        layout: layout,
        id: block.id
    };
};



/**
 * Добавляем фон в layout
 */
export const addBackgroundToLayout = ( { layout, bgObject = null, pageId }: { layout: ILayout, bgObject?: any, pageId: string } ): { layout: ILayout, id: string } => {

    const BG_URL = '/media/background/';

    // выпуск за линию обреза
    const fields = layout.format.cuts ? {
        left: layout.format.cuts.left + layout.format.padding.left || 3,
        top: layout.format.cuts.left + layout.format.padding.left || 3,
        right: layout.format.cuts.left + layout.format.padding.left || 3,
        bottom: layout.format.cuts.left + layout.format.padding.left || 3
    } : {
        left: 3,
        top: 3,
        right: 3,
        bottom: 3
    }

    //размеры формата
    const formatWidth: number = parseInt( layout.format.width ),
          formatHeight: number = parseInt( layout.format.height ),
          formatProportion: number = formatWidth / formatHeight;

    let bgWidth: number = 0,
        bgHeight: number = 0,
        bgProportion: number = 0;

    //размеры фона
    if ( bgObject ) {
        bgProportion = bgObject.width / bgObject.height;
        bgWidth = bgObject.width;
        bgHeight = bgObject.height;
    }

    const page = pageId && layout.pages[ pageId ] || layout.pages[ Object.keys( layout.pages )[ 0 ] ];

    //находим блок и контент старого фона, если он есть
    let blockOld = null,
        contentOld = null;
    page.blocksList.map( ( blockId ) => {
        if ( layout.blocks[ blockId ] && layout.blocks[ blockId ].type === 'background') {
            blockOld = layout.blocks[ blockId ];
            contentOld = layout.contents[ blockOld.content ];
        }
    })

    let calcSizeResult = {
            imgWidth:0,
            imgHeight: 0,
            imgTop: 0,
            imgLeft: 0
        };

    if ( bgObject ) {
        calcSizeResult = calcImageSizeInBlock( {
            centerOnly: true,
            blockW: formatWidth + fields.left + fields.right,
            blockH: formatHeight + fields.top + fields.bottom,
            blockRatio: formatProportion,
            imgW: bgWidth,
            imgH: bgHeight,
            imgX: 0,
            imgY: 0,
            imgRatio: bgProportion
        } );
    }

    const bgContent: ICreateContentBackground = createContentBackground( {
        backgroundType: bgObject && bgObject.ext || 'fill',
        backgroundId: bgObject && bgObject.id || null,
        x: calcSizeResult.imgLeft,
        y: calcSizeResult.imgTop,
        w: calcSizeResult.imgWidth,
        h: calcSizeResult.imgHeight,
        pxWidth: bgObject && bgObject.width || 0,
        pxHeight: bgObject && bgObject.height || 0,
        r: 0,
        ...( contentOld ? {
            bgColor: contentOld.bgColor,
            isPattern: contentOld.isPattern,
            opacity: contentOld.opacity,
            patternHeight: contentOld.patternHeight,
            patternWidth: contentOld.patternWidth
        } : {})
    } );

    const block: ILayoutBlock = createBlock( {
        x: fields.left * -1,
        y: fields.top * -1,
        w: page.w + fields.left + fields.right,
        h: page.h + fields.top + fields.bottom,
        contentId: bgContent.id,
        contentType: 'background',
        disableActivity: false,
        fixedProportions: true
    } );

    layout.contents[ bgContent.id ] = contentOld ? {...contentOld, ...bgContent} : bgContent;
    layout.blocks[ block.id ] = blockOld ? {...blockOld, ...block} : block;
    layout.pages[ pageId ].blocksList.unshift( block.id );


    if ( contentOld ) delete( layout.contents[ contentOld.id ] );
    if ( blockOld ) {
        delete ( layout.blocks[ blockOld.id ] );

        const index = page.blocksList.indexOf( blockOld.id );
        if ( index > -1 ) {
            page.blocksList.splice( index, 1 );
        }
    }

    layout.isCompleted = true;

    return {
        layout: layout,
        id: bgContent.id
    };
}


/**
 * Одновляем страницу на указанный шаблона темы в layout
 * @param layout
 * @param layoutTheme
 * @param templateId
 * @param pageId
 */
export const addThemeToPageToLayout = ( { layout, layoutTheme, sourceAreaId, areaId }: { layout: ILayout, layoutTheme: ILayout, sourceAreaId: string, areaId: string } ) => {



    const area: ILayoutArea = layout.areas[ areaId ],
          layoutNewTheme: ILayout = JSON.parse( JSON.stringify( layoutTheme ) ),
          areaSource: ILayoutArea = layoutNewTheme.areas[ sourceAreaId ];

    //массив id удаленных фоток
    const photosRemovedIds = [];

    area.pages.map( pageId => {
        const page: ILayoutPage = layout.pages[ pageId ];

        page.blocksList.map( blockId => {
            const block: ILayoutBlock = layout.blocks[ blockId ];

            //удаляем контент
            if ( block.content ) {
                delete ( layout.contents[ block.content ] );
            }

            //удаляем блок
            delete ( layout.blocks[ blockId ] );
        } );

        page.blocksList = [];

        //удаляем страниу
        delete ( layout.pages[ pageId ] );
    } );

    area.pages = [];

    //добавляем новые pages, blocks, contents
    area.pages = areaSource.pages.map( newPageId => {

        const newPage = JSON.parse( JSON.stringify( layoutNewTheme.pages[ newPageId ] ) );
        newPage.id = simpleID();

        newPage.blocksList = newPage.blocksList.map( ( newBlockId ) => {


            const newBlock = JSON.parse( JSON.stringify( layoutNewTheme.blocks[ newBlockId ] ) );
            newBlock.id = simpleID();

            if ( newBlock.content && newBlock.type !== 'photo') {
                const newContent = JSON.parse( JSON.stringify( layoutNewTheme.contents[ newBlock.content ] ) );
                newContent.id = simpleID();

                layout.contents[ newContent.id ] = newContent;
                newBlock.content = newContent.id;
            } else {
                newBlock.content = null;
            }

            layout.blocks[ newBlock.id ] = newBlock;

            return newBlock.id;
        });

        layout.pages[ newPage.id ] = newPage;

        return newPage.id;
    });

    //
    //
    // let blockList = layout.pages[pageId] && layout.pages[pageId].blocksList || null;
    // let layoutThemeBlockList = layoutTheme.pages[templateId] && layoutTheme.pages[templateId].blocksList || null;
    //
    // //если нет блоков, завершаем  функцию
    // if ( !blockList || !layoutThemeBlockList ) return null;
    //
    // blockList = JSON.parse( JSON.stringify( blockList ) );
    // layoutThemeBlockList = JSON.parse( JSON.stringify( layoutThemeBlockList ) );
    //
    // //массив id удаленных фоток
    // const photosRemovedIds = [];
    //
    // //удаляем со страницы все блоки и их контент
    // blockList.map( blockId => {
    //     const block = layout.blocks[blockId];
    //     if ( !block ) return null;
    //
    //     if ( block.content ) {
    //         const content = layout.contents[ block.content ];
    //         if ( content ) {
    //             if ( content.type === 'photo' ) photosRemovedIds.push( block.content );
    //             delete ( layout.contents[ block.content ] );
    //         }
    //     }
    //     delete ( layout.blocks[ blockId ] );
    // })
    //
    // layout.pages[pageId].blocksList = [];
    //
    // //добавляем блоки и контент из схемы в layout
    // layoutThemeBlockList.map( blockThemeId => {
    //     const blockTheme = layoutTheme.blocks[ blockThemeId ];
    //     if ( !blockTheme ) return null;
    //
    //     if ( blockTheme.content && blockTheme.type !== 'photo' ) {
    //         const contentTheme = layoutTheme.contents[ blockTheme.content ];
    //         const newContentId = simpleID();
    //         contentTheme.id = newContentId
    //         blockTheme.content = newContentId;
    //         layout.contents[ contentTheme.id ] = contentTheme;
    //     } else {
    //         blockTheme.content = null;
    //     }
    //
    //     blockTheme.id = simpleID();
    //
    //     layout.blocks[blockTheme.id] = blockTheme;
    //
    //     layout.pages[ pageId ].blocksList.push( blockTheme.id );
    // })

    return {
        layout: layout,
        photosRemovedIds: photosRemovedIds
    }
};

/**
 * Добавляем стикер в layout
 */
export const addStickerToLayout = ( { layout, sticker, pageId, dropPosition }: { layout: ILayout, sticker: ISticker, pageId: string, dropPosition?: {x: number, y:number} } ): { layout: ILayout, id: string } => {

    const MAX_SIZE_STICKER_BY_PAGE: number = 0.9;

    //размеры формата
    const formatWidth: number = parseInt( layout.format.width ),
          formatHeight: number = parseInt( layout.format.height ),
          formatProportion = formatWidth / formatHeight;

    //размеры стикера
    const stickerWidth: number = sticker.width,
          stickerHeight: number = sticker.height,
          proportion = stickerWidth / stickerHeight;

    //рассчитываем размеры изображения
    let stickerWidthSize = formatWidth * MAX_SIZE_STICKER_BY_PAGE,
        stickerHeightSize = stickerWidthSize / proportion;

    //смотри привышение стикера по размерам страницы (если больше MAX_NEW_PHOTO_LAYOUT_SIZE_IN_PERCENT)
    const overWidth = stickerWidthSize / formatWidth  > MAX_SIZE_STICKER_BY_PAGE;
    const overHeight = stickerHeightSize / formatHeight > MAX_SIZE_STICKER_BY_PAGE;

    const changeByWidth = ( checkAgain = true) => {
        stickerWidthSize = formatWidth * MAX_SIZE_STICKER_BY_PAGE;
        stickerHeightSize = stickerWidthSize / proportion;

        const overHeight = stickerHeightSize / formatHeight > MAX_SIZE_STICKER_BY_PAGE;
        if ( overHeight && checkAgain ) {
            changeByHeight( false );
        }
    }
    const changeByHeight = (checkAgain = true) => {
        stickerHeightSize = formatHeight * MAX_SIZE_STICKER_BY_PAGE;
        stickerWidthSize = stickerHeightSize * proportion;

        const overWidth = stickerWidthSize / formatWidth  > MAX_SIZE_STICKER_BY_PAGE;

        if ( overWidth && checkAgain ) {
            changeByWidth( false );
        }
    }

    if ( overWidth && overHeight ) {
        if ( formatProportion <= proportion ) {
            changeByWidth();
        } else {
            changeByHeight();
        }
    } else if ( overWidth ) {
        changeByWidth();
    } else if ( overHeight ) {
        changeByHeight();
    }

    const stickerContent: ICreateContentSticker = createContentSticker( {
        type: sticker.svg ? 'sticker_svg' : 'sticker_png',
        stickerId: sticker.id,
        stickerSetId: sticker.stickerSet,
        svg: sticker.svg,
        fixedProportions: sticker.constrainProportions,
        viewBoxWidth: sticker.viewBoxWidth,
        viewBoxHeight: sticker.viewBoxHeight
    } );

    let x: number = 0,
        y: number = 0;

    if ( dropPosition ) {
        x = dropPosition.x - stickerWidthSize / 2;
        y = dropPosition.y - stickerHeightSize / 2;
    } else {
        x = formatWidth / 2 - stickerWidthSize / 2;
        y = formatHeight / 2 - stickerHeightSize / 2;
    }

    const block: ILayoutBlock = createBlock( {
        x: x,
        y: y,
        w: stickerWidthSize,
        h: stickerHeightSize,
        contentId: stickerContent.id,
        contentType: 'sticker',
        disableActivity: false,
        fixedProportions: sticker.constrainProportions
    } )

    layout.contents[ stickerContent.id ] = stickerContent;
    layout.blocks[ block.id ] = block;
    layout.pages[ pageId ].blocksList.push( block.id );
    layout.isCompleted = true;

    return {
        layout: layout,
        id: block.id
    };
}


/**
 * Добавляем фигуры в layout
 */
export const addShapeToLayout = ( { layout, shapeSvg, pageId, dropPosition }: { layout: ILayout, shapeSvg: string, pageId: string, dropPosition?: {x: number, y:number} } ): { layout: ILayout, id: string } => {
    //размеры формата
    const formatWidth: number = parseInt( layout.format.width ),
          formatHeight: number = parseInt( layout.format.height ),
          formatProportion = formatWidth / formatHeight;

    //размеры стикера
    const shapeWidth: number = formatWidth / 3,
          shapeHeight: number = shapeWidth,
          proportion = shapeWidth / shapeHeight;

    //рассчитываем размеры изображения
    let shapeWidthSize = formatWidth * 0.7,
        shapeHeightSize = shapeWidthSize * proportion;

    //смотри привышение фотографии по размерам страницы (если больше MAX_NEW_PHOTO_LAYOUT_SIZE_IN_PERCENT)
    const overWidth = formatWidth / shapeWidthSize > 0.7;
    const overHeight = formatHeight / shapeHeightSize > 0.7;

    const changeByWidth = () => {
        shapeWidthSize = formatWidth * 0.7;
        shapeHeightSize = shapeWidthSize / proportion;
    }
    const changeByHeight = () => {
        shapeHeightSize = formatHeight * 0.7;
        shapeWidthSize = shapeHeightSize * proportion;
    }

    if ( overWidth && overHeight ) {
        if ( formatProportion <= proportion ) {
            changeByWidth();
        } else {
            changeByHeight();
        }
    } else if ( overWidth ) {
        changeByHeight();
    } else if ( overHeight ) {
        changeByWidth();
    }

    const shapeContent: ICreateContentShape = createContentShape( {
        type: 'shape',
        svg: shapeSvg,
        fixedProportions: false,
        viewBoxWidth: 500,
        viewBoxHeight: 500
    } );

    let x: number = 0,
        y: number = 0;

    if ( dropPosition ) {
        x = dropPosition.x - shapeWidthSize / 2;
        y = dropPosition.y - shapeHeightSize / 2;
    } else {
        x = formatWidth / 2 - shapeWidthSize / 2;
        y = formatHeight / 2 - shapeHeightSize / 2;
    }

    const block: ILayoutBlock = createBlock( {
        x: x,
        y: y,
        w: shapeWidthSize,
        h: shapeHeightSize,
        contentId: shapeContent.id,
        contentType: 'shape',
        disableActivity: false,
        fixedProportions: false
    } )

    layout.contents[ shapeContent.id ] = shapeContent;
    layout.blocks[ block.id ] = block;
    layout.pages[ pageId ].blocksList.push( block.id );
    layout.isCompleted = true;

    return {
        layout: layout,
        id: block.id
    };
}



/**
 * Добавляем фото в layout
 * @param layout
 * @param photo
 * @param pageId
 */
export const addPhotoToLayout = ( { layout, photo, pageId, dropPosition }: { layout: ILayout, photo: IPhoto, pageId: string, dropPosition?: { x: number, y: number } } ): { layout: ILayout, id: string } => {

    //размеры формата
    const formatWidth: number = parseInt( layout.format.width ),
          formatHeight: number = parseInt( layout.format.height ),
          formatProportion = formatWidth / formatHeight;

    //размеры изображения
    const photoWidth: number = photo.sizeOrig.pxWidth,
          photoHeight: number = photo.sizeOrig.pxHeight;

    //рассчитываем размеры изображения
    let photoWidthSize: number = photoWidth / ( layout.format.dpi / 10 ),
        photoHeightSize: number = photoHeight / ( layout.format.dpi / 10 ),
        proportion = photoWidthSize / photoHeightSize;

    //смотри привышение фотографии по размерам страницы (если больше MAX_NEW_PHOTO_LAYOUT_SIZE_IN_PERCENT)
    const overWidth = photoWidthSize /formatWidth > 0.8;
    const overHeight = photoHeightSize / formatHeight > 0.8;


    const changeByWidth = ( checkAgain = true ) => {
        photoWidthSize = formatWidth * 0.8;
        photoHeightSize = photoWidthSize / proportion;

        const overHeight = photoHeightSize / formatHeight > 0.8;
        if ( overHeight && checkAgain ) {
            changeByHeight( false );
        }
    }
    const changeByHeight = ( checkAgain = true ) => {
        photoHeightSize = formatHeight * 0.8;
        photoWidthSize = photoHeightSize * proportion;

        const overWidth = photoWidthSize /formatWidth > 0.8;
        if ( overWidth && checkAgain ) {
            changeByWidth( false );
        }
    }

    if ( overWidth && overHeight ) {
        if ( formatProportion <= proportion ) {
            changeByWidth();
        } else {
            changeByHeight();
        }
    } else if ( overWidth ) {
        changeByHeight();
    } else if ( overHeight ) {
        changeByWidth();
    }

    const photoContent: ILayoutContentPhoto = createContentPhoto( {
        x: 0,
        y: 0,
        w: photoWidthSize,
        h: photoHeightSize,
        importFrom: photo.importFrom || "",
        url: photo.url,
        orig: photo.orig,
        photoId: photo.photoId,
        pxWidth: photoWidth,
        pxHeight: photoHeight,
        r: 0
    } );

    let x: number = 0,
        y: number = 0;

    if ( dropPosition ) {
        x = dropPosition.x - photoWidthSize / 2;
        y = dropPosition.y - photoHeightSize / 2;
    } else {
        x = formatWidth / 2 - photoWidthSize / 2;
        y = formatHeight / 2 - photoHeightSize / 2;
    }

    const block: ILayoutBlock = createBlock( {
        x: x,
        y: y,
        w: photoWidthSize,
        h: photoHeightSize,
        contentId: photoContent.id,
        contentType: 'photo',
        disableActivity: false,
        fixedProportions: true
    } )

    layout.contents[ photoContent.id ] = photoContent;
    layout.blocks[ block.id ] = block;
    layout.pages[ pageId ].blocksList.push( block.id );
    layout.isCompleted = true;

    return {
        layout: layout,
        id: block.id
    };
};

/**
 * Добавляем фото в блок в layout
 * @param layout
 * @param photo
 * @param blockId
 */
export const addPhotoInBlockLayout = ( { layout, photo, blockId }: { layout: ILayout, photo: IPhoto, blockId: string } ): { layout: ILayout } => {

    //размеры изображения
    const photoWidth: number = photo.sizeOrig.pxWidth,
          photoHeight: number = photo.sizeOrig.pxHeight;

    //индекс список блоков страницы
    const block = layout.blocks[ blockId ];

    //рассчитываем пропорции изображения
    const proportionPhoto = photoWidth / photoHeight,
          proportionBlock = block.w / block.h;

    let photoWidthSize: number = 0,
        photoHeightSize: number = 0,
        deltaPhotoX = 0,
        deltaPhotoY = 0;

    if ( proportionPhoto < proportionBlock ) {
        photoWidthSize = block.w;
        photoHeightSize = photoWidthSize / proportionPhoto;
        deltaPhotoY = ( photoHeightSize - block.h ) / 2;
    } else {
        photoHeightSize = block.h;
        photoWidthSize = photoHeightSize * proportionPhoto;
        deltaPhotoX = ( photoWidthSize - block.w ) / 2;
    }

    const photoContent: ILayoutContentPhoto = createContentPhoto( {
        x: deltaPhotoX * -1,
        y: deltaPhotoY * -1,
        w: photoWidthSize,
        h: photoHeightSize,
        importFrom: photo.importFrom || "",
        url: photo.url,
        orig: photo.orig,
        photoId: photo.photoId,
        pxWidth: photoWidth,
        pxHeight: photoHeight,
        r: block.r
    } );

    block.content = photoContent.id;

    layout.contents[ photoContent.id ] = photoContent;
    layout.isCompleted = true;

    return {
        layout: layout
    };
}

/**
 * Меняем порядок блока в зависимости от направления
 * @param blockId
 * @param direction
 */
export const orderBlockChaneInLayout = ( { layout, blockId, direction }: { layout: ILayout, blockId: string, direction: IBlockOrderType } ) => {

    //находим к какой странице принадлежит данный блок
    for ( let key in layout.pages) {

        //находим позицию блока в массиве блоков
        const blockPosition: number = layout.pages[ key ].blocksList.indexOf( blockId );

        if ( ~blockPosition ) {
            const blocksList = layout.pages[ key ].blocksList;

            if ( blockPosition > 0 && direction !== 'up' ) {
                const idPrevBlockInList = blocksList[ blockPosition - 1 ];
                if ( layout.blocks[ idPrevBlockInList ] && layout.blocks[ idPrevBlockInList ].type === 'background' ) {
                    return layout;
                }
            }

            if ( direction === 'up' ) {
                layout.pages[ key ].blocksList = moveElementDown( { arr: blocksList, index: blockPosition } );
            } else {
                layout.pages[ key ].blocksList = moveElementUp( { arr: blocksList, index: blockPosition } );
            }

            break;
        }
    }

    return layout;
}

/**
 * Удаляем блок с фото из layout
 * @param layout
 * @param isCompleted
 */

export const deleteBlockWidthPhotoToLayout = ( { layout, blockId }: { layout: ILayout, blockId: string } ): { layout: ILayout, contentId: string } => {

    let contentId:string = '';

    //находим к какой странице принадлежит данный блок
    for ( let pageId in layout.pages) {

        //находим позицию блока в массиве блоков
        const blockPosition: number = layout.pages[ pageId ].blocksList.indexOf( blockId );

        if ( ~blockPosition ) {

            //удаляем блок из массива страницы
            layout.pages[ pageId ].blocksList.splice( blockPosition, 1 );

            //удаляем контент и блок
            contentId = layout.blocks[ blockId ].content;

            delete ( layout.contents[ contentId ] );
            delete ( layout.blocks[ blockId ] );

            if ( !Object.keys( layout.contents ).length ) {
                layout.isCompleted = false;
            }

            break;
        }
    }



    return {
        layout: layout,
        contentId: contentId
    };
}

/**
 * Удаляем фото из блока из layout
 * @param layout
 * @param isCompleted
 */
export const deletePhotoFromBlockToLayout = ( { layout, blockId }: { layout: ILayout, blockId: string | number } ): { layout: ILayout, contentId: string } => {
    //удаляем контент
    let block = layout.blocks[ blockId ];
    //если нет блока, нужно попробовать найти его через contentId
    if ( !block ) {
        Object.keys( layout.blocks ).map( key => {
            if ( layout.blocks[ key ].content === blockId ) {
                block = layout.blocks[ key ];
            }
        });
    }

    //если блок так и не найден, завершаем
    if ( !block ) return {
        layout: layout,
        contentId: null
    }

    const contentId = block.content;

    delete ( layout.contents[ contentId ] );
    block.content = null;

    if ( !Object.keys( layout.contents ).length ) {
        layout.isCompleted = false;
    }

    return {
        layout: layout,
        contentId: contentId
    };
};


/**
 * Обновляем параметры готовности layout
 * @param layout
 * @param isCompleted
 */
export const productLayoutSetIsCompleted = ( { layout, isCompleted }: { layout: ILayout, isCompleted: boolean } ): { layout: ILayout, isUpdated: boolean } => {
    let isUpdated = false;
    const isContents = Object.keys( layout.contents ).length;

    if ( isCompleted && isContents ) {
        if ( !layout.isCompleted ) isUpdated = true;
        layout.isCompleted = true;
    } else {
        if ( layout.isCompleted ) isUpdated = true;
        layout.isCompleted = false;
    }

    return {
        layout: layout,
        isUpdated: isUpdated
    };
}


/**
 * Обновляем параметры блока и фотографии внутри
 * @param layout
 * @param block
 * @param contentPhoto
 */
export const updateBlockWithContentLayout = ( { layout, block = null, contentPhoto = null}: { layout: ILayout, block?: ILayoutBlock, contentPhoto?:ILayoutContentPhoto } ): ILayout | null => {

    //получаем id контента
    const contentId = block && block.content || block && layout.blocks[ block.id ].content || contentPhoto && contentPhoto.id;

    //если есть блок, обновляем информацию о блоке
    if ( block ) {
        layout.blocks[ block.id ] = {
            ...layout.blocks[ block.id ], ...block
        }
    } else if( contentId ) {
        Object.keys( layout.blocks ).map( key => {
            if ( layout.blocks[ key ].content === contentId ) {
                block = layout.blocks[ key ];
            }
        } );
    }

    //обновляем размеры фотографии
    if ( contentId && block.type !== 'sticker' ) {
        if ( block.type === 'photo' ) {
            const newPhotoPosition = contentPhoto ? { ...layout.contents[ contentId ], ...contentPhoto } : layout.contents[ contentId ];

            const { imgWidth, imgHeight, imgTop, imgLeft } = calcImageSizeInBlock( {
                blockW: block.w,
                blockH: block.h,
                blockRatio: block.w / block.h,
                imgW: newPhotoPosition.w,
                imgH: newPhotoPosition.h,
                imgX: newPhotoPosition.x,
                imgY: newPhotoPosition.y,
                imgRatio: layout.contents[ contentId ].pxWidth / layout.contents[ contentId ].pxHeight
            } );

            layout.contents[ contentId ] = {
                ...layout.contents[ contentId ],
                x: imgLeft,
                y: imgTop,
                w: imgWidth,
                h: imgHeight
            }
        } else if ( block.type === 'background' ) {
            layout.contents[ contentId ].w = contentPhoto.w;
            layout.contents[ contentId ].h = contentPhoto.h;
            layout.contents[ contentId ].x = contentPhoto.x;
            layout.contents[ contentId ].y = contentPhoto.y;
        } else {
            layout.contents[ contentId ].w = block.w;
            layout.contents[ contentId ].h = block.h;
        }
    }

    return layout;
}
/**
 * Обновляем Формат и опции в продукте
 * @param layout
 * @param format
 * @param options
 * @param name
 * @param description
 * @param productId
 * @param productSlug
 */
export const updateFormatOptionsAndProductInfoInLayout = ( { layout, format, options, name, description, productId, productSlug }: IUpdateFormatOptionsAndProductInfoInLayout ): { layout: ILayout, clearWorkList: boolean } => {

    let clearWorkList = false;
    if ( parseInt( layout.format.width ) !== parseInt( format.width ) ||
        parseInt( layout.format.height ) !== parseInt( format.height ) ) {

        //убираем все блоки страниц
        Object.keys( layout.pages ).map( ( id: string ) => {
            layout.pages[ id ].blocksList = [];
            layout.pages[ id ].w = parseInt( format.width );
            layout.pages[ id ].h = parseInt( format.height );
            layout.pages[ id ].x = 0;
            layout.pages[ id ].y = 0;
        } );

        //убираем блоки
        layout.blocks = {};
        //убираем контексты
        layout.contents = {};
        layout.isCompleted = false;
        clearWorkList = true;
    }

    layout.options = options;
    layout.format = format;
    layout.name = name;
    layout.description = description;
    layout.productId = productId;
    layout.productSlug = productSlug;

    return {
        layout: layout,
        clearWorkList: clearWorkList
    };
}

/**
 * Временный транслятор API из старого кода в новый для format
 * @param data
 */
export const createFormatAndOptionAdapter = ( data ): { formatObject: ILayoutFormat, optionsList: ILayoutOption[] } => {

    const { isCreateThemeFormat, options, format } = data;

    //строим опции
    let cuts: ILayoutCuts = { top: 0, left: 0, right: 0, bottom: 0, outside: false };
    let padding: number = 0;

    //собираем список опций согласно интерфейсу ILayoutOption
    const optionsList: ILayoutOption[] = isCreateThemeFormat ? [] : Object.keys( options ).map( key => {
        const o = options[ key ];

        //если опция БУМАГА (paper) и есть тех информация, вытаскиваем
        if ( o.name === 'paper' && o.technicalDescription ) {
            const techDesc = o.technicalDescription;
            cuts = {
                top: Math.abs( parseInt( techDesc.printCutLineTop ) || 0 ),
                left: Math.abs( parseInt( techDesc.printCutLineLeft ) || 0 ),
                right: Math.abs( parseInt( techDesc.printCutLineBottom ) || 0 ),
                bottom: Math.abs( parseInt( techDesc.printCutLineRight ) || 0 ),
                outside: parseFloat( techDesc.printCutLineTop ) < 0
            };
            //если есть отступ, задаем его
            if ( techDesc.padding ) padding = parseInt( techDesc.padding );
        }

        const result: ILayoutOption = {
            id: o.optionCategoryId, //id опции (категория опций)
            formatOptionId: o.optionFormatId, //id связка формата с опцией
            selectedOptionId: o.id, //id выбранный элемент опции
            name: o.name,
            optionSlug: o.optionSlug,
            nameSelected: o.selectedName,
            price: o.price
        }
        return result
    } );

    return {
        optionsList: optionsList,
        formatObject: {
            id: format.id,
            formatSlug: data.formatRotated ? rotateFormatId(format.formatSlug) : format.formatSlug,
            dpi: format.dpi,
            name: format.name,
            width: !data.formatRotated ? format.width : format.height,
            height: !data.formatRotated ? format.height : format.width,
            barcodePosition: format.barcodePosition,
            cuts: cuts,
            padding: {
                left: padding,
                top: padding,
                right: padding,
                bottom: padding
            }
        }
    }
}

/**
 * Временный транслятор API из старого кода в новый для layout
 * @param data
 */
//@ts-ignore
export const createLayoutAdapter = ( data ): ICreateLayout => {

    //массив id выбранных фотографий
    const photosIds: string[] = data.photosArray && data.photosArray.map( ( photo: IPhoto ) => photo.photoId ) || [];

    //создаем объект с форматом и опциями
    const { formatObject, optionsList } = createFormatAndOptionAdapter( data )
    // console.log('createLayoutAdapter',{formatObject, optionsList});
    return {
        ...data,
        name: data.productName,
        description: data.productDescription,
        format: formatObject,
        options: optionsList,
        photoIds: photosIds,
        // productType: 'poster',
    }
}
//@ts-ignore
export const createLayoutTS = ( data ) => createLayout( createLayoutAdapter( data ) );

// @ts-ignore
/**
 * Расчет координат фотографии в блоке
 * @param blockW
 * @param blockH
 * @param blockRatio
 * @param imgW
 * @param imgH
 * @param imgX
 * @param imgY
 * @param imgRatio
 * @param firstInsertImage
 */
interface ICalcImageSizeInBlock {
    blockW: number;
    blockH: number;
    blockRatio: number;
    imgW: number;
    imgH: number;
    imgX: number;
    imgY: number;
    imgRatio: number;
    centerOnly?: boolean
}

interface ICalcImageSizeInBlockResult {
    imgWidth: number;
    imgHeight: number;
    imgTop: number;
    imgLeft: number;
}
// @ts-ignore
export const calcImageSizeInBlock = ( { blockW, blockH, blockRatio, imgW, imgH, imgX, imgY, imgRatio, centerOnly = false, cut = 0 }: ICalcImageSizeInBlock ): ICalcImageSizeInBlockResult => {
    let imgWidth: number = imgW,
        imgHeight: number = imgH,
        imgTop: number = imgY,
        imgLeft: number = imgX,
        deltaX: number = 0,
        deltaY: number = 0;

    // console.log('blockW', blockW);
    // console.log('blockH', blockH);
    // console.log('blockRatio', blockRatio);
    // console.log('imgW', imgW);
    // console.log('imgH', imgH);
    // console.log('imgX', imgX);
    // console.log('imgY', imgY);
    // console.log('imgRatio', imgRatio);
    // console.log('firstInsertImage', firstInsertImage);

    if ( centerOnly ) {
        if ( imgRatio < blockRatio ) {
            imgWidth = blockW;
            imgHeight = imgWidth / imgRatio;
            deltaY = ( blockH - imgHeight ) / 2
        } else {
            imgHeight = blockH;
            imgWidth = imgHeight * imgRatio;
            deltaX = ( blockW - imgWidth ) / 2
        }
    } else {
        if ( ( imgHeight + imgTop ) < blockH || ( imgWidth + imgLeft ) < blockW ) {

            if ( ( imgWidth + imgLeft ) < blockW ) {
                imgWidth = blockW;
                imgHeight = imgWidth / imgRatio;
            }

            if ( ( imgHeight + imgTop ) < blockH ) {
                imgHeight = blockH;
                imgWidth = imgHeight * imgRatio;
            }

            if ( imgHeight + imgTop < blockH ) {
                imgTop = imgHeight - blockH;
                if ( imgTop > 0 ) imgTop = imgTop * -1;
            }

            if ( imgWidth + imgLeft < blockW ) {
                imgLeft = imgWidth - blockW;
                if ( imgLeft > 0 ) imgLeft = imgLeft * -1;
            }
        }
    }

    /*
    if ( blockW < imgWidth ) {
        let tempImgWidth = blockW,
            tempImgHeight = tempImgWidth / imgRatio;

        if ( tempImgHeight < blockH ) {
            tempImgHeight = blockH;
            tempImgWidth = tempImgHeight * imgRatio;
        }
        imgWidth = tempImgWidth;
        imgHeight = tempImgHeight;
    }
    if ( blockH < imgHeight  ) {
        let tempImgHeight = blockH,
            tempImgWidth = tempImgHeight * imgRatio;

        if ( tempImgWidth < blockW ) {
            tempImgWidth = blockW;
            tempImgHeight = tempImgWidth / imgRatio;
        }
        imgWidth = tempImgWidth;
        imgHeight = tempImgHeight;
    }*/


    return {
        imgWidth: imgWidth,
        imgHeight: imgHeight,
        imgTop: imgTop + deltaY - cut,
        imgLeft: imgLeft + deltaX - cut
    }

}

export const getParentBlock  = ( { layout, contentId }: IGetLayoutParents ): ILayoutBlock => {
    const blocksKeys: string[] = Object.keys(layout.blocks) || [];

    for ( let i = 0; i < blocksKeys.length; i++ ) {
        const block = layout.blocks[ blocksKeys[i] ]
        if ( block && block.content === contentId ) return block
    }
    return null
}

export const getParentPage  = ( { layout, blockId }: IGetLayoutParents ): ILayoutPage => {
    const pagesKeys: string[] = Object.keys(layout.pages) || [];

    if ( !blockId || !pagesKeys.length ) return null;

    for ( let i = 0; i < pagesKeys.length; i++ ) {
        const page = layout.pages[ pagesKeys[i] ]
        if ( page && page.blocksList.some( b => b === blockId ) ) return page;
    }
    return null;
}

export const getParentArea  = ( { layout, pageId }: IGetLayoutParents ): ILayoutArea => {
    const areasKeys: string[] = layout.areasList || [];

    if ( !pageId || !areasKeys.length ) return null;

    for ( let i = 0; i < areasKeys.length; i++ ) {
        const area = layout.areas[ areasKeys[i] ]
        if ( area && area.pages.some( p => p === pageId ) ) return area;
    }
    return null;
}
export const getAreaIndex  = ( { layout, areaId }: IGetLayoutParents ): number => {
    const index = layout.areasList.indexOf(areaId)
    return ~index ? (index + 1) : 0;
}

export const getLayoutParents = ( { layout, contentId, blockId, pageId }: IGetLayoutParents ): IGetLayoutParentsReturn => {
    if (!layout) return null
    let block, page, area, areaIndex = 0
    if (contentId) block = getParentBlock({layout, contentId})
    if (blockId || block.id) page = getParentPage({layout, blockId: blockId || block.id})
    if (pageId || page.id) area = getParentArea({layout, pageId: pageId || page.id})
    if (area.id) areaIndex = getAreaIndex({layout, areaId: area.id})
    return {
        block, page, area, areaIndex
    }
}

export const checkPhotoQuality = ( { dpi, pxWidth, pxHeight, mmWidth, mmHeight } ) => {
    const maxWidthMm = pxWidth * 25.4 / dpi;    // px * (мм в дюйме) / (px в дюйме)
    const maxHeightMm = pxHeight * 25.4 / dpi;

    return maxWidthMm > mmWidth && maxHeightMm > mmHeight;
};

//
// layout_data: {name: "Постер премиум", save_iteration: 0, product_id: "6", product_slug: "POSTER_PREMIUM",…}
// areas: {22l3xiyi6yzk3kltnelcya9xd9c: {id: "22l3xiyi6yzk3kltnelcya9xd9c", type: "poster", editable: true,…}}
// areas_list: ["22l3xiyi6yzk3kltnelcya9xd9c"]
// blocks: {,…}
// contents: {,…}
// description: "Постеры пригодятся для оформления вечеринок и тематических мероприятий, для украшения интерьера или в качестве подарка: просто загрузите свое изображение.↵Удобный онлайн-редактор и широкий выбор форматов сделают процесс создания вашего постера интуитивно понятным.↵Струйная печать - это высокое качество, яркость и интенсивность цвета. Постер сразу станет сочной деталью в вашем интерьере. Постеры со струйной печатью представнены в шестнадцати удобных форматах, подходящих под любое пространство."
// format: {id: "58", dpi: 200, name: "А4", width: 297, height: 210, barcode_position: "LONG_SIDE",…}
// in_cart: false
// is_completed: false
// is_deleted: false
// is_paid: false
// name: "Постер премиум"
// options: [,…]
// 0: {id: "1", format_option_id: "404", selected_option_id: "19", name: "paper", option_slug: "ROLLED_MAT",…}
// 1: {id: "7", format_option_id: "470", selected_option_id: "8", name: "LAMINATION",…}
// pages: {,…}
// geizaxn9v9gjvy1yxtru63w04ki: {id: "geizaxn9v9gjvy1yxtru63w04ki", type: "poster_page", editable: true, w: 297, h: 297, x: 0, y: 0,…}
// photo_ids: []
// preview: "<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" data-ver="1" width="100%" height="100%" viewBox="0 0 297 297" ><defs><clipPath id="clip_print_geizaxn9v9gjvy1yxtru63w04ki"><rect x="-3" y="-3" width="303" height="303"></rect></clipPath><clipPath id="clip_cut_geizaxn9v9gjvy1yxtru63w04ki"><rect x="0" y="0" width="297" height="297"></rect></clipPath></defs><rect width="297" height="297" x="0" y="0" style="filter:url(#pageShadow)" ></rect><g><image width="426" height="303" x="-114.930957356968" y="-3" rotate="0" href="https://lh3.googleusercontent.com/iZdgPrxPhiaX9fl23O0uz7W0GKpgyUgmwitBmnm1YW72h7SPBYbvRMGZaboFUtCid1lqjsjI7RJRsLOh6dgOn2U=/%IMAGESIZE%/" clip-path="url(#clip_print_geizaxn9v9gjvy1yxtru63w04ki)"></image></g></svg>"
//     product_id: "6"
// product_slug: "POSTER_PREMIUM"
// save_iteration: 0
// tech_options: []
// theme_id: ""
// user_title: "Постер премиум"