import { IMG_DIR } from 'config/dirs';

//минимальный размер погрешности при расчетах
const md = 0.1;

/**
 * Функция доводки значений до 0 или 100, при погрешности расчетов
 * @param o
 * @returns {*}
 */
const closer = ( o ) => {
    const mdm = md * (-1);

    if ( o.x && o.x > mdm && o.x < md ) o.x = 0;
    if ( o.y && o.y > mdm && o.y < md ) o.y = 0;
    if ( o.width && o.width < 100 + md && o.width > 100 - md ) o.width = 100;
    if ( o.height && o.height < 100 + md && o.height > 100 - md ) o.height = 100;
    if ( o.content ) {
        if ( o.content.x && o.content.x > mdm && o.content.x < md ) o.content.x = 0;
        if ( o.content.y && o.content.y > mdm && o.content.y < md ) o.content.y = 0;
        if ( o.content.width && o.content.width < 100 + md && o.content.width > 100 - md ) o.content.width = 100;
        if ( o.content.height && o.content.height < 100 + md && o.content.height > 100 - md ) o.content.height = 100;
    }
    return o;
};

/**
 * Создаем штрихкод (все цифры - проценты)
 * @returns {object}
 */
const barCode = ( albumWidth, albumHeight ) => {
    const barCodeProportion = 138 / 299, //пропорции промокода
          albumProportion = albumHeight / albumWidth, //пропорции альбома
          barCodeWidth = 12, //размер штрихкода в процент,
          barCodeX = 5,
          barCodeY = 90,
          barCodePositionProportion = barCodeY / barCodeX;

    // console.log('x: barCodeX', barCodeX);
    // console.log('y: barCodeY', barCodeX * (barCodePositionProportion / albumProportion));

    return { //Блок штрихкода содержащий все размеры в процентах
        type: 'BACKGROUND',
        x: barCodeX,
        y: barCodeX * (barCodePositionProportion),// / albumProportion),
        width: barCodeWidth,
        height: barCodeWidth * (barCodeProportion / albumProportion),
        content: {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            image: IMG_DIR + 'common/backpage/kod.png'
        }
    };
};

/**
 *
 * @param albumInfo
 * @returns {object}}
 */
const coverParams = ( albumInfo ) => {
    const { coverType, bindingType, name, fmt, numPages } = albumInfo;

    const coverTypeFull = coverType + '_' + (bindingType ? bindingType.toUpperCase() : ''),
          coverMoreSize = 2;

    let params = {
        moreCoverSize: 0, //процент, на сколько блок в твердой обложке может быть меньше обложки
        hardCover: false,
        spring: false,
        clip: false,
        pur: false,
        roundedCorners: false,
        name: name,
        fmt: fmt,
        numPages: numPages,
        coverTypeFull: coverTypeFull
    };

    switch ( coverTypeFull ) {
        case 'HARD_COVER_GLUE':   //Твержая обложка на PUR клее
            params.moreCoverSize = coverMoreSize;
            params.hardCover = true;
            params.pur = true;
            break;
        case 'HARD_COVER_SPRING': //Твержая обложка на пружине
            params.hardCover = true;
            params.spring = true;
            params.roundedCorners = true;
            break;
        case 'SOFT_COVER_GLUE':   //Мягкая обложка на PUR клее
            params.pur = true;
            params.roundedCorners = true;
            break;
        case 'SOFT_COVER_CLIP':   //Мягкая обложка на скрепке
            params.clip = true;
            params.roundedCorners = true;
            break;
        case 'SOFT_COVER_SPRING': //Мягкая обложка на пружине
            params.spring = true;
            params.roundedCorners = true;
            break;

    }

    return params;
};

/**
 * Преобразование обложки альбома в правильную модель с относительными координатами.
 * @param cover
 * @returns {{coverFront: Array, coverBack: Array}, null}
 */
const convertCover = ( cover ) => {
    let coverFront = [],    //- {Array} Передняя обложка
        coverBack = [],     //- {Array} Задняя обложка
        wDelta = 0,         //- {Float} Координата x передней обложки в альбоме
        mmWidth = (cover.template.width - 20) / 2,  //- {Float} Ширина корешка в мм
        bgBlock = null,     //- {Object} Фон передней обложки
        scaleFix = 10.8,    //- {Float} фикс размера фона обложки
        shiftFix = 10,      //- {Number} фикс положения фона обложки
        imgOverUnits = scaleFix * cover.factor;     //- {Float} Вынос фона за границы листа

    // Фикс размеров при форматах 20х20 и 30х20
    if ( cover.template.height === 210 ) {
        scaleFix = (cover.template.width === 640) ? 15.6 : 15.3;
        shiftFix = 15;
        imgOverUnits = scaleFix * cover.factor;
    }

    // Определение блока передней обложки
    for ( let i = 0; i < cover.blocks.length; i++ ) {
        if ( cover.blocks[i].themeElementType === "FRONT_COVER_BACKGROUND" ) {
            bgBlock = cover.blocks[i];
        }
    }
    if ( !bgBlock ) {
        console.error('Передняя обложка не найдена');
        return null;
    }

    // Переопределение начала координат для передней обложки
    wDelta = bgBlock.x - shiftFix;

    // Определение размера обложки
    let coverSize = {
        height: bgBlock.height
    };
    coverSize.width = coverSize.height * (mmWidth / cover.template.height);

    //Так как на сервере все отталкивается от 600 высоты, если больше, перечситываем пропорционально
    // if ( coverSize.height > 600 ) {
    //     coverSize.width = (coverSize.width / coverSize.height) * 600;
    //     coverSize.height = 600;
    // }

    //перебираем блоки разворота
    cover.blocks.map( ( block ) => {

        //на переднюю или заднюю обложку
        const frontCover = block.x >= coverSize.width;
        let obj = null;

        switch ( block.themeElementType ) {
            case 'BACK_COVER_BACKGROUND':
            case 'FRONT_COVER_BACKGROUND':

                // Определяем размеры фона в юнитах
                const bgSize = {
                    proportions : block.contentWarp.width / block.contentWarp.height,
                    height: coverSize.height + imgOverUnits*2,
                    y: 0 - imgOverUnits
                };
                bgSize.width = bgSize.height * bgSize.proportions;

                if ( bgSize.width < (coverSize.width + imgOverUnits * 1.8) ) {
                     bgSize.width = coverSize.width + imgOverUnits*2;
                     bgSize.height = bgSize.width / bgSize.proportions;
                     bgSize.y = (coverSize.height - bgSize.height) / 2;
                }
                bgSize.x = (coverSize.width - bgSize.width) / 2;

                //строим модель фона
                obj = closer({
                    type: block.type,
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100,
                    content: {
                        x: utp( bgSize.x, coverSize.width ),
                        y: utp( bgSize.y, coverSize.height ),
                        width: utp( bgSize.width, coverSize.width ),
                        height: utp( bgSize.height, coverSize.height ),
                        image: block.content.image
                    }
                });

                break;
            case 'SPINE_BACKGROUND':
                break;
            default:
                //остальные блоки определяются по block.type
                switch ( block.type ) {
                    case 'TEXT':
                        if ( block.content ) {
                            obj = closer({
                                 name: 'Текстовый блок',
                                 type: block.type,
                                 x: utp( block.x - (frontCover ? wDelta : 0), coverSize.width ),
                                 y: utp( block.y, coverSize.height ),
                                 width: utp( block.width, coverSize.width ),
                                 height: utp( block.height, coverSize.height ),
                                 url: block.content.link
                            });
                        }
                        break;
                    case 'PHOTO':
                        if ( !block.contentWarp ) return null;
                        obj = closer({ //Блок содержащий все размеры в юнитах
                            //elementType: block.theme_element_type,
                            name: 'Фотография',
                            type: block.type,
                            x: utp( block.x - (frontCover ? wDelta : 0), coverSize.width ),
                            y: utp( block.y, coverSize.height ),
                            width: utp( block.width, coverSize.width ),
                            height: utp( block.height, coverSize.height ),
                            content: {
                                x: utp( block.contentWarp.x - block.x, block.width ),
                                y: utp( block.contentWarp.y - block.y, block.height ),
                                width: utp( block.contentWarp.width, block.width ),
                                height: utp( block.contentWarp.height, block.height ),
                                image: block.content.image
                            }
                        });

                        break;
                }

                break;
        }

        //добавляем объект в массив на переднюю или заднюю обложку
        if ( obj ) {
            if ( frontCover ) {
                coverFront.push( obj );
            } else {
                coverBack.push( obj );
            }
        }
    });


    coverBack.push( barCode( coverSize.width, coverSize.height ) );

    return {
        coverSize: coverSize,
        coverFront: coverFront,
        coverBack: coverBack
    }
};

/**
 * Преобразование обложки альбома в правильную модель с относительными координатами.
 * @param page
 * @returns {object}
 */
const convertPage = ( page ) => {
// console.log('page',page);

    let pageSize = {
            width: page.viewbox.width,
            height: page.viewbox.height
        },
        pageResult = [];


    for ( let i = 1; i < page.blocks.length; i++ ) {
        if ( page.blocks[ i ].themeElementType === "PAGE_BACKGROUND" ) {
            pageSize.height = page.blocks[ i ].height;
            pageSize.width = page.blocks[ i ].width;
            break;
        }
    }
    //Так как на сервере все отталкивается от 600 высоты, если больше, пересчитываем пропорционально
    if ( pageSize.height > 600 ) {
         pageSize.width = (pageSize.width / pageSize.height) * 600;
         pageSize.height = 600;
    }

// console.log('pageSize',pageSize);

    //перебираем блоки разворота
    page.blocks.map(( block ) => {
        let obj = null;

        //остальные блоки определяются по block.type
        switch ( block.type ) {
            case 'BACKGROUND':

                obj = closer({ //Блок содержащий все размеры в юнитах
                    //elementType: block.theme_element_type,
                    name: 'Фон',
                    type: block.type,
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 100,
                    content: {
                        x: utp( block.contentWarp.x - block.x, block.contentWarp.width ),
                        y: utp( block.contentWarp.y - block.y, block.contentWarp.height ),
                        width: utp( block.contentWarp.width, block.width ),
                        height: utp( block.contentWarp.height, block.height ),
                        image: block.content.image
                    }
                });
                break;
            case 'TEXT':
                if ( block.content ) {
                    obj = closer({
                        name: 'Текстовый блок',
                        type: block.type,
                        x: utp( block.x, pageSize.width ),
                        y: utp( block.y, pageSize.height ),
                        width: utp( block.width, pageSize.width ),
                        height: utp( block.height, pageSize.height ),
                        url: block.content.link
                    });
                }
                break;
            case 'PHOTO':
                if ( block && block.contentWarp ) {
                    obj = closer({ //Блок содержащий все размеры в юнитах
                        //elementType: block.theme_element_type,
                        name: 'Фотография',
                        type: block.type,
                        x: utp( block.x, pageSize.width ),
                        y: utp( block.y, pageSize.height ),
                        width: utp( block.width, pageSize.width ),
                        height: utp( block.height, pageSize.height ),
                        content: {
                            x: utp( block.contentWarp.x - block.x, block.width ),
                            y: utp( block.contentWarp.y - block.y, block.height ),
                            width: utp( block.contentWarp.width, block.width ),
                            height: utp( block.contentWarp.height, block.height ),
                            image: block.content.image
                        }
                    });
                }
                break;
        }

        //добавляем объект в массив на переднюю или заднюю обложку
        if ( obj ) {
            pageResult.push( obj );
        }
    });

    return {
        pageSize: pageSize,
        pageResult: pageResult
    }
};

/**
 * Преобразуем координаты из юнитов в проценты
 * @param p {number}
 * @param total {number}
 * @returns {number}
 */
const utp = ( p, total ) => ( p / total ) * 100;

/**
 * Последняя страница с заметками.
 * @param formatId
 * @returns {{pageResult: Array}}
 */
const backPage = ( formatId ) => {
    const formatName = getFormatNameById( formatId );

    let pageResult = [];
    pageResult.push( { //Блок содержащий все размеры в процентах
        //elementType: block.theme_element_type,
        type: 'BACKGROUND',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        content: {
            x: 0,
            y: 0,
            width: 100,
            height: 100,
            image: IMG_DIR + 'common/backpage/' + formatName + '_3.png'
        }
    } );

    return {
        pageResult: pageResult
    }
};

/**
 * Создание обложки PUR клей.
 * @param obj
 * @returns {{page: obj}}
 */
const createCoverPUR = ( obj ) => {
    let page = [],
        p = {},
        offK = 1,
        offsetFix = 1.5;

    if ( obj.fmt === 2 ) {
        // 20x20
        offsetFix = 2.24;
    } else if ( obj.fmt === 3 ) {
        // 30x20
        offK = 0.72;
        offsetFix = 2.14;
    } else if ( obj.fmt === 4 ) {
        // 20x30
        offK = 1.55;
        offsetFix = 1.72;

    } else if ( obj.fmt === 5 ) {
        // 30x30
        // offsetFix = 2.15;
    }

    obj.page.map( ( block ) => {
        if ( block.type === 'BACKGROUND' ) {
            if ( obj.side === 'right' && block.width < 99 ) return null; //не рисуем штрихкод на бэклайнере
            page.push( block );
        }
    });

    const percent = obj.percent / 2 + offsetFix;
    if ( obj.side === 'left' ) {
        p = {
            x: percent * offK,
            y: percent,
            width: 100 - percent * offK,
            height: 100 - percent * 2,
        };
    } else {
        p = {
            x: 0,
            y: percent,
            width: 100 - percent*offK,
            height: 100 - percent * 2,
        };
    }

    p.color = '#fff';
    p.type = 'RECTANGLE';

    page.push( p );

    return page;
};

/**
 * получение формата по format id (fmt)
 * @param formatId
 * @returns {*}
 */
const getFormatNameById = ( formatId ) => {
    let formatName = null;
    switch ( formatId ) {
        case 2: //20x20
            formatName = '20x20';
            break;
        case 3: //30x20
            formatName = '30x20';
            break;
        case 4: //20x30
            formatName = '20x30';
            break;
        case 5: //30x30
            formatName = '30x30';
            break;
    }
    return formatName;
};

export default function( data, onlyCover = false, params = {} ) {

    if ( !data || !data.pages ) return null;

    if ( !data.fmt && data.formatId ) data.fmt = data.formatId;
    let pages = [],
        coverBack = {},
        coverSize = null,
        formatId = data.fmt,
        coverParamsData = null,
        numOfPages = data.pages.length - 1,
        i;

    const totalPagesCount = data.pages.length,
          removeTitle = !!params.removeTitle,
          maxPages = params.maxPages && params.maxPages < data.pages.length ? params.maxPages : 0,
          pagesTotal = maxPages || totalPagesCount;

    //перебираем страницы
    for ( i = 0; i < pagesTotal; i++ ) {

        if ( removeTitle && i === 2 ) continue;

        const page = data.pages[ i ];

        //console.log('page', page);
        let r = null;

        switch ( page.type ) {
            case 'COVER':
                r = convertCover( page );
                if ( !r ) break;

                pages.push( r.coverFront );
                coverBack = r.coverBack;
                if ( !coverSize ) coverSize = r.coverSize;

                coverParamsData = coverParams({
                    coverType: data.coverType,
                    bindingType: data.bindingType,
                    coverSize: coverSize,
                    numPages: numOfPages,
                    name: data.name,
                    fmt: data.fmt
                });
                break;
            case 'TITLE_PAGE':
                //если это PUR клей, то обратную страницу обложки и лист в начало блока
                if ( coverParamsData && coverParamsData.pur ) {
                    pages.push( createCoverPUR( {
                        side: 'left',
                        page: pages[ 0 ],
                        percent: coverParamsData.moreCoverSize,
                        fmt: coverParamsData.fmt
                    }));

                    pages.push( null );
                    pages.push( null );
                } else {
                    //добавляем пустую на форзац
                    pages.push( null );
                }
                if ( !removeTitle ) {
                    r = convertPage( page );
                    pages.push( r.pageResult );
                }
                break;
            default: //LEFT_PAGE и RIGHT_PAGE
                r = convertPage( page );
                pages.push( r.pageResult );
                break;
        }
        if ( onlyCover ) break;
    }

    if ( !onlyCover ) {
        const bPage = backPage( formatId );

        pages.push( bPage.pageResult );

        //если это PUR клей, то добавляем по странице в конец
        if ( coverParamsData.pur ) {
            pages.push( null );
            pages.push( null );
            pages.push( createCoverPUR( {
                side: 'right',
                page: coverBack,
                percent: coverParamsData.moreCoverSize,
                fmt: coverParamsData.fmt
            }));
        } else {
            //добавляем пустую на нарзац
            pages.push( null );
        }

        pages.push( coverBack );
    }

    //console.log('Калькуляция превью');
    return {
        coverSize: coverSize,
        pages: pages,
        coverParams: coverParamsData
    }
}