
// @ts-ignore
import { useState, useEffect } from 'react';
import { IThemesSelected } from "../interfaces/themes";
// @ts-ignore
import { generatePath } from 'react-router';
// @ts-ignore
import LINKS from 'config/links';

// @ts-ignore
import { THEME_PRODUCT_GROUP } from 'const/productsTypes';

import { ImodalData } from '../components/_modals/Dialog';


/**
 * Генерация простого уникального id
 * @returns {string}
 * @constructor
 */
export const simpleID = (): string => [ 0, 1, 2 ].map( () => Math.random().toString( 36 ).substr( 2, 9 ) ).join( '' );

/**
 * перемещаем элемент в массиве
 * @param arr
 * @param oldIndex
 * @param newIndex
 */
export const moveElementInArray = ( {
                        arr,
                        oldIndex,
                        newIndex
                    }: {
                        arr: string[],
                        oldIndex: number,
                        newIndex: number
                    } ) => {
    while ( oldIndex < 0 ) {
        oldIndex += arr.length;
    }
    while ( newIndex < 0 ) {
        newIndex += arr.length;
    }
    if ( newIndex >= arr.length ) {
        let k = newIndex - arr.length;
        while ((k--) + 1) {
            arr.push( void ( 0 ) );
        }
    }
    arr.splice( newIndex, 0, arr.splice( oldIndex, 1 )[ 0 ] );
    return arr;
}

/**
 * Поднять элемент в массиве вверх
 * @param arr
 * @param index
 */
export const moveElementUp = ( { arr, index }: { arr: string[], index: number } ) => {
    if ( index < 1 ) return arr

    return moveElementInArray({
        arr: arr,
        oldIndex: index,
        newIndex: index - 1
    });
}

/**
 * Опустить элемент в массиве вниз
 * @param arr
 * @param index
 */
export const moveElementDown = ( { arr, index }: { arr: string[], index: number } ) => {
    if ( index > arr.length - 2 ) return arr

    return moveElementInArray({
        arr: arr,
        oldIndex: index,
        newIndex: index + 1
    });
}


/**
 * Хук подписки на нажатие клавиши
 * @param targetKey {string}
 * @returns {boolean}
 */
export const useKeyPress = ( targetKey : number ): boolean => {
    const [ keyPressed, setKeyPressed ] = useState( false );

    function downHandler( { keyCode } ) {
        // console.log('keyCode',keyCode);
        if ( keyCode === targetKey ) {
            setKeyPressed( true );
        }
    }

    const upHandler = ({ key }) => {
        if ( key === targetKey ) {
            setKeyPressed( false );
        }
    };

    // Add event listeners
    useEffect( () => {
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, []);

    return keyPressed;
}

/**
 * переводит объект параметров в строку для вставки в url
 * @param params - объект параметров
 * @param separator - разделитель
 */
export const urlParamsToString = ( params: object, separator: string = '&' ): string => {
    let result = '';
    if (params && typeof params === 'object') {
        result = Object.keys(params)
                       .map( key => `${ key }:${ (params[key] || 0).toString() }`)
                       .join(separator);
    }
    return result;
}

/**
 * переводит строку из url в объект параметров
 * @param urlString - строка параметров
 * @param separator - разделитель
 */
export const urlStringToParams = ( urlString: string = '', separator: string = '&' ): object => {
    let result = {};
    if ( urlString && urlString.length ) {
        urlString.split( separator ).map( item => {
            const obj = item.split( ':' );
            result[obj[0]] = obj[1]
        } );
    }
    return result;
}

interface ISetThemesUrl extends IThemesSelected {
    isAdmin?: boolean;
}
interface ISetProductUrl {
    productType?: string;
    format?: string;
    themeId?: string;
}

/**
 * Генерация ссылки на страницу тем
 */
export const generateThemesUrl = ( {productType = THEME_PRODUCT_GROUP.DECOR, format = 0, category = 0, page = 1, themeId = 0, isAdmin = false}: ISetThemesUrl): string => generatePath(
    isAdmin ? LINKS.ADMIN_THEMES : LINKS.THEMES, {
        productType: productType,
        format:  format,
        category: category,
        page: page,
        themeId:  themeId
    }
);
/**
 * Генерация ссылки на страницу продукта
 */
export const generateProductUrl = ( { productType = '4', format = '0', themeId = '0' }: ISetProductUrl ): string => generatePath(
    LINKS.PRODUCT, {
        productType: productType,
        format: format,
        themeId: themeId,
    }
);


/**
 * Смена w - h для formatSlug при повороте формата
 */
export const rotateFormatId = (formatId) => {
    if (!formatId || typeof formatId !== 'string') return  '';
    const idArray = formatId.split('_');
    return `${idArray[1]}_${idArray[0]}`;
};

/**
 * Вычисление размера пружины
 */
const SPRING_IMG_ASPECT = 180/258;          // Соотношение сторон картинки пружинки
const SPRING_SIZE = 8;                      // Физический размер пружинки (ширина в мм)

export const calculateSpring = (size, widthMM, rigel = 0) => {
    const margin = 1;
    const springWidth = size.w - margin*2;
    const k = springWidth / widthMM;
    const springSize = {
        w: SPRING_SIZE * k,
        h: 0,        x: 0,        y: 0,
        fullWidth: 0, margin: margin, halfWidth: 0, x2: 0, rigelPath: ''
    };
    let tail = springWidth % springSize.w;
    springSize.h = springSize.w / SPRING_IMG_ASPECT;

    springSize.fullWidth = springWidth - tail;
    springSize.x = (size.x || 0) + tail / 2 + margin;
    springSize.y = (size.y || 0) - springSize.h/2;

    if ( rigel ) {
        const halfSpringLength = (springWidth - rigel) / 2;
        tail = halfSpringLength % springSize.w;
        springSize.halfWidth = halfSpringLength - tail;
        springSize.x2 = springSize.x + springSize.fullWidth - springSize.halfWidth;
        const rigelSize = {
            x1: Math.round((widthMM - rigel)/.02) / 100,
            x2: 0,
        }
        rigelSize.x2 = rigelSize.x1 + rigel;
        springSize.rigelPath = `
            M${ rigelSize.x1 } -1
            C ${ rigelSize.x1 } ${ rigel*.7 }, ${ rigelSize.x2 } ${ rigel*.7 }, ${ rigelSize.x2 } -1
            Z`;  // Кривая отрисовки маски - выреза под ригель

    }
    return springSize;
};

/**
 * Hook Отслеживание клика вне компонента
 */
export function useClickOutside(ref, callback) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                callback && callback();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}


declare global {
    interface Window {
        __react_toast_provider: any;
    }
}
/**
 * Hook toast
 */
const addToastHandler = (message, params, intent) => {
    const add = window.__react_toast_provider && window.__react_toast_provider.current && window.__react_toast_provider.current.add;

    if (!add) {
        console.error('__react_toast_provider not find')
        return
    }

    add(message, {
        appearance: intent,
        ...(params.autoClose ? {autoDismissTimeout: params.autoClose} : {})
    })
    //
    //
    // console.log('message', message);
    // addToast(message, {
    //     appearance: intent,
    //     ...(params.autoClose ? {autoDismissTimeout: params.autoClose} : {})
    // })


}
export const toast = {
        success: (message, params= {}) => addToastHandler(message, params, 'success'),
        info: (message, params= {}) => addToastHandler(message, params, 'info'),
        warn: (message, params= {}) => addToastHandler(message, params, 'warning'),
        error: (message, params= {}) => addToastHandler(message, params, 'error'),
}
