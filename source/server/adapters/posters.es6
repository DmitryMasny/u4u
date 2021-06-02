import { PRODUCT_TYPES, SLUGS } from 'const/productsTypes';

/**
   Адаптер получения опций продуктов
 */
const getAllOptionsAdapter = ( data ) => {

    // data.allOptions && data.allOptions.map(
    //     (option) => ({
    //         ...option,
    //         options: option.options && option.options.map(
    //             (option) => ({
    //                 ...option,
    //                 parameters: option.parameters && option.parameters.sort( (a,b) => a.sortOrder - b.sortOrder )
    //             })
    //         ).sort( (a,b) => a.sortOrder - b.sortOrder )
    //     })
    // );

    let options = {};

    //бежим по опциям формата
    data.allOptions && data.allOptions.map( optionItem => {
        const optionCat = optionItem.optionCategory;
        if (!options[optionCat.id]) options[optionCat.id]={};

        //собираем данные опции
        const newOptionItem = {
            ...(optionItem.price ? {price: optionItem.price} : {}),
            id: optionItem.id,
            name: optionItem.name,
            description: optionItem.description,
            technicalDescription: JSON.parse(optionItem.technical_description || '{}'),
            optionSlug: optionItem.option_slug,
            sort: optionItem.sort,
            defaultPrice: optionItem.defaultPrice,
        };

        const itemO = options[ optionCat.id ];
        itemO.id = optionCat.id;
        itemO.name = optionCat.name;
        itemO.description = optionCat.description;
        itemO.sort = optionCat.sort;
        itemO.type = optionItem.type;

        if ( !itemO.parameters || !itemO.parameters.length ) {
            itemO.parameters = [];
        }
        itemO.parameters.push( newOptionItem );
    });

    //сортируем
    return Object.values(options).sort((a, b) => a.sort - b.sort).map(
        option => {
            // option.parameters && option.parameters.sort((a, b) => a.sort - b.sort);
            return option;
        }
    );
};

/**
 * Адаптер получения типов опций продуктов
 */
const getAllOptionTypesAdapter = ( data ) => {
    return data[ '__type' ] && data[ '__type' ].enumValues.map( ( item ) => ({
        id: item.name, name: item.description
    }) ) || [];
};

/**
 * Адаптер преобразования данных постеров для их выбора
 * @param data
 * @returns {*}
 */
const productGetPostersAdapter = ( data ) => {

    if ( !data || !data.poster_products ) return null;

    let d = null;
    if ( !Array.isArray( data.poster_products ) ) {
        d = [];
        d.push( data.poster_products );
    } else d = data.poster_products;

    //бежим по массиву продуктов
    let newData = {};

    d.map( ( p ) => {
        if (!p) return null;

        //информация о продуктах лежит в виде строки, парсим ее
        let productInfo = null, productImages = null;
        try {
            if (p.product_info) productInfo = JSON.parse( p.product_info );
            if (p.product_images) productImages = JSON.parse( p.product_images );
        } catch ( e ) {
            console.log('productGetPostersAdapter error!!', e);
            productInfo = [];
            productImages = [];
        }

        //собираем форматы
        let formats = [];
        let selectedFormat = 0;
        if ( Array.isArray( p.formats ) && p.formats.length ) {
            //бежим по форматам
            formats = p.formats.map( ( f, fIndex ) => {

                if ( f.selected ) selectedFormat = fIndex;

                //собираем опции формата
                let options = null;
                let defaultPrice = [];
                if ( Array.isArray( f.format_options ) && f.format_options.length ) {
                    options = [];
                    //бежим по опциям формата
                    f.format_options.map(( optionItem ) => {
                        const optionItemBody = optionItem.option;
                        const optionCat = optionItemBody.option_category;
                        if ( !options[ optionCat.id ] ) options[ optionCat.id ] = {};

                        //собираем данные опции
                        const newOptionItem = {
                            price: optionItem.price,
                            id: optionItem.id, //optionItemBody.id,
                            optionId: optionItemBody.id,
                            optionCategoryId: optionCat.id,
                            name: optionItemBody.name,
                            description: optionItemBody.description === 'null' ? '' : optionItemBody.description,
                            // technicalDescription: JSON.parse(optionItemBody.technical_description || '{}'),
                            technicalDescription: optionItemBody.technical_description.printCutLineTop ? optionItemBody.technical_description : JSON.parse(optionItemBody.technical_description || '{}'),
                            optionSlug: optionItemBody.option_slug,
                            sort: optionItem.sort_order,
                            defaultPrice: optionItem.default_price,
                        };
                        
                        let itemO = options[ optionCat.id ];
                        itemO.id = optionCat.id;
                        itemO.name = optionCat.name;
                        itemO.description = optionCat.description;
                        itemO.sort = optionCat.sort_order;
                        itemO.type = optionItemBody.type;

                        if ( optionItem.default_price ) {
                            defaultPrice.push( optionItem.price );
                        }

                        //если еще нет параметров, назначаем как пустой массив
                        if ( !itemO.parameters || !itemO.parameters.length ) itemO.parameters = [];

                        itemO.parameters.push( newOptionItem );
                    });

                    //уберем пустые
                    options = options.filter( ( item ) => !!item );

                    //сортируем
                    options.sort( ( a, b ) => a.sort - b.sort );
                    options = options.map( ( option ) => {
                        if (option.parameters) {
                            option.parameters.sort( ( a, b ) => a.sort - b.sort );
                            //добавляем выбранную по умолчанию опцию
                            let selectedParam = 0;
                            option.parameters.map( ( param, paramIndex ) => {
                                if ( param.selected ) selectedParam = paramIndex;
                            } );
                            option.parameters[ selectedParam ].selected = true;
                            option.parameters[ selectedParam ].selectedDefault = true;
                        }
                        return option;
                    });
                    //назначаем выделенную:
                }

                let minimalDefaultPrice = 0;

                if (defaultPrice.length) {
                    minimalDefaultPrice = defaultPrice.sort( ( a, b ) => a.sort - b.sort )[0];
                }

                return {
                    id: f.id,
                    formatSlug: f.format_slug,
                    // formatSlug: f.format_slug || f.width && `${f.width}_${f.height}`,
                    name: f.name,
                    width: f.width,
                    height: f.height,
                    dpi: f.dpi,
                    allowRotate: f.allow_rotate,
                    barcodePosition: f.barcode_position,
                    sort: f.sort_order,
                    options: options,
                    visible: f.visible,
                    defaultPrice: minimalDefaultPrice
                }
            });

            formats = formats.sort( ( a, b ) => a.sort - b.sort );

            formats[ selectedFormat ].selected = true;
            formats[ selectedFormat ].selectedDefault = true;
        }



        const goodProductData = {
            id: p.id,
            name: p.name,
            description: p.description,
            productInfo: productInfo,
            productImages: productImages,
            productSlug: p.product_slug,
            productGroup: p.product_group && p.product_group.slug,
            visible: p.visible,
            ...(p.selected ? {
                selected: true,
                selectedDefault: true,
            } : {}),
            formats: formats
        };

        let productTypeName = '';
        switch (p.product_slug) {
            case SLUGS.POSTER_SIMPLE:
            case SLUGS.POSTER_PREMIUM:
                productTypeName = PRODUCT_TYPES.POSTER;
                break;
            case SLUGS.PHOTO_SIMPLE:
            case SLUGS.PHOTO_PREMIUM:
                productTypeName = PRODUCT_TYPES.PHOTO;
                break;
            case SLUGS.POSTER_CANVAS:
                productTypeName = PRODUCT_TYPES.CANVAS;
                break;
            case SLUGS.PUZZLE:
                productTypeName = PRODUCT_TYPES.PUZZLE;
                break;
            case SLUGS.CALENDAR_WALL_SIMPLE:
            case SLUGS.CALENDAR_WALL_FLIP:
            case SLUGS.CALENDAR_TABLE_FLIP:
                productTypeName = PRODUCT_TYPES.CALENDAR;
                break;
            default:
                productTypeName = PRODUCT_TYPES.OTHER;
        }

        newData[productTypeName] = [...(newData[productTypeName] || []), goodProductData];

    });

    return newData;

    /*
    if ( Array.isArray( data.poster_products ) ) {
        return newData;
    } else {
        return newData[ 0 ];
    }*/
};

export { getAllOptionsAdapter, productGetPostersAdapter, getAllOptionTypesAdapter }