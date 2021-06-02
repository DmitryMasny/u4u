import {PRODUCT_TYPE_POSTER} from "const/productsTypes";
import {simpleID, arrayToObject} from "./helpers";

/**
 * Внутренние функции
 */

// Подставление величины в формулу
/*
    $fW$    - format width
    $fH$    - format height
    $pMT$   - print_options margin top
    $pMB$   - print_options margin bottom
    $pML$   - print_options margin left
    $pMR$   - print_options margin right
*/
const getFormulaValue = ( x, area, format ) => {
    switch (x) {
        case '$fW$': return format.size.w;
        case '$fH$': return format.size.h;
        case '$pMT$': return area.print_options.top;
        case '$pMB$': return area.print_options.bottom;
        case '$pML$': return area.print_options.left;
        case '$pMR$': return area.print_options.right;
        default: return 0;
    }
};

// Пока упрощенная функция расчета по формуле
const formulaCalculate = ( formula, area, format ) => {
    const f = formula.split(' ');
    let sum = 0;

    for (let i=0; i < f.length; i++) {
        let value = 0;
        if (f[i].indexOf('$') > -1) {
            value = getFormulaValue(f[i], area, format);
            if (typeof value === 'number') {
                if (i>0) {
                    switch (f[i-1]) {
                        case '-': sum -= value; break;
                        case '+': sum += value; break;
                    }
                } else sum += value;
            }
        }
    }
    return sum;
};

// Расчет позиции фотографии по-умолчанию (по центру) для постера
const InitResizePosterPhoto = ( pW, pH, fW, fH ) => {
    const fK = fW / fH; //пропорции формата
    const pK = pW / pH; //пропорции фотки
    let w = 0, h = 0, x = 0, y = 0;

    if ( pK > fK ) {   // пропорции фотки шире чем у блока
        h = fH;
        w = Math.round( fH * pK );
        x = Math.round( (fW - w) / 2 );
    } else {
        w = fW;
        h = Math.round( fW / pK );
        y = Math.round( (fH - h) / 2 );
    }

    return { w:w, h:h, x:x, y:y }
};
/*



/*
// создать структуру blocks
const createLayoutPageBlocks = ({ pageType, print, format, photo, posterBlockId, posterContentId }) => {

    const formatW = format.size.w + print.cropLeft + print.cropRight;
    const formatH = format.size.h + print.cropTop + print.cropBottom;

    const posterBgContent = (()=>createPosterBgContent(photo, formatW, formatH, posterContentId ))();
    const posterBgBlock = {
        id:  posterBlockId || 'block-' + generateUID(),
        type: 'background',
        disableActivity: true,
        x: -print.cropLeft,
        y: -print.cropTop,
        w: formatW,
        h: formatH,
        r: 0,
        // zIndex: 5,
        content: posterBgContent.id
    };
    return {
        blocks: [posterBgBlock],
        content: posterBgContent
    }
};

/*
// создать структуру pages
const createLayoutAreaPages = ({area, print, format, photo, posterPageId, posterBlockId, posterContentId }) => {
    let returnedContent = [], returnedBlocks = [];

    return {
        pages: area.pages.map((page) => {
            const PageBlocks = createLayoutPageBlocks({
                pageType: page.type,
                print: print,
                format: format,
                photo: photo,
                posterBlockId: posterBlockId,
                posterContentId: posterContentId
            });
            returnedContent.push(PageBlocks.content);
            returnedBlocks.push(...PageBlocks.blocks);
            return {
                id: posterPageId || 'page-' + generateUID(),
                type: page.type,
                disabled: page.disabled,
                shadow: page.shadow,
                w: formulaCalculate(page.w, area, format),
                h: formulaCalculate(page.h, area, format),
                x: formulaCalculate(page.x, area, format),
                y: formulaCalculate(page.y, area, format),
                blocksList: PageBlocks.blocks.map((item)=>item.id),
            }
        }),
        content: returnedContent,
        blocks: returnedBlocks,
    }
};

/*
// создать основную структуру для layout
const createLayoutData = ({areas, areasList, format, photo, posterPageId, posterBlockId, posterContentId}) => {
    // console.log('createLayoutData',{areas: areas, areasList: areasList, format: format, photo: photo});

    let returnAreasList = [], returnAreas = {}, returnPagesList = [], returnContent = [], returnBlocks = [];

    // Пробегаемся по массиву areasList и собираем данные в конечном виде для каждой area
    for (let i = 0; i < areasList.length; i++) {
        const areaId = areasList[i];
        const area = areas[areaId];
        const areaPages = createLayoutAreaPages({
            area:area, print:area.print_options, format:format, photo:photo, posterPageId: posterPageId, posterBlockId: posterBlockId, posterContentId: posterContentId
        });
        returnAreas[areaId] = {
            type: area.type,
            // disabled: area.disabled,
            paper_allows: area.paper_allows,
            print_options: area.print_options,
            pages: areaPages.pages.map((item)=>item.id),
        };
        returnAreasList.push(areaId);
        returnPagesList.push(...areaPages.pages);
        returnContent.push(...areaPages.content);
        returnBlocks.push(...areaPages.blocks);
    }
    return {
        areas: returnAreas,
        areasList: returnAreasList,
        pages: arrayToObject(returnPagesList),
        content: arrayToObject(returnContent),
        blocks: arrayToObject(returnBlocks),
    }
};

/*
// создать структуру format
const createLayoutFormat = (format) => ({
    id: format.id,
    name: format.name,
    price: format.price,
    type: format.size.type,
    sizeType: format.size.sizeType,
    allow_rotate: format.size.allow_rotate,
    rotated: format.size.rotated,
    w: format.size.w,
    h: format.size.h,
});
*/

/**
 * Собираем Зону
 * @param editable
 * @param blocksIds
 * @param w
 * @param h
 * @param x
 * @param y
 * @param pageType
 * @returns {{blocksList: *, editable: *, w: *, h: *, x: *, y: *, id: string, type: (*|string)}}
 */
const areaBuilder = ( { editable = true, pagesIds = [], cropTop = 0, cropBottom = 0, cropLeft = 0, cropRight = 0, areaType } ) => {
    return {
        id: simpleID(),
        type: areaType || "",
        editable: editable,
        pages: pagesIds,
        printOptions: {
                        cropTop: cropTop,
                        cropBottom: cropBottom,
                        cropLeft: cropLeft,
                        cropRight: cropRight
                      }
    }
};

/**
 * Собираем страницу
 * @param editable
 * @param blocksIds
 * @param w
 * @param h
 * @param x
 * @param y
 * @param pageType
 * @returns {{blocksList: *, editable: *, w: *, h: *, x: *, y: *, id: string, type: (*|string)}}
 */
const pageBuilder = ( { editable = true, blocksIds = [], w, h, x, y, pageType } ) => {
    return {
        id: simpleID(),
        type: pageType || "",
        editable: editable,
        w: w,
        h: h,
        x: x,
        y: y,
        blocksList: blocksIds
    }
};

/**
 * Собираем блок
 * @param formatW
 * @param x
 * @param y
 * @param w
 * @param h
 * @param contentId
 * @param contentType
 * @returns {{disableActivity: boolean, r: number, w: *, x: number, h: *, y: number, id: string, type: *, content: (*|Array)}}
 */
const blockBuilder = ( {x, y, w, h, contentId, contentType = '', disableActivity = false} ) => {
    return {
        id: simpleID(),
        type: contentType,
        disableActivity: disableActivity,
        x, y, w, h,
        r: 0,
        // zIndex: 5,
        content: contentId || []
    };
};

/**
 * Собираем контент с фотографией в размер блока
 * @param photo
 * @param w
 * @param h
 * @param x
 * @param y
 * @param id {String=}
 * @returns {{r: number, pxHeight: *, pxWidth: *, w: *, x: *, h: *, y: *, photoId: (null|*), id: (*|string), type: string, import_from: *, url: *}}
 */
const contentPhotoBuilderFullBg = ( { photo = {}, w, h, x, y, id = null } ) => {
    //TODO поменять на camelCase данные в photo
    const origSize = photo.sizeOrig || photo.size_orig;

    if ( !origSize ) return null;

    const photoW = origSize.w;
    const photoH = origSize.h;

    //масштабируем размер фотографии в размер формата
    const resizedPhoto = InitResizePosterPhoto( photoW, photoH, w, h );

    return {
        id: id || simpleID(),
        type: 'photo',
        x: resizedPhoto.x + x,
        y: resizedPhoto.y + y,
        w: resizedPhoto.w,
        h: resizedPhoto.h,
        pxWidth: photoW,
        pxHeight: photoH,
        r: 0,
        photoId: photo.photoId || photo.id,
        url: photo.url,
        orig: photo.orig,
        importFrom: photo.importFrom || ""
    };
};

/**
 * Сообираем массив опций для Layout
 * @param options
 * @returns {Object}
 */
const optionsBuilder = ( options ) => {
    if ( !options ) return [];

    let cuts = { top: 0, left: 0, right: 0, bottom: 0, outside: false };
    let padding = 0;

    const optionsList = Object.keys( options ).map( key => {
            const o = options[ key ];
            /*
            return {
                "price": o.price,
                "id": o.id,
                "selected_id": o.selectedId,
                "name": o.name,
                "name_selected": o.selectedName
            }*/

            if ( o.name === 'paper' && o.technicalDescription ) {
                cuts = {
                    top: Math.abs( parseInt( o.technicalDescription.printCutLineTop ) || 0 ),
                    left: Math.abs( parseInt( o.technicalDescription.printCutLineLeft ) || 0 ),
                    right: Math.abs( parseInt( o.technicalDescription.printCutLineBottom ) || 0 ),
                    bottom: Math.abs( parseInt( o.technicalDescription.printCutLineRight ) || 0 ),
                    outside: parseFloat( o.technicalDescription.printCutLineTop ) < 0
                };
                if (o.technicalDescription.padding) padding = parseInt(o.technicalDescription.padding);
            }

            return {
                "price": o.price,
                "id": o.optionCategoryId, //id опции (категория опций)
                "formatOptionId": o.optionFormatId, //id связка формата с опцией
                "selectedOptionId": o.id, //id выбранный элемент опции
                "name": o.name,
                "optionSlug": o.optionSlug,
                "nameSelected": o.selectedName
            }
        } );
    return {
        options: optionsList,
        cuts,
        padding: {
            left: padding,
            right: padding,
            top: padding,
            bottom: padding,
        }
    }
};
/**
 * Собираем формат для Layout
 */
const formatBuilder = ( { name, id, width, height, dpi, barcodePosition }, {cuts, padding}, formatRotated = false ) => {
    const w =  formatRotated ? height : width, h = formatRotated ? width : height;
    return {
        "id": id,
        "name": name,
        "dpi": dpi,
        "width": w,
        "height": h,
        "cuts": cuts,
        "padding": padding,
        "barcode_position": barcodePosition  // LONG_SIDE || SHORT_SIDE
    }
};

/**
 * Создание Layout продукта
 */
export const createLayout = ( data ) => {

    const { id = '',
            lastChanged = '',
            saveIteration = 0,
            photosArray,
            format,
            options,
            userId,
            productName,
            productDescription,
            productId,
            productSlug,
            formatRotated = false } = data;

    //if ( !format || !photo ) return null;
    if ( !format ) return null;

    /*
    const createdData = createLayoutData({
        areas: areas, areasList: areasList, format: format, photo: photos
    });
    */

    let contents = {},
        blocks = {},
        pages = {},
        areas = {},
        areasList = [];

    const optionsData = optionsBuilder( options );
    const formatData =  formatBuilder( format, optionsData, formatRotated );

    const photosIds = photosArray.map( photo => photo.photoId );

    /*
    const printFormat = {
        w: formatData.width + optionsData.cuts.left + optionsData.cuts.right,
        h: formatData.height + optionsData.cuts.top + optionsData.cuts.bottom,
        x: optionsData.cuts.left * -1,
        y: optionsData.cuts.top * -1,
    };


    //Собираем начальное состояние для конкретного продукта
    /*
    switch ( productInternalType ) {
        case 'poster':
        case 'photo':

            console.log('photo', photo);
            console.log('formatW', formatW);
            console.log('formatH', formatH);

     */

    //contents
    /*
    const cont = contentPhotoBuilderFullBg({
        photo,
        ...printFormat
    });*/

    //contents[cont.id] = cont;

    //blocks
    /*
    const block = blockBuilder({
        ...printFormat,
        contentId: cont.id,
        contentType: 'photo'
    });

    blocks[block.id] = block;
    */
    //pages
    const page = pageBuilder({
        //blocksIds: [block.id],
        x: 0,
        y: 0,
        w: formatData.width,
        h: formatData.height,
        pageType: 'poster_page'
    });

    pages[ page.id ] = page;

    //areas
    const area = areaBuilder({
        pagesIds: [page.id],
        areaType: 'poster'
    });

    areas[ area.id ] = area;

    areasList.push(area.id);
    /*
                break;
            default:
                break;
        }
    */
// console.log('===>',{page, block, cont});
    return {
        "id": id.toString(),
        "name": `${productName}`,
        "userTitle": `${productName} ${format.name}`,
        "productId": productId,
        "productSlug": productSlug,
        "saveIteration": saveIteration,
        "description": `${productDescription}`,
        "themeId": "",
        "userId": userId,
        "lastChanged": lastChanged,
        "isCompleted": true,
        "isDeleted": false,
        "isPaid": false,
        "inCart": false,
        "options": optionsData.options,
        "format": formatData,
        "techOptions": [],
        "contents": contents,
        "blocks": blocks,
        "pages": pages,
        "areas": areas,
        "areasList": areasList,
        "photoIds": photosIds

    };

    /*
        id: '?????', userId: '?????',  name: '?????',   // придет с сервера
        type: type,
        format: createLayoutFormat(format),
        areas: createdData.areas,
        areasList: createdData.areasList,
        pages: createdData.pages,
        content: createdData.content,
        blocks: createdData.blocks,
        options: options

        // photos: [],
        // backgrounds: [],
        // stickers: [],
        // frames: [],
    };*/
};

/**
 * Обновление продукта
 * @param newProps {Object} - Обновленные данные
 * @param productData {Object} - текущий layout
 *
export const updateLayoutFormat = ({type, format, options, areas, areasList}, productData) => {

    const createdData = createLayoutData({
        areas: areas,
        areasList: areasList,
        // pages: productData.pages,
        // blocks: productData.blocks,
        format: format,
        photo:  Object.values(productData.content)[0],
        posterPageId: productData.pages && Object.values(productData.pages)[0].id,
        posterBlockId: productData.blocks && Object.values(productData.blocks)[0].id,
        posterContentId: productData.blocks && Object.values(productData.blocks)[0].content,
    });

    return {
        // type: newProps.type,
        format: createLayoutFormat(format),
        pages: createdData.pages,
        content: createdData.content,
        blocks: createdData.blocks,
        options: options
    };
};*/

/**
 * Обновление Контента
 * @param photo {Object} - новая фотография
 * @param productData {Object} - текущий layout
 */
export const updateLayoutContent = ( { photo = null, id = null, data = {} } ) => {
    //обновляем контент по типу продукта
    /*
    switch ( data.productSlug ) {
        case 'poster':

     */
            //если нет id, получаем первый из списка
            if ( !id ) id = Object.keys( data.contents )[ 0 ];

            //console.log('--------------Object.keys( productData.contents )', Object.keys( data.contents ));
    /*
            break;
        default:
            break;
    }
    */
    if ( photo ) return {
        [ id ]: contentPhotoBuilderFullBg( {
                                                photo: photo,
                                                w: parseInt(data.format.width) + data.format.cuts.left + data.format.cuts.right,
                                                h: parseInt(data.format.height) + data.format.cuts.top + data.format.cuts.bottom,
                                                x: data.format.cuts.left * -1,
                                                y: data.format.cuts.top * -1,
        } )
    };

    return data.contents;
};
/**
 * Обновленеи координат контента
 * @param contentId
 * @param x
 * @param y
 * @param w
 * @param h
 */
export const updatePositionLayoutContent = ( { contents, contentId = null, x = null, y = null, w = null, h = null, r = 0 } ) => {
    //если нет контента с таким id, выходим
    const content = contents[ contentId ];

    if ( !content ) return contents;
    content.x = x;
    content.y = y;
    content.w = w;
    content.h = h;
    content.r = r;
    return  contents;
};

/**
 * Функция проверки layout с доступными продуктами
 * @param onlyCheck
 * @param oldProducts
 * @param oldLayout
 * @returns {null|{layout: *, errors: *, products: *}}
 * @constructor
 */

export const layoutParamsToProductsPosters = ( { onlyCheck = false, products: oldProducts, layout: oldLayout } ) => {
    if ( !oldProducts ) {
        console.error( 'layoutParamsToProductsPosters нет параметра products' );
        return null;
    }
    if ( !oldLayout ) {
        console.error( 'layoutParamsToProductsPosters нет параметра layout' );
        return null;
    }

    //массив ошибок
    let errors = [],
        products = JSON.parse( JSON.stringify( oldProducts ) ),
        layout = JSON.parse( JSON.stringify( oldLayout ) );

    //ищем тип продукта по id
    let thisProduct = products.filter( product => product.id === layout.productId );

    //console.log( 'products', products );
    //console.log( 'layout.productId ', layout.productId );

    //проверка на наличие типа продукта
    if ( !thisProduct.length ) { //нет такого типа продукта
        errors.push({
                        type: 'LayoutTypeRemoved',
                        level: 'error',
                        text: `Тип продукта "${layout.name}" более не доступен`
                    });

        //выставляем выбранный продукт по умолчанию
        products = products.setSelectedDefault();

        return {
            errors: errors,
            products: products,
            layout: layout
        }
    } else { //тип продукта существует
        thisProduct = thisProduct[ 0 ];
        //выставляем выбранный продукт согласно данным из layout
        products = products.setSelectedById( thisProduct.id );
    }

    //проверка на не совпадение имени продукта
    if ( thisProduct.name !== layout.name ) {
        errors.push({
                        type: 'LayoutTypeNameChanged',
                        level: 'info',
                        text: `Данный тип продукта "${layout.name}" переименован в "${thisProduct.name}"`
                    });
    }

    const productSelected = products.getSelected();

    //проверка на соответствие формата по id
    let thisProductFormat = Array.isArray( thisProduct.formats ) && thisProduct.formats.filter( format => format.id === layout.format.id ) || null;
    if ( !thisProductFormat || !thisProductFormat.length ) {
        errors.push({
                        type: 'LayoutFormatRemoved',
                        level: 'error',
                        text: `Формат "${layout.format.name}" размера ${layout.format.width}мм x ${layout.format.height}мм более не доступен`
                    });

        productSelected.formats.setSelectedDefault();
        return {
            errors: errors,
            products: products,
            layout: layout
        }
    } else {
        thisProductFormat = thisProductFormat[ 0 ];
        productSelected.formats.setSelectedById( thisProductFormat.id );
    }

    //проверка на соотвествие формата по имени
    if ( thisProductFormat.name !== layout.format.name ) {
        errors.push({
                        type: 'LayoutFormatNameChanged',
                        level: 'info',
                        text: `Формат "${layout.format.name}" размера ${layout.format.width}мм x ${layout.format.height}мм был переименован в "${thisProductFormat.name}"`
                    });
    }

    delete (productSelected.rotatedFormats);

    //проверка на соответвие формата по размеру
    if ( parseInt( thisProductFormat.width ) !== parseInt( layout.format.width ) || parseInt( thisProductFormat.height ) !== parseInt( layout.format.height ) ) {
        if ( parseInt( thisProductFormat.width ) === parseInt( layout.format.height ) && parseInt( thisProductFormat.height ) === parseInt( layout.format.width ) ) {
            productSelected.rotatedFormats = true;
        } else {
            errors.push( {
                             type: 'LayoutFormatSizeChanged',
                             level: 'error',
                             text: `Размеры формата "${layout.format.name}" изменены с ${layout.format.width}мм. x ${layout.format.height}мм. на ${thisProductFormat.width}мм. x ${thisProductFormat.height}мм.`
                         } );
            return {
                errors: errors,
                products: products,
                layout: layout
            }
        }
    }

    const formatSelected = productSelected.formats.getSelected();

    //проверяем на наличие опций
    if ( Array.isArray( layout.options ) && Array.isArray( thisProductFormat.options ) ) {
        layout.options.map( ( option, index ) => {
            let foundedOption = false;
            let foundedParamOption = false;

            for ( let i = 0; i < thisProductFormat.options.length; i++ ) {
                const productOption = thisProductFormat.options[ i ];

                //если нашли нужную опцию по id, проверяем ее на соответсвие
                if ( option.id === productOption.id ) {
                    foundedOption = true;

                    //опция была переименована
                    if ( option.name !== productOption.name ) {
                        errors.push({
                                        type: 'LayoutOptionNameChanged',
                                        level: 'info',
                                        text: `Опция "${option.name}" переименована в "${thisProduct.name}"`
                                    });
                    }

                    //ищем параметр опции
                    if ( Array.isArray( productOption.parameters ) ) {

                        for ( let y = 0; y < productOption.parameters.length; y++ ) {
                            const param = productOption.parameters[ y ];

                            //если нашлю нужный параметр, проверяем соотвествие
                            if ( option.selectedOptionId === param.optionId ) {

                                //переименовали параметр опции
                                if ( option.nameSelected !== param.name ) {
                                    errors.push({
                                                    type: 'LayoutOptionParamNameChanged',
                                                    level: 'info',
                                                    text: `Параметр "${option.nameSelected}" опции "${option.name}" переименован в "${param.name}"`
                                                });
                                }

                                //изменили цену параметра опции
                                if ( option.price !== param.price ) {
                                    errors.push({
                                                    type: 'LayoutOptionParamPriceChanged',
                                                    level: 'info',
                                                    text: `Стоимость "${option.name}" "${option.nameSelected}" изменена с ${option.price}руб. до ${param.price}руб.`
                                                });
                                }

                                //выставляем выбранный формат
                                formatSelected.options[ i ].parameters.map( ( p ) => {
                                    if ( p.optionId === param.optionId ) {
                                        p.selected = true;
                                    } else {
                                        if ( p.selected ) delete (p.selected);
                                    }
                                });

                                foundedParamOption = true;
                                break;
                            }
                        }
                    }
                    break;
                }
            }


            //не нашли опцию по id
            if ( !foundedOption ) {
                errors.push({
                                type: 'LayoutOptionNotFound',
                                level: 'error',
                                text: `Опция "${option.name}" была удалена`
                            });
            }

            //не нашли паратер опции
            if ( !foundedParamOption ) {
                formatSelected.options[index].parameters.setSelectedDefault();
                errors.push({
                                type: 'LayoutOptionParamNotFound',
                                level: 'error',
                                text: `Параметр "${option.nameSelected}" опции "${option.name}" был удален`
                            });
            }
        });
    }

    return {
        errors: errors,
        products: products,
        layout: layout
    }
};