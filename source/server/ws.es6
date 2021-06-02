import { generateUID } from "libs/helpers";
//import snakeCaseKeys from 'snakecase-keys';
import decamelizeKeysDeep from 'decamelize-keys-deep';
import camelcaseKeysDeep from 'camelcase-keys-deep';
import { keysToCamel } from '__TS/libs/converters';

import { THEME_PRODUCT_GROUP } from 'const/productsTypes';


//убираем лишние данные
const removeLayoutDataForSendToServer = ( data ) => {
    //копируем объект
    const layoutCopy = JSON.parse( JSON.stringify( data ) );

    //удаляем не нужные на сервере данные
    delete (layoutCopy.counter);

    //удаляем все лишнее из pages, что не нужно отправлять на сервер
    Object.keys( layoutCopy.pages ).map( key => {
        const block = layoutCopy.pages[ key ];
        delete (block.pageId);
        layoutCopy.pages[ key ] = block;
    } );

    //удаляем все лишнее из blocks, что не нужно отправлять на сервер
    Object.keys( layoutCopy.blocks ).map( ( key ) => {
        const block = layoutCopy.blocks[ key ];
        delete (block.pageX);
        delete (block.pageY);
        delete (block.pageW);
        delete (block.pageH);
        delete (block.pageId);
        layoutCopy.blocks[ key ] = block;
    } );
    return layoutCopy;
};


/**
 Реализация WS
 */

//выбираем протокол WS в зависимости от протокола http
const protocol = (window && window.location && window.location.protocol === 'https:' ? 'wss' : 'ws');
const host = location.hostname;

const url = `${protocol}://${host}/api/ua/product/ws?jwt=`;

const wsObj = (() => {
    let ws = null,
        queue = [],
        callBacksList = {},
        isConnected = false;

    //послать данные из очереди
    const sendQueue = () => {

        if ( !queue.length ) return;

        const { objectType, action, payload, callback, error } = queue.shift(),
            id = generateUID();

        ws.send( JSON.stringify( {
                                     object_type: objectType,
                                     action: action,
                                     transaction_id: id,
                                     request_data: decamelizeKeysDeep( payload )
                                 } ) );

        if ( callback || error ) callBacksList[ id ] = {
            callback: callback,
            error: error
        };
        sendQueue();
    };

    //добавить в очередь
    const addToQueue = ( data ) => {
        queue.push( data );
        if ( isConnected ) sendQueue();
    };

    //запускаем сокет
    const start = ( jwt ) => {
        ws = new WebSocket( url + jwt );
        ws.onopen = () => {
            isConnected = true;
            sendQueue();
        };
        ws.onclose = () => {
            isConnected = false;
            start( jwt );
        };
        ws.onmessage = ( event ) => {
            if ( event.data ) {
                try {
                    const parseResult = JSON.parse( event.data );

                    //если ошибка, завершаем
                    if ( parseResult.error ) {
                        const trId = parseResult.transaction_id;
                        if ( trId ) {
                            callbackError( trId, parseResult.error );
                        }
                        console.error( 'WS error', parseResult.error );
                        return;
                    }

                    if ( parseResult.response_data && parseResult.response_data.data ) {
                        const data = parseResult.response_data.data,
                            trId = parseResult.transaction_id;

                        //если есть transaction_id, смотрим в callbacks
                        if ( trId && callBacksList[ trId ] ) {
                            if ( data ) {
                                if ( typeof callBacksList[ trId ].callback === 'function' ) {
                                    callBacksList[ trId ].callback( keysToCamel( data ) );
                                    delete (callBacksList[ trId ]);
                                }
                            } else {
                                callbackError( trId );
                            }
                        }
                    }
                } catch ( err ) {
                    console.error( 'WS data parse error' );
                }
            }
        }
    };

    const reconnect = ( jwt ) => {
        isConnected = false;
        if ( ws ) {
            ws.onclose = () => {
                console.log( 'queue', queue );
                start( jwt );
            };
            ws.close();
            console.log( 'update reconnect WS' );
        } else {
            console.log( 'new reconnect WS' );
            start( jwt );
        }
    };

    const callbackError = ( tId, error = null ) => {
        if ( callBacksList[ tId ] && typeof callBacksList[ tId ].error === 'function' ) {
            callBacksList[ tId ].error( error );
            delete (callBacksList[ tId ]);
        }
    };

    //handler послать
    const send = ( data ) => {
        addToQueue( data );
    };

    //обновляем список фотографий для layout
    /*
    const updateLayoutPhotos = ( { layoutId, photos } ) => new Promise( ( resolve, reject ) => {

        const photosIds = photos.map( photo => photo.photoId );

        send( { objectType: 'poster',
                  action: 'add_photos',
                  callback: resolve,
                  error: reject,
                  payload: {
                      layoutId : layoutId,
                      photoIdList: photosIds
                  }
              });
    });*/

    //создание Layout постера
    const createLayoutPoster = ( data, preview ) => new Promise( ( resolve, reject ) => {
        // console.log('createLayoutPoster data',data);
        const dataToSend = removeLayoutDataForSendToServer( data );

        dataToSend.preview = preview[0] || '';
        dataToSend.previewList = preview;

        send( {
                  objectType: 'poster',
                  action: 'create',
                  callback: resolve,
                  error: reject,
                  payload: {
                      layoutData: dataToSend
                  }
              } );
    } );

    //создание Layout постера из темы
    const createProductLayoutFromTheme = ( data, preview, themeId ) => new Promise( ( resolve, reject ) => {
        const dataToSend = removeLayoutDataForSendToServer( data );

        const prev = [];
        prev.push( preview );

        dataToSend.previewList = prev;
        send( {
                  objectType: 'poster',
                  action: 'create',
                  callback: resolve,
                  error: reject,
                  payload: {
                      layoutData: dataToSend,
                      themeData: {
                          theme_id: themeId
                      },
                  }
              } );
    } );

    //получение Layout постера
    const getLayoutPoster = ( id ) => new Promise( ( resolve, reject ) => {
        send( {
                  objectType: 'poster',
                  action: 'get',
                  callback: resolve,
                  error: reject,
                  payload: { layoutId: id }
              } );
    } );

    //получение Layout продукта
    const getProductLayout = ( id, isThemeLayout = false, relatedObjects = null ) => new Promise( ( resolve, reject ) => {
        send( {
                  objectType: isThemeLayout ? 'poster_theme' : 'poster',
                  action: 'get',
                  callback: resolve,
                  error: reject,
                  payload: {
                      layoutId: id,
                      relatedObjects: relatedObjects || [
                          "photos",
                          "stickers",
                          "backgrounds",
                      ]
                  }
              } );
    } );

    //создание формата темы
    const createThemeLayout = ( { themeId, layout, preview } ) => new Promise( ( resolve, reject ) => {
        const dataToSend = removeLayoutDataForSendToServer( layout );
        dataToSend.preview = preview[ 0 ] || '';
        dataToSend.previewList = preview;

        send( {
                  objectType: 'poster_theme',
                  action: 'create',
                  callback: resolve,
                  error: reject,
                  payload: {
                      themeData: {
                          theme_id: themeId
                      },
                      layoutData: dataToSend
                  }
              } );
    } );

    // обновить формат темы
    const updateThemeLayout = ( data, preview ) => new Promise( ( resolve, reject ) => {
        const dataToSend = removeLayoutDataForSendToServer( data );
        dataToSend.preview = preview[ 0 ] || '';
        dataToSend.previewList = preview;
        send( {
                  objectType: 'poster_theme',
                  action: 'update',
                  callback: resolve,
                  error: reject,
                  payload: {
                      layoutId: dataToSend.id,
                      layoutData: dataToSend,
                      relatedObjects: ["photos", "stickers", "backgrounds"]
                  }
              } );
    } );
    // заменить формат темы
    const replaceThemeLayout = ( data, preview ) => new Promise( ( resolve, reject ) => {
        const dataToSend = removeLayoutDataForSendToServer( data );
        dataToSend.preview = preview[ 0 ] || '';
        dataToSend.previewList = preview;
        send( {
                  objectType: 'poster_theme',
                  action: 'replace',
                  callback: resolve,
                  error: reject,
                  payload: {
                      layoutId: dataToSend.id,
                      layoutData: dataToSend,
                      themeData: {
                          theme_id: data.themeId
                      },
                      // relatedObjects: ["photos", "stickers", "backgrounds"]
                  }
              } );
    } );

    //обновление Layout постера TODO: NEW USE ON TYPESCRIPT!
    const updateProductLayout = ( data, preview ) => new Promise( ( resolve, reject ) => {
        const dataToSend = removeLayoutDataForSendToServer( data );

        dataToSend.preview = preview[ 0 ] || '';
        dataToSend.previewList = preview;
        send( {
                  objectType: 'poster',
                  action: 'update',
                  callback: resolve,
                  error: reject,
                  payload: {
                      layoutId: dataToSend.id,
                      layoutData: dataToSend,
                      relatedObjects: [
                          "photos"
                      ]
                  }
              } );
    } );


    //обновление Layout постера
    const updateLayoutPoster = ( data, preview ) => new Promise( ( resolve, reject ) => {
        const dataToSend = removeLayoutDataForSendToServer( data );
        dataToSend.preview = preview[ 0 ] || '';
        dataToSend.previewList = preview;
        send( {
                  objectType: 'poster',
                  action: 'update',
                  callback: resolve,
                  error: reject,
                  payload: {
                      layout_id: dataToSend.id,
                      layout_data: dataToSend
                  }
              } );
    } );

    //формирование заказа
    const setLayoutPosterToOrder = ( layoutId, svgPdfArray ) => new Promise( ( resolve, reject ) => {
        send( {
                  objectType: 'poster',
                  action: 'add_to_cart',
                  callback: resolve,
                  error: reject,
                  payload: {
                      layoutId: layoutId,
                      data: {
                          body: svgPdfArray
                      }
                  }
              } );
    } );

    //формирование заказа
    const getPosters = () => new Promise( ( resolve, reject ) => {
        send( {
                  objectType: 'poster',
                  action: 'list',
                  callback: resolve,
                  error: reject,
              } );
    } );

    //формирование заказа
    const deletePoster = ( layoutId ) => new Promise( ( resolve, reject ) => {
        send( {
                  objectType: 'poster',
                  action: 'delete',
                  callback: resolve,
                  error: reject,
                  payload: {
                      layoutId: layoutId
                  }
              } );
    } );

    //формирование заказа
    const restorePoster = ( layoutId ) => new Promise( ( resolve, reject ) => {
        send( {
                  objectType: 'poster',
                  action: 'restore',
                  callback: resolve,
                  error: reject,
                  payload: {
                      layoutId: layoutId
                  }
              } );
    } );

    //формирование заказа
    const clonePoster = ( layoutId ) => new Promise( ( resolve, reject ) => {
        send( {
                  objectType: 'poster',
                  action: 'clone',
                  callback: resolve,
                  error: reject,
                  payload: {
                      layoutId: layoutId
                  }
              } );
    } );

    //переименование продукта
    const renameProduct = ( layoutId, name ) => new Promise( ( resolve, reject ) => {
        send( {
                  objectType: 'poster',
                  action: 'rename',
                  callback: resolve,
                  error: reject,
                  payload: {
                      layoutId: layoutId,
                      newLayoutName: name.toString()
                  }
              } );
    } );

    //обновление layout продукта на сервере по product_group_slug
    const updateProductLayoutByProductGroupSlug = ( layout, preview ) => new Promise( ( resolve, reject ) => {

        switch ( layout.productGroupSlug ) {
            case THEME_PRODUCT_GROUP.DECOR:
                updateThemeLayout( layout, preview ).then( data => resolve( data ) ).catch( err => reject( err ) );
                break;
            default:
                updateProductLayout( layout, preview ).then( data => resolve( data ) ).catch( err => reject( err ) );
        }

    } );

    return {
        start: start,
        reconnect: reconnect,
        send: send,
        createLayoutPoster: createLayoutPoster,
        getProductLayout: getProductLayout,
        createThemeLayout: createThemeLayout,
        updateThemeLayout: updateThemeLayout,
        replaceThemeLayout: replaceThemeLayout,
        createProductLayoutFromTheme: createProductLayoutFromTheme,
        getLayoutPoster: getLayoutPoster,
        updateLayoutPoster: updateLayoutPoster,
        setLayoutPosterToOrder: setLayoutPosterToOrder,
        getPosters: getPosters,
        deletePoster: deletePoster,
        restorePoster: restorePoster,
        clonePoster: clonePoster,
        renameProduct: renameProduct,
        updateProductLayout: updateProductLayout,
        updateProductLayoutByProductGroupSlug: updateProductLayoutByProductGroupSlug
    };
})();


export default wsObj;