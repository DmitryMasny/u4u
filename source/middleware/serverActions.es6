import { apiList } from 'server/apiList';
import { rest } from 'server/rest';
import { userTokenSelector } from 'selectors/user';

const serverActions = store => next => action => {

    //проверяем наличие типа экшена в объекте api,
    //если находится, значит асинхронная задача
    //console.log('action.type', action.type);
    if (!action) return null;

    if ( apiList[action.type] ) {

        //console.log(' action.type ', action.type);
        //console.log(' apiList[action.type] ', apiList[action.type]);

        let apiData = {...apiList[action.type]};

        //вызываем соответствующий адаптер
        if (action.payload && apiData.adapter && (Array.isArray(action.payload) || typeof action.payload === 'object')) {
            apiData.payload = (apiData.adapter.to || apiData.adapter).toApi(action.payload);
        } else {
            apiData.payload = action.payload;
        }

        //console.log('apiData', apiData);

        //получим текущий токен из state
        const state = store.getState();
        const token = userTokenSelector( state ) || null;

        //мержим методы обработки состояний
        if (apiData.payload.actions) {
            apiData.actions = {
                ...apiData.actions, ...apiData.payload.actions
            };
            delete(apiData.payload.actions);
        }

        //мержим urlParams (паратер побавляющий смвойства в URL)
        if (apiData.payload.urlParams) {
            apiData.urlParams = apiData.payload.urlParams;

            delete(apiData.payload.urlParams);
        } else if (apiData.payload.urlParams === null) {
            delete(apiData.payload.urlParams);
            apiData.urlParams && delete(apiData.urlParams);
        }

        //обработка замены урла
        if (apiData.payload.url) {
            apiData.url = apiData.payload.url;
            delete(apiData.payload.url);
        }

        //передача в метод по работе с restFull
        rest( apiData, store.dispatch, token );

        return next( action );
    }

    //пробрасываем акшен дальше
    return next( action )
};

export default serverActions;
