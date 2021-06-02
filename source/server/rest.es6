import axios from 'axios';
//import axiosRetry from 'axios-retry';
import fake from 'server/fake'; //режим эмуляции ответов сервера
import camelcaseKeysDeep from 'camelcase-keys-deep';
import { PRODUCTION_DOMAIN } from 'config/main';
//import { logs }  from 'libs/logs';

import { toast } from '__TS/libs/tools';

import { LOCAL_STORAGE_NAME } from 'config/main';
// import { graphQL } from "./graphql";

const dispatchActions = ( dispatch, actions ) => {

    //console.log('actions', actions);
    if ( Array.isArray( actions ) ) {
        actions.map( ( action ) => dispatch( action ) );
    } else {
        dispatch( actions )
    }
};

// формируем запрос
export const rest = ( apiData, dispatch, token ) => {

    if ( process.env.server_render ) return null;

    //axiosRetry(axios, {retries: 3});

    //если запрос фейковый, используем фейковую библиотеку
    const req = (apiData.fake ? fake : axios);
    //console.log('apiData', JSON.stringify(apiData));

    //запускаем метод inProgress, если он есть
    if ( typeof apiData.actions.inProgress === 'function' ) {
        dispatchActions( dispatch, apiData.actions.inProgress( { dispatch: dispatch } ) );
    }

    //если есть параметры для URL, то формируем дополнение к URL
    let urlParams = apiData.urlParams && apiData.urlParams.join( '/' ) + '/' || "";

    //удаляем последний "/" если на конце строки специальный символ
    if ( urlParams.slice( -2 ) === '</' ) urlParams = urlParams.slice( 0, -2 );

    //подмешиваем header из api list
    let headers = { 'authorization': 'Bearer ' + token };
    if ( apiData.headers ) headers = { ...headers, ...apiData.headers };

    const requestResponseHandle = ( response ) => {
        //обрабатываем адаптером, если нужно
        if ( apiData.adapter && (Array.isArray( response.data ) || typeof response.data === 'object') ) {
            response.data = (apiData.adapter.from || apiData.adapter).fromApi( response.data );
        }

        if ( typeof apiData.actions.inSuccess === 'function' ) {
            dispatchActions( dispatch, apiData.actions.inSuccess( {
                                                                      request: apiData.payload || null,
                                                                      response: response.data,
                                                                      dispatch: dispatch
                                                                  } ) );
        }
    };
    const requestErrorHandle = ( error ) => {
        console.log( 'error', error );
        //если ответ от сервера с 401 или 403, с телом No credentials found for given 'iss', то удаляем все данные токена и перезагружаем страницу
        if ( !window.toReload && error.response && (error.response.status === 401 || (error.response.status === 403 && error.response.data.message === "No credentials found for given 'iss'")) ) {
            window.toReload = true;
            localStorage.removeItem( LOCAL_STORAGE_NAME );
            window.location.reload();
        }

        //console.log('ОШИБКО');
        if ( apiData.url === '/auth/restorepwd/' ) {
            //return;
        }

        if ( error.message === 'Network Error' ) {
            toast.error( 'Ошибка соединения с сервером', {
                autoClose: 3000
            } );
            dispatchActions( dispatch, apiData.actions.inFail( { dispatch: dispatch } ) );
            return;
        }

        dispatchActions( dispatch, apiData.actions.inFail( {
                                                               error: error,
                                                               request: apiData.payload,
                                                               code: error.response && error.response.status || null,
                                                               response: error.response || null,
                                                               dispatch: dispatch
                                                           } ) );
    };

    /**
     * Создать REST запрос
     */
    const makeRequest = ( paramsData ) => {
        let url = apiData.payload.url ? apiData.payload.url : (apiData.url + urlParams);

        //если есть другой url для прода
        if ( apiData.urlForProduction && window.location.hostname === PRODUCTION_DOMAIN ) {
            url = location.protocol + '//' + apiData.urlForProduction;
        };

        req( {
                 method: apiData.method,
                 url,
                 headers,
                 onUploadProgress: ( progress ) => apiData.payload.onUploadProgress && apiData.payload.onUploadProgress( progress.loaded ? Math.round( progress.loaded / progress.total * 100 ) : null ),
                 ...paramsData
             } )
            //запрос выполнен удачно
            .then( response => {
                const data = response.data;
                if ( data.layouts ) {
                    data.layouts = data.layouts.map( r => {
                        delete (r[ '_id' ]);
                        return r;
                    })
                }
                if ( data[ '_id' ] ) delete (data[ '_id' ]);

                //console.log('ДАННЫЕ', data);

                requestResponseHandle( camelcaseKeysDeep( response ) );
            } )
            //ошибка запроса
            .catch( error => {
                requestErrorHandle( error );
            } );
    };


    let paramsData = {};

    //собираем параметры запроса либо в url для GET, либо в объект для post запроса, либо graphQL
    switch ( apiData.method ) {
        case 'GET':
            makeRequest( { params: apiData.payload || {} } );
            break;
        default:
            paramsData.data = apiData.payload || {};
            //если есть параметр files и он массив, то создадим форму с добавлением в нее файлов
            if ( paramsData.data.files && Array.isArray( paramsData.data.files ) ) {
                let form = new FormData();
                for ( let file of paramsData.data.files ) {
                    form.append( apiData.imageName || "files", file );
                }
                //delete(paramsData.data.imagesFiles);
                paramsData.data = form;
            }
            //если есть параметр file, то создадим форму с добавлением в нее файлов
            if ( paramsData.data.file ) {
                let form = new FormData();
                // form.append( "file", paramsData.data.file, paramsData.data.file.name );
                form.append( "file", paramsData.data.file );
                if (paramsData.data.packId) form.append( "sticker_set_id", paramsData.data.packId );
                paramsData.data = form;
            }
            makeRequest( paramsData );
            break;
    }


};
