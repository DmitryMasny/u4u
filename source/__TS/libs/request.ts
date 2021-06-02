// @ts-ignore
import axios from 'axios';
// @ts-ignore
import { useSelector } from "react-redux";
// @ts-ignore
import camelcaseKeysDeep from 'camelcase-keys-deep';
// @ts-ignore
import { PRODUCTION_DOMAIN } from 'config/main';
// @ts-ignore
import { toast } from '__TS/libs/tools';
// @ts-ignore
import { LOCAL_STORAGE_NAME } from 'config/main';
// @ts-ignore
import { userTokenSelector } from 'selectors/user';
// @ts-ignore
import { store } from "components/App";


// формируем запрос
export const restRequest = ( apiData ) => {
    //console.log('===restRequest===');
    //получим текущий токен из state
    const state = store.getState();
    const token = userTokenSelector( state ) || null;

    //console.log('token1',token);
    //подмешиваем header из api list
    let headers = { 'authorization': 'Bearer ' + token };
    // if ( apiData.headers ) headers = { ...headers, ...apiData.headers };

    const requestResponseHandle = ( response ) => {
        apiData.callback(response);
    };
    const requestErrorHandle = ( error ) => {
        console.log('requestErrorHandle',error);
    };

    /**
     * Создать REST запрос
     */
    const makeRequest = (paramsData) => {
        // console.log('makeRequest paramsData',paramsData);

        axios({
            headers,
            failRetry: 5,
            failRetryInterval: 1000,
            method: apiData.method,
            url: apiData.url,
            onUploadProgress: (progress) => apiData.payload.onUploadProgress && apiData.payload.onUploadProgress(progress.loaded ? Math.round(progress.loaded / progress.total * 100) : null),
            ...paramsData
        })
            //запрос выполнен удачно
            .then(response => {
                requestResponseHandle(camelcaseKeysDeep(response));
            })
            //ошибка
            .catch(error => {
                requestErrorHandle(error);
            });
    };


    let paramsData:any = {};

    //собираем параметры запроса либо в url для GET, либо в объект для post запроса, либо graphQL
    switch ( apiData.method ) {
        case 'GET':
            makeRequest( { params: apiData.payload || {} } );
            break;
        default:
            paramsData = apiData.payload || {};
            //console.log('paramsData!!!',paramsData);
            //если есть параметр files и он массив, то создадим форму с добавлением в нее файлов
            if ( paramsData.files && Array.isArray( paramsData.files ) ) {
                let form = new FormData();
                for ( let file of paramsData.files ) {
                    form.append( apiData.imageName || "files", file );
                }
                //delete(paramsData.imagesFiles);
                paramsData = form;
            }
            //если есть параметр file, то создадим форму с добавлением в нее файлов
            if ( paramsData.file ) {
                let form = new FormData();
                // form.append( "file", paramsData.file, paramsData.file.name );
                form.append( "file", paramsData.file );
                if ( paramsData.packId ) form.append( "sticker_set_id", paramsData.packId );
                if ( paramsData.themeId ) form.append( "theme_id", paramsData.themeId );
                if ( paramsData.backgroundSetId ) form.append( "background_set_id", paramsData.backgroundSetId );
                paramsData = form;
            }
            makeRequest( {data: paramsData} );
            break;
    }


};


/** Загрузить стикер на сервер */
export const uploadStickerAction = ({packId, themeId, file, uploadCallback}) => {
    restRequest({
        method: 'POST',
        url: '/api/sticker/upload/',
        payload: {
            packId: packId,
            themeId: themeId,
            file: file,
        },
        callback: uploadCallback
    })
};


/** Загрузить фон на сервер */
export const uploadBackgroundAction = ({packId= null, backgroundSetId= null, themeId = null, file, uploadCallback}) => {
    restRequest({
        method: 'POST',
        url: '/api/background/upload/',
        payload: {
            packId: packId,
            themeId: themeId,
            backgroundSetId: backgroundSetId,
            file: file,
        },
        callback: uploadCallback
    })
};
