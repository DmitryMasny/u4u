/**
 * функция обращения к тексту
 *
 * @returns {string}
 */

import TEXT from 'texts/main';
import TEXT_PRODUCT from 'texts/product';
import TEXT_GALLERY from 'texts/gallery';
import TEXT_PROFILE from 'texts/profile';
import TEXT_MY_PHOTOS from 'texts/my_photos';

const lexem = (...args) => {
    // Определение названия константы
    let str = '';
    for ( let i = 0; i < args.length; i++ ) {
        str += args[i] + '_';
    }
    str = str.slice( 0, -1 ).toUpperCase();

    // Определение файла константы
    switch ( str ) {
        case 'PHOTOBOOK_TYPE_HARD_GLUE' : return TEXT_PRODUCT[str];
        case 'PHOTOBOOK_TYPE_SOFT_GLUE' : return TEXT_PRODUCT[str];
        case 'PHOTOBOOK_TYPE_SOFT_CLIP' : return TEXT_PRODUCT[str];
        case 'PHOTOBOOK_TYPE_HARD_SPRING' : return TEXT_PRODUCT[str];
        case 'PHOTOBOOK_TYPE_SOFT_SPRING' : return TEXT_PRODUCT[str];
        case 'COVER_GLANCE' : return TEXT_PRODUCT[str];
        case 'COVER_MAT' : return TEXT_PRODUCT[str];


        default:
            //console.log( 'Не найдено ', str );
            return null;
    }
};

export default lexem;