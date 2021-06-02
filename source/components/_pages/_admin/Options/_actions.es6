
import { store } from "components/App";
import {
    PRODUCT_PUT_OPTIONS,
    PRODUCT_PUT_OPTIONS_TYPES,
    PRODUCT_UPDATE_OPTION_PARAMS,
    PRODUCT_PUT_OPTION_CATEGORIES,
} from "const/actionTypes";

import {getAllOptionsAdapter, getAllOptionTypesAdapter} from 'server/adapters/posters';
import {graphQL} from "server/graphql";
import { toast } from '__TS/libs/tools';

//получаем диспетчер Redux
const dispatch = store.dispatch;

/**
 * получить все опции с сервера
 */
export const getAllOptionsAction = () => {

    let allOptsResponse = null, allCatsResponse = null;
    // Функция проверяющая ответы по двум запросам, обновляет state когда оба ответа получены
    const updateAllOptions = () => {
        if (allOptsResponse && allCatsResponse){
            if (allOptsResponse.error){
                console.log('ОШИБКА получения всех опций', allOptsResponse.error);
            } else {
                dispatch({
                    type: PRODUCT_PUT_OPTIONS,
                    payload: allOptsResponse
                })
            }
            if (allCatsResponse.error){
                console.log('ОШИБКА получения всех категорий опций', allCatsResponse.error);
            } else {
                dispatch({
                    type: PRODUCT_PUT_OPTION_CATEGORIES,
                    payload: allCatsResponse
                })
            }
        }
    };

    //получить все категории опций с сервера
    graphQL.get({
        data: `
            allOptions: getAllPosterOptionCategory {
                id
                name
                description
                sort: sort_order
            }`
    })
        .then((response) => {
            allCatsResponse = response && response.allOptions.sort((a, b) => a.sort - b.sort);
            updateAllOptions();
        })
        .catch((err) => {
            allCatsResponse = {error: err};
            console.log('ОШИБКА', err);
        });

    //получить все опции с сервера
    graphQL.get({
        adapter: getAllOptionsAdapter,
        data: `
            allOptions: getAllPosterOption {
                id
                name
                description
                technical_description
                option_slug
                type
                optionCategory: option_category {
                  id
                  name
                  description
                  sort: sort_order
                }
            }`
    })
        .then((response) => {
            allOptsResponse = response;
            updateAllOptions();
        })
        .catch((err) => {
            allOptsResponse = {error: err};
            console.log('ОШИБКА', err);
        });
};

/**
 * получить список всех типов параметров опции
 */
export const getAllOptionTypesAction = ({dispatch}) => {
    graphQL.get({
        adapter: getAllOptionTypesAdapter,
        data: `
        __type(name:"OptionOptionSlug"){
        name
        enumValues{
            name
            description
        }
    }`
    })
    .then((response) => {
        dispatch({
            type: PRODUCT_PUT_OPTIONS_TYPES,
            payload: response || []
        })
    })
    .catch((err) => {
        console.log('ОШИБКА', err);
    });
};


/**
 * Создание опции
 */
export const createProductOption = ({dispatch}, data, errorCallback) => {
    graphQL.set({
        data: `
            createPosterOptionCategory(
                input: {
                  name: "${data.name || ''}",
                  description: "${data.description || ''}",
                  sort_order: ${data.sort || 0},
                }
            ){
                option_category {
                    id
                }
                errors {
                    field
                    messages
                }
            }
        `
    })
        .then((response) => {
            console.log('response', response);
            let errorData = [], successData = [];

            // Проверяем ответ и собираем ошибки и данные успешного ответа
            Object.values(response).map((r, i)=>{

                if (r.errors && r.errors.length){
                    errorData[i] = {
                        id: r.clientMutationId,
                    };
                    r.errors.map((err)=>{
                        if (err) errorData[i][err.field] = err.messages[0];
                    })
                }
                if (r.option_category) successData[i] = r.option_category;
            });
            errorData = errorData.filter((item)=> item);
            successData = successData.filter((item)=> item);

            // Если есть ошибки
            if (errorData.length) {
                errorCallback && errorCallback(errorData);
                toast.error('Ошибка валидации на сервере', {
                    autoClose: 4000
                });
            }

            // Если есть успешный ответ
            if (!errorData.length && successData.length) {
                dispatch({
                    type: PRODUCT_PUT_OPTIONS,
                    payload: null
                });
                toast.success('Опция успешно создана', {
                    autoClose: 3000
                });
            }

        })
        .catch((err) => {
            console.log('ОШИБКА', err.response);
            toast.error('Ошибка обновления параметра опции', {
                autoClose: 3000
            });
        });
};

/**
 * Удаление опции
 */
export const deleteProductOption = ({dispatch}, id, errorCallback) => {
    graphQL.set({
        data: `
            deletePosterOptionCategory(
                input: {
                  id: "${id || ''}",
                }
            ){
                ok
                errors {
                    field
                    messages
                }
            }
        `
    })
        .then((response) => {
            dispatch({
                type: PRODUCT_PUT_OPTIONS,
                payload: null
            });
            toast.success('Опция удалена', {
                autoClose: 3000
            });
        })
        .catch((err) => {
            console.log('ОШИБКА', err.response);
            toast.error('Ошибка обновления параметра опции', {
                autoClose: 3000
            });
        });
};

/**
 * Изменение опции
 */
export const updateProductOption = ({dispatch}, data, errorCallback) => {
    console.log('updateProductOption data ',data);
    let sendData = '';
    data.map((item, i)=>{
        if (item) sendData += `
            updatePosterOptionCategory_${i}: updatePosterOptionCategory(
                input: {
                  id: "${item.id}"
                  clientMutationId: "${item.id}"
                  name: "${item.name || ''}",
                  description: "${item.description || ''}",
                  sort_order: ${item.sort || 0},
                }
            ){
                clientMutationId
                option_category {
                    id
                }
                errors {
                    field
                    messages
                }
            }
        `;
    });

    graphQL.set({
        // adapter: getAllOptionsAdapter,
        data: sendData
    })
        .then((response) => {
            console.log('response', response);
            let errorData = [], successData = [];

            // Проверяем ответ и собираем ошибки и данные успешного ответа
            Object.values(response).map((r, i)=>{

                if (r.errors && r.errors.length){
                    errorData[i] = {
                        id: r.clientMutationId,
                    };
                    r.errors.map((err)=>{
                        if (err) errorData[i][err.field] = err.messages[0];
                    })
                }
                if (r.option_category) successData[i] = r.option_category;
            });
            errorData = errorData.filter((item)=> item);
            successData = successData.filter((item)=> item);

            // Если есть ошибки
            if (errorData.length) {
                errorCallback && errorCallback(errorData);
                toast.error('Ошибка валидации на сервере', {
                    autoClose: 4000
                });
            }

            // Если есть успешный ответ
            if (!errorData.length && successData.length) {
                dispatch({
                    type: PRODUCT_PUT_OPTIONS,
                    payload: null
                });
                toast.success(successData.length > 1 ? 'Параметры опции успешно обновлены' : 'Параметр опции успешно обновлен', {
                    autoClose: 3000
                });
            }

        })
        .catch((err) => {
            console.log('ОШИБКА', err.response);
            toast.error('Ошибка обновления параметра опции', {
                autoClose: 3000
            });
        });
};

/**
 * Создание нового параметра опции
 */
export const createProductOptionParameter = ({dispatch}, data, errorCallback) => {
    let sendData = '';
    data.map((item, i)=>{
        if (item) sendData += `
            createPosterOption_${i}: createPosterOption(
                input: {
                  clientMutationId: "${item.id*-1}"
                  name: "${item.name}", 
                  description: "${item.description}",
                  technical_description: "${JSON.stringify(item.technicalDescription || {}).split('"').join('\\"')}",
                  option_slug: "${item.optionSlug}",
                  option_category: ${item.optionCategory}
                  
                }
            ){
                clientMutationId
                option {
                    id
                    name
                    description
                    technicalDescription: technical_description
                    option_slug
                    type
                    optionCategory: option_category{
                        id
                        name
                        description
                        sortOrder: sort_order
                    }
                }
                errors {
                    field
                    messages
                }
            }
        `;
    });

    graphQL.set({
        // adapter: getAllOptionsAdapter,
        data: sendData
    })
        .then((response) => {
            console.log('response', response);
            let errorData = [], successData = [];

            // Проверяем ответ и собираем ошибки и данные успешного ответа
             Object.values(response).map((r, i)=>{

                if (r.errors && r.errors.length){
                    errorData[i] = {
                        id: r.clientMutationId * -1,
                    };
                    r.errors.map((err)=>{
                        if (err) errorData[i][err.field] = err.messages[0];
                    })
                }
                if (r.option) successData[i] = r.option;
            });
            errorData = errorData.filter((item)=> item);
            successData = successData.filter((item)=> item);

            // Если есть ошибки
            if (errorData.length) {
                errorCallback && errorCallback(errorData);
                toast.error('Ошибка валидации на сервере', {
                    autoClose: 4000
                });
            }

            // Если есть успешный ответ
            if (!errorData.length && successData.length) {
                dispatch({
                    type: PRODUCT_UPDATE_OPTION_PARAMS,
                    payload: {updateList: successData, optionCategoryId: data[0].optionCategory}
                });
                toast.success(successData.length > 1 ? 'Параметры опции успешно созданы' : 'Параметр опции успешно создан', {
                    autoClose: 3000
                });
            }

        })
        .catch((err) => {
            console.log('ОШИБКА', err.response);
            toast.error('Ошибка создания параметра опции', {
                autoClose: 3000
            });
        });
};
/**
 * Измепнение параметра опции
 */
export const updateProductOptionParameter = ({dispatch}, data, errorCallback) => {
    console.log('updateProductOptionParameter data ',data);
    let sendData = '';
    data.map((item, i)=>{
        if (item) sendData += `
            updatePosterOption_${i}: updatePosterOption(
                input: {
                  id: "${item.id}"
                  clientMutationId: "${item.id}"
                  name: "${item.name}", 
                  description: "${item.description}",
                  technical_description: "${JSON.stringify(item.technicalDescription || {}).split('"').join('\\"')}",
                  option_category: ${item.optionCategory},
                  option_slug: "${item.optionSlug}",
                }
            ){
                clientMutationId
                option {
                    id
                    name
                    description
                    technicalDescription: technical_description
                    option_slug
                    type
                    optionCategory: option_category{
                        id
                    }
                }
                errors {
                    field
                    messages
                }
            }
        `;
    });

    graphQL.set({
        // adapter: getAllOptionsAdapter,
        data: sendData
    })
        .then((response) => {
            console.log('response', response);
            let errorData = [], successData = [];

            // Проверяем ответ и собираем ошибки и данные успешного ответа
             Object.values(response).map((r, i)=>{

                if (r.errors && r.errors.length){
                    errorData[i] = {
                        id: r.clientMutationId,
                    };
                    r.errors.map((err)=>{
                        if (err) errorData[i][err.field] = err.messages[0];
                    })
                }
                if (r.option) successData[i] = r.option;
            });
            errorData = errorData.filter((item)=> item);
            successData = successData.filter((item)=> item);

            // Если есть ошибки
            if (errorData.length) {
                errorCallback && errorCallback(errorData);
                toast.error('Ошибка валидации на сервере', {
                    autoClose: 4000
                });
            }

            // Если есть успешный ответ
            if (!errorData.length && successData.length) {
                dispatch({
                    type: PRODUCT_PUT_OPTIONS,
                    payload: null
                });
                toast.success(successData.length > 1 ? 'Параметры опции успешно обновлены' : 'Параметр опции успешно обновлен', {
                    autoClose: 3000
                });
            }

        })
        .catch((err) => {
            console.log('ОШИБКА', err.response);
            toast.error('Ошибка обновления параметра опции', {
                autoClose: 3000
            });
        });
};
/**
 * Удаление параметра опции
 */
export const deleteProductOptionParameter = ({dispatch}, idList) => {
    let sendData = '';
    idList.map((id)=> {
        if (id) sendData += `
            deletePosterOption_${id}: deletePosterOption(
                    input: {
                        id: ${id}
                    }
                ) {
                ok
                errors {
                    field
                    messages
                }
            }
        `;
    });
    graphQL.set({
        // adapter: getAllOptionsAdapter,
        data: sendData
    })
        .then((response) => {
            console.log('response', response);
            dispatch({
                type: PRODUCT_PUT_OPTIONS,
                payload: null
            });
            toast.success(idList.length > 1 ? 'Параметры опции удалены' : 'Параметр опции удален', {
                autoClose: 3000
            });
        })
        .catch((err) => {
            console.log('ОШИБКА', err);
            toast.error('Ошибка удаления параметров опции', {
                autoClose: 3000
            });
        });
};