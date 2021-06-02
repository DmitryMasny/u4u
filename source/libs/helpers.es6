import { toast } from '__TS/libs/tools';
import React, { useEffect} from 'react';
import { PRODUCT_SLUG, SLUGS } from 'const/productsTypes';
import { PRODUCT_TYPES } from 'const/productsTypes';
import TEXT_MY_PRODUCTS from 'texts/my_products';
import { objectToBase64 } from "./converters";

export const isPoster = ( t ) => PRODUCT_SLUG[ t ] ? PRODUCT_SLUG[ t ].type === PRODUCT_TYPES.POSTER : false;
export const isPhoto = ( t ) => PRODUCT_SLUG[ t ] ? PRODUCT_SLUG[ t ].type === PRODUCT_TYPES.PHOTO : false;
export const isCanvas = ( t ) => PRODUCT_SLUG[ t ] ? PRODUCT_SLUG[ t ].type === PRODUCT_TYPES.CANVAS : false;
export const isCalendar = ( t ) => PRODUCT_SLUG[ t ] ? PRODUCT_SLUG[ t ].type === PRODUCT_TYPES.CALENDAR : false;
export const isPuzzle = ( t ) => PRODUCT_SLUG[ t ] ? PRODUCT_SLUG[ t ].type === PRODUCT_TYPES.PUZZLE : false;

export const getProductType = ( t ) => PRODUCT_SLUG[ t ] ? PRODUCT_SLUG[ t ].type : false;

export const productGetPrefix = ( t ) => {
    if (PRODUCT_SLUG[ t ]) {
        return PRODUCT_SLUG[ t ].prefix;
    } else {
        return 'A';
    }
};
export const productGetName = ( t ) => {
    if ( PRODUCT_SLUG[ t ] ) {
        return PRODUCT_SLUG[ t ].name;
    } else {
        return TEXT_MY_PRODUCTS.ALBUM;
    }
};
export const productGetId = ( slug ) => {
    if ( PRODUCT_SLUG[ slug ] ) {
        return PRODUCT_SLUG[ slug ].id;
    } else return '1';
};

const TEMP_OPTION_CATEGORIES = {
    'paper': 'Бумага',
    'canvas': 'Холст',
    'LAMINATION': 'Ламинация',
};

export const getOptionCategoryName = ( optionSlug, productSlug ) => {
    if (productSlug === SLUGS.POSTER_CANVAS && optionSlug === 'paper') return TEMP_OPTION_CATEGORIES['canvas'];
    return TEMP_OPTION_CATEGORIES[optionSlug] || optionSlug;
};


/**
 * Показать тостер с ошибкой и перезагрузить страницу
 */
const showChunkError = () => {
    toast.error("Ошибка получения раздела. Страница перезагрузится.", {
        autoClose: 3000
    });
    setTimeout( () => {
        //перезагружаем страницу без использования кеша
        document.location.reload( true );
    }, 3000 );
};

/**
 * Сравнение свойств объектов
 * @param a {Object}
 * @param b {Object}
 * @returns {boolean}
 */
const isEq = ( a, b ) => {
    // Create arrays of property names
    const aProps = Object.getOwnPropertyNames( a ),
        bProps = Object.getOwnPropertyNames( b );

    // If number of properties is different,
    // objects are not equivalent
    if ( aProps.length !== bProps.length ) return false;

    for ( let i = 0; i < aProps.length; i++ ) {
        const propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if ( a[propName] !== b[propName] ) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
};

/**
 * Сравнение объетов
 * @param a {Object}
 * @param b {Object}
 * @returns {boolean}
 */
const isSameObjects = ( a, b ) => {
    return JSON.stringify(a) === JSON.stringify(b);
};

/**
 *
 * @param name {String} - Изначальное название объекта
 * @param copy {String} - Приставка при копировании
 * @returns {string}
 */
const makeCopyName = ( name, copy ) => {
    const splitted = name.split( ' ' );

    if ( splitted[splitted.length - 1] === copy ) { // если "Название копия" (name = 'Название', copy = 'копия')
        return name + ' 2';                         // return "Название копия 2"
    } else {
        const copyNumber = parseFloat( splitted[splitted.length - 1] );
        if ( splitted.length > 1 && splitted[splitted.length - 2] === copy && copyNumber > 0 ) {
            splitted.pop();                                         // если "Название копия 2"
            return splitted.join( ' ' ) + ' ' + (copyNumber + 1);     // return "Название копия 3"

        } else {                                    // если "Название другое"
            return name + ' ' + copy;               // return "Название другое копия"
        }
    }
};

/**
 *  * Прокрутка страницы или html объекта в начало
 * @param scrollObj {Object=} - Прокручиваемый объект
 * @param scrollTo {Number=} - Куда скролить (Y-координата)
 * @param scrollDuration  {Number=} - Скорость
 */
const scrollToTop = ( { scrollObj = document.querySelector( '#spa' ), scrollTo = 0, scrollDuration = 300 } = {} ) => {
    // TODO: scrollTo работает не совсем корректно

    if ( !scrollObj.scrollTo ) return;

    if ( scrollDuration < 100 ) {
        scrollObj.scrollTo( 0, scrollTo );
    } else {
        let preventScroll = () => {};
        const scrollHeight = scrollObj.scrollTop - scrollTo;
        const scrollStep = Math.PI / (scrollDuration / 15),
            cosParameter = scrollHeight / 2,
            sign = scrollHeight < 0 ? -1 : 1;
        let scrollCount = 0,
            scrollMargin;

        const scrollInterval = setInterval( function () {
            if ( scrollObj.scrollTop !== scrollTo ) {
                scrollCount = scrollCount + 1;
                scrollMargin = (cosParameter - cosParameter * Math.round(Math.cos( scrollCount * scrollStep )*1000)/1000);
                if ( scrollMargin === 0 ) clearInterval( scrollInterval );
                if (scrollObj.scrollTo) scrollObj.scrollTo( 0, (scrollHeight + scrollTo - scrollMargin * sign) );
            }
            else {
                document.removeEventListener( 'wheel', preventScroll );
                document.removeEventListener( 'touchmove', preventScroll );
                clearInterval( scrollInterval );
            }
        }, 15 );

        preventScroll = () => {clearInterval( scrollInterval );};
        document.addEventListener('wheel', preventScroll, {passive: false}); // Disable scrolling in Chrome
        document.addEventListener('touchmove', preventScroll, { passive: false }); // Disable scrolling on mobile

    }
};

/**
 * Добавляет сторонний скрипт в DOM
 * @param src {String} - url скрипта
 * @param container {Object} - куда класть в DOM
 * @param async {boolean} - false/true
 */
const addScript = (  {src, async = true, container = document.body} = {}  ) => {
    if (process.env.server_render ) return null;

    if (!src) {
        console.log('ERROR! addScript() need src param');
        return null;
    }

    const script = document.createElement("script");

    script.src = src;
    script.async = async;
    container.appendChild(script);
    return script;
};

/**
 * перевод числа в денежное выражение
 * @param x
 * @returns {string}
 */
const numberToMoneyFormat = (x) => {
    if ( x < 0 ) x = 0;
    const n = Math.ceil(x);
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

/**
 * получаем продукт по обложке и переплету
 * @param products
 * @param coverType
 * @param bindingType
 * @returns {*}
 */
const findProductByCoverAndBindingType = ( { products, coverType, bindingType } ) => {
    if (products && products[0]){
        if ( coverType && bindingType ) {
            for ( let i = 0; i < products.length; i++ ) {
                if (products[i].bindingType === bindingType && products[i].coverType === coverType) {
                    return products[i]
                }
            }
        }
        return products[0];
    } else {
        console.log('ERROR! No products!');
        return null;
    }
};

/**
 * замена урла в табах
 * @param url
 * @param tab
 * @returns {*}
 */
const replaceTab = ( url, tab ) => url.replace( /:tab/, tab);


const isFunction = ( functionToCheck ) => functionToCheck && {}.toString.call( functionToCheck ) === '[object Function]';

/**
 * Многократная попытка запроса файлов lazy load React
 * @param fn
 * @param retriesLeft
 * @param interval
 * @returns {Promise<any>}
 */
/*
const retry = (fn, retriesLeft = 15, interval = 3000) => new Promise((resolve, reject) => {

    console.log('ЗАГРУЗКА МОДУЛЯ!!');

    fn()
        .then((result) => {
            console.log('ЗАГРУЗКА УСПЕХ!!', result);
            resolve(result);
        })
        .catch((error) => {

            console.log('ОШИБКО ЗАГРУЗКИ!!');
            setTimeout(() => {
                if (retriesLeft === 1) {
                    // reject('maximum retries exceeded');
                    reject(error);
                    return;
                }

                // Passing on "reject" is the important part
                retry(fn, retriesLeft - 1, interval).then(resolve, reject);
            }, interval);
        });
    }
);*/
/**
 * Повторение запроса чанка, при проблемах с его получением
 * @param fn<Promise> //import promise объект
 * @param retriesLeft //кол-во попыток соединения
 * @param interval    //интервалы между попытками в ms
 * @returns {Promise}
 */
function retry( fn, retriesLeft = 5, interval = 2000 ) {
    return new Promise( ( resolve, reject ) => {
        fn()
            .then( ( result ) => {
                resolve( result );
            } )
            .catch( ( error ) => {
                console.log( '-------------------------------------------' );
                console.log( 'Не можем загрузить модуль, пробуем еще раз.' );
                console.log( `Осталось попыток: ${retriesLeft}` );
                console.log( '-------------------------------------------' );
                setTimeout( () => {
                    if ( retriesLeft === 1 ) {
                        reject( error );
                        showChunkError(); //перезагрузка страницы
                        return;
                    }
                    retry( fn, retriesLeft - 1, interval ).then( resolve, reject );
                }, interval );
            } );
    } );
}

/**
 * Генерация уникального id
 * @returns {string}
 */
const generateUID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
                         .toString(16)
                         .substring(1);

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};

/**
 * Генерация простого уникального id
 * @returns {string}
 * @constructor
 */
const simpleID = () => [0,1,2].map(()=>Math.random().toString(36).substr(2, 9)).join('');

/**
 * Генерация уникального id
 */
const getMillisecondsDate = ( d ) => {
    const year = d.substr( 0, 4 ),
          month = d.substr( 5, 2 ),
          day = d.substr( 8, 2 ),
          h = d.substr( 11, 2 ),
          m = d.substr( 14, 2 ),
          s = d.substr( 17, 2 ),
          photoDate = new Date( [year, month, day].join( '/' ) + ' ' + [h, m, s].join( ':' ) );
    return photoDate.getTime();
};

/**
 * Получить позицию top элемента на экране (crossbrowser version)
 */
const getTop = ( elem ) => {
    if ( !elem ) return null;

    const box = elem.getBoundingClientRect();
    const body = document.body;
    const docEl = document.documentElement;

    const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    const clientTop = docEl.clientTop || body.clientTop || 0;

    return box.top + scrollTop - clientTop;
};


/**
 * функция склонения слов от числа
 *
 * @param number {Number}
 * @param titles {Array}
 * @returns {string, *}
 */
const declOfNum = (number, titles) => {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
};
/**
 * Hex to RGBA
 *
 * @param hex {String}
 * @param alpha {Number=}
 * @returns {string}
 */
const hexToRgbA = (hex, alpha) => {
    let c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return `rgba(${[(c>>16)&255, (c>>8)&255, c&255].join(',')}, ${alpha || 1})`;
    }
    throw new Error('Bad Hex');
};
/**
 * arrayToObject
 *
 * @param array {Array}
 * @param keyField {String=}
 * @returns {obj}
 */
const arrayToObject = (array, keyField = "id") =>
    array.reduce((obj, item) => {
        obj[item[keyField]] = item;
        return obj
    }, {});

/**
 * Выбор в галерее
 * itemId {string} - id выбранного элемента списка
 * sourceList {array} - список библиотеки
 * shiftKey {boolean} - true, если выбор с шифтом
 * maxSelectCount {number} - ограничитель максимального количества выбора
 * lastSelected {string} - предыдущий выбранный элемент(id) - начало для выделения с шифтом
 * selectAll {boolean} - выбрать все
 * deselectAll {boolean} - снять выделение
 */
const selectLibraryItem = ({itemId, sourceList, shiftKey, maxSelectCount, lastSelected, selectAll, deselectAll}) => {
    //TODO оптимизировать
    let itemsArray = JSON.parse(JSON.stringify(sourceList));
    // console.log('IN',{itemId: itemId, sourceList: sourceList, shiftKey: shiftKey, maxSelectCount: maxSelectCount, lastSelected: lastSelected});

    if (selectAll) {
        return({
            list: itemsArray.map( (item)=> ({...item, selected: !deselectAll}) ),
            selectedCount: itemsArray.length,
            lastSelected: null
        });
    }
    if (maxSelectCount === 1) {
        return({
            list: itemsArray.map((item)=>({...item, selected: item.selected ? false : itemId === (item.photoId || item.id)})),
            selectedCount: 1,
            lastSelected: itemId
        });
    }
    if ( shiftKey && lastSelected && lastSelected !== itemId ) {
        let start = null, end = null;
        for ( let i=0; i < itemsArray.length; i++ ) {
            const id = itemsArray[i].photoId || itemsArray[i].id;

            if (id === lastSelected ) {
                start = i;
            } else if (id === itemId ) {
                end = i;
            }

            if ( start !== null && end !== null ) {
                if (end < start) {
                    [end, start] = [start, end];
                }
                if (end > (start + maxSelectCount)) end = start + maxSelectCount - 1;
                for (let i=0; i < itemsArray.length; i++) {
                    itemsArray[i].selected = (i >= start && i <= end);
                }
                break;
            }
        }
    } else {
        for (let i=0; i < itemsArray.length; i++) {
            const id = itemsArray[i].photoId || itemsArray[i].id;
            if (id === itemId){
                itemsArray[i].selected = !itemsArray[i].selected;
                lastSelected = itemId;
                break;
            }
        }
    }
    const selectedCount = itemsArray && itemsArray.filter((item)=>item.selected).length;
    if (!maxSelectCount || selectedCount <= maxSelectCount) {
        return({
            list: itemsArray,
            selectedCount: selectedCount,
            lastSelected: lastSelected
        });
    }
};


const checkStateDifference = (item1, item2, callback) => {
    if (isSameObjects(item1, item2)) {
        callback && callback();
        return true;
    } else {
        toast.warn('Сохраните или отмените изменения!', {
            autoClose: 3000
        });
        return false;
    }
};

// прослушка клика вне компонента
const clickOutsideListener = (ref, disableNav = true ) => {
    if (!window.spaDOM) window.spaDOM = document.getElementById('spa');

    const handleClickOutside = (event) => {
        if (disableNav) {
            if ( ref.current && !ref.current.contains(event.target) && window.spaDOM.contains(event.target) ) {
                event.preventDefault();
                event.stopPropagation();
                toast.warn('Сохраните или отмените изменения!', {
                    autoClose: 3000
                });
            }
        }
    };

    useEffect(() => {
        // Bind the event listener
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("click", handleClickOutside, true);
        };
    });
};

const arrayMoveMutate = (array, from, to) => {
    const startIndex = to < 0 ? array.length + to : to;
    const item = array.splice(from, 1)[0];
    array.splice(startIndex, 0, item);
};

const arrayMove = (array, from, to, sortIndexName) => {
    array = array.slice();
    arrayMoveMutate(array, from, to);
    return sortIndexName ? array.map((f, i)=> ({...f, [sortIndexName]: i})) : array;
};

const paragrafyText = (textArray) => {
    return textArray.map((item, i)=><p key={i}>{item}</p>);
};

const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = [].slice.call(new Uint8Array(buffer));

        bytes.forEach((b) => binary += String.fromCharCode(b));

        return window.btoa(binary);
};

/**
 * создаем ссылку на галлерею с передачей параметров в виде Base64 строки
 * @param fastLink
 * @returns {string}
 */
const createGalleryShortLink = ( fastLink ) => {
    let location = window.location.href;
    let last = location.substr( -1 );

    if (last === '/') {
        location =  location.substr(0,location.length-1);
        last = location.substr( -1 );
    }

    if ( isNaN( parseInt( last ) ) ) {
        location = location + '/0' ;
    }
    return location + '/' + objectToBase64(fastLink)
};

/**
 * Копируем текст в буфер
 * @param text
 */
const copyToClipboard = ( text ) => {
    const textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
};

export {
    isEq,
    isSameObjects,
    makeCopyName,
    scrollToTop,
    addScript,
    numberToMoneyFormat,
    findProductByCoverAndBindingType,
    replaceTab,
    isFunction,
    retry,
    generateUID,
    simpleID,
    getMillisecondsDate,
    getTop,
    declOfNum,
    hexToRgbA,
    selectLibraryItem,
    arrayToObject,
    checkStateDifference,
    clickOutsideListener,
    arrayMove,
    arrayBufferToBase64,
    paragrafyText,
    createGalleryShortLink,
    copyToClipboard
}
