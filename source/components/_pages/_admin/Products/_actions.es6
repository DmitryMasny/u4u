import { store } from "components/App";

import {
    ADMIN_GET_PRODUCTS_LIST,
    ADMIN_SET_PRODUCTS_LIST,
    ADMIN_SET_PRODUCT,
    ADMIN_DISABLE_NAV,
    ADMIN_UPLOAD_PRODUCT_IMAGE,
    ADMIN_PHOTOS_SET_PHOTO,
    ADMIN_PHOTOS_REMOVE_PHOTO,
    ADMIN_SET_AVAIBLE_PRODUCTS_TYPES,
    PRODUCT_SET_OPTIONS_BUFFER,
    PRODUCT_SET_FORMATS_BUFFER,
    ADMIN_SET_PRODUCTS_LIST_PROGRESS,
    ADMIN_SET_AVAIBLE_PRODUCTS_GROUPS,
} from "const/actionTypes";

import {  productGetPostersAdapter } from 'server/adapters/posters';
import { PRODUCT_TYPES } from 'const/productsTypes';
import {graphQL} from "server/graphql";
import { toast } from '__TS/libs/tools';
// import {IMAGE_TYPES} from "const/imageTypes";
import { ADMIN_PRODUCT_ACCEPT_FORMATS } from 'config/main';

//получаем диспетчер Redux
const dispatch = store.dispatch;

// /**
//  * получить список всех продуктов
//  */
// export const getAllProductsAction = (type) => ({
//     type: ADMIN_GET_PRODUCTS_LIST,
//     payload: {
//         // urlParams: [type],
//         actions: {
//             inSuccess: ({response}) => {
//                 return { type: ADMIN_SET_PRODUCTS_LIST, payload: {list: response} }
//             },
//             inFail: (err)  => {
//                 return { type: ADMIN_SET_PRODUCTS_LIST, payload: {error: err, list: []} }
//             }
//         }
//     }
// });

/**
 * получить список типов продуктов
 */
export const getAvailableProductTypesAction = () => {

    graphQL.get({
        data:`
        productSlug: __type(name:"ProductProductSlug"){
            name
                enumValues{
                  name
                  description
                }
        }`
    })
        .then( ( response ) => {
            dispatch({
                type: ADMIN_SET_AVAIBLE_PRODUCTS_TYPES,
                payload: response && response.productSlug && response.productSlug.enumValues || []
            })
        })
        .catch( ( err ) => {
            console.log( 'ОШИБКА', err );
        });
};
/**
 * получить список групп продуктов
 */
export const getAvailableProductGroupsAction = () => {
    graphQL.get({
        data: `
        productGroup: getAllPosterProductGroup {
            id
            name
            slug
            sort_rate
        }`
    })
        .then( ( response ) => {
            dispatch({
                type: ADMIN_SET_AVAIBLE_PRODUCTS_GROUPS,
                payload: response && response.productGroup || []
            })
        })
        .catch( ( err ) => {
            console.log( 'ОШИБКА', err );
        });
};

/**
 * получить список продуктов
 */
export const getProductsByTypeAction = (  ) => {
    dispatch({
        type: ADMIN_SET_PRODUCTS_LIST_PROGRESS,
        payload: true
    });

    graphQL.get({
        adapter: productGetPostersAdapter,
        data:`
              poster_products: getAllPosterProduct{
                id
                name
                description
                product_info
                product_images
                product_slug
                visible
              }
          `
    })
        .then( ( response ) => {
            dispatch({
                type: ADMIN_SET_PRODUCTS_LIST,
                payload: response
            })
        })
        .catch( ( err ) => {
            console.log( 'ОШИБКА', err );
        });
};

/**
 * получить свойства продукта
 */
export const getProductByIdAction = (  id ) => {

     graphQL.get({
        adapter: productGetPostersAdapter,
        data:`
            poster_products: getPosterProductById(product_id: "${id}") {
                id
                name
                description
                product_info
                product_images
                product_slug
                visible
                product_group {
                    slug
                    name
                }
                formats: format_set{
                  id
                  name
                  width
                  height
                  dpi
                  allow_rotate
                  barcode_position
                  sort_order
                  visible
                  format_options: formatoption_set {
                    id
                    price
                    sort_order
                    default_price
                    option {
                        id
                        name
                        description
                        technical_description
                        option_slug
                        type
                        option_category: option_category {
                          id
                          name
                          description
                          sort_order
                        }
                    }
                  }
                }
            }
        `
    })
        .then( ( response ) => {
            console.log( 'response', response );
            dispatch({
                type: ADMIN_SET_PRODUCT,
                payload: response &&  Object.values(response)[0][0]
            })
        })
        .catch( ( err ) => {
            console.log( 'ОШИБКА', err );
        });
};

/**
 *  сбросить текущий продукт
 */
export const resetProductAction = (  ) => {
    dispatch({
        type: ADMIN_SET_PRODUCT,
        payload: null
    });
};



/**
 * Загрузить изображение
 */
export const uploadImageAction = (  file, callback ) => {

    if (!file) return null;

    //проверка на тип и формат файла
    let isCorrectFormat = false;
    ADMIN_PRODUCT_ACCEPT_FORMATS.forEach( ( format ) => {
        if ( !!~file.type.indexOf( format ) ) {
            isCorrectFormat = true
        }
    } );
    if ( !isCorrectFormat ) {
        toast.error('Неверный тип файла "' + file.name + '". Необходим файл JPEG, PNG', {
            autoClose: 3000
        });
    } else {
        callback && callback({isLoading: true});
        dispatch({
            type: ADMIN_UPLOAD_PRODUCT_IMAGE,
            payload: {
                files: [file],
                actions: {
                    // inSuccess: () => ({ type: MY_PHOTOS_SET_ALL_PHOTOS, payload: data.response }),
                    inSuccess: (r) => {
                        // Помечаем, что фотография загружена
                        callback && callback({id: r.response.photoId});
                    },
                    inFail: (err)  => {

                        const message = err.response && err.response.data && err.response.data.error && err.response.data.error.messages[0];

                        toast.error(message ? (err.response.data.error.name + ' - ' + message) : 'Не удалось загрузить изображение', {
                            autoClose: 3000
                        });

                        callback && callback({error: message || 'ошибка'});
                    }
                }
            }
        });
    }
};

/**
 * Обновление фотографии после ответа по websocket
 */
export const updateAdminPhotoAction = ( photoId, data )  => {
    if (!photoId || !data) return {type: 0};

    data.error && toast.error(data.error, {
        autoClose: 3000
    });
    return {
        type: ADMIN_PHOTOS_SET_PHOTO,
        payload: {
            photoId: photoId,
            data: data
        }
    }
};
/**
 * Удаление фотографии из буфера redux
 */
export const removeAdminPhotoAction = (  photoId )  => {
    if (!photoId) return {type: 0};
    dispatch({
        type: ADMIN_PHOTOS_REMOVE_PHOTO,
        payload: photoId
    });
};


/**
 * ФОРМАТЫ - create, update, delete
 */

/**
 * Создание нового формата
 */
export const createProductFormat = ( data, productId, errorCallback) => {
    let sendData = '';

    data.map((item, i)=>{
        if (item) sendData += `
            createPosterFormat_${i}: createPosterFormat(
                input: {
                  clientMutationId: "${item.id}",
                  product: ${productId},
                  name: "${item.name}",
                  width: ${item.width},
                  height: ${item.height},
                  dpi: ${item.dpi},
                  allow_rotate: ${item.allowRotate || false}, 
                  barcode_position: "${item.barcodePosition || 'LONG_SIDE'}",
                  sort_order: ${item.sort || 0}, 
                  visible: true,
                }
            ){
                clientMutationId
                format {
                    id
                    name
                    width
                    height
                    dpi
                    allow_rotate
                    sort_order
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
            gQlResponseMethod({
                response: response,
                type: 'format',
                successText: 'Формат успешно создан',
                successText2: 'Форматы успешно созданы',
                errorCallback: errorCallback,
                successCallback: ()=> dispatch({
                    type: ADMIN_SET_PRODUCT,
                    payload: null
                })
            });

        })
        .catch((err) => {
            console.log('err',err);
            gQlErrorMethod(err, 'Ошибка создания формата')
        });
};
/**
 * Изменение формата
 */
export const updateProductFormat = ( data, productId, errorCallback) => {

    let sendData = '';
    data.map((item, i)=>{
        if (item) sendData += `
            updatePosterFormat_${i}: updatePosterFormat(
                input: {
                  clientMutationId: "${item.id}"
                  id: ${item.id},
                  product: ${productId},
                  name: "${item.name}",
                  width: ${item.width},
                  height: ${item.height},
                  dpi: ${item.dpi},
                  allow_rotate: ${item.allowRotate || false},
                  barcode_position: "${item.barcodePosition || 'LONG_SIDE'}",
                  sort_order: ${item.sort || 0},
                  visible: ${item.visible},
                }
            ){
                clientMutationId
                format {
                    id
                    name
                    width
                    height
                    dpi
                    allow_rotate
                    sort_order
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
            gQlResponseMethod({
                response: response,
                type: 'format',
                successText: 'Формат успешно обновлен',
                successText2: 'Форматы успешно обновлены',
                errorCallback: errorCallback,
                successCallback: ()=> dispatch({
                    type: ADMIN_SET_PRODUCT,
                    payload: null
                })
            });

        })
        .catch((err) => {
            gQlErrorMethod(err, 'Ошибка изменения формата')
        });
};
/**
 * Удаление формата
 */
export const deleteProductFormat = ( idList) => {
    let sendData = '';
    idList.map((id)=> {
        if (id) sendData += `
            deletePosterFormat_${id}: deletePosterFormat(
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
            gQlResponseMethod({
                response: response,
                type: 'format',
                successText: 'Формат продукта удалён',
                successText2: 'Форматы продукта удалены',
                successCallback: ()=> dispatch({
                    type: ADMIN_SET_PRODUCT,
                    payload: null
                })
            });
        })
        .catch((err) => {
            gQlErrorMethod(err, 'Ошибка удаления формата');
        });
};


/**
 * ПРОДУКТ - create, update, delete
 */

/**
 * Создание нового продукта
 */
export const createProduct = ( data, callback) => {

    graphQL.set({
        // adapter: getAllOptionsAdapter,
        data: `
            createPosterProduct(
                input: {
                  name: "${data.name}", 
                  description: "${data.description.replace(/[\r\n]+/g, '\\n')}",
                  product_info: "${JSON.stringify(data.productInfo).split('"').join('\\"')}", 
                  product_images: "${JSON.stringify(data.productImages).split('"').join('\\"')}",
                  product_slug: "${data.productSlug}",
                  ${data.productGroup ? `product_group: ${data.productGroup}` : ''}
                }
            ){
                product {
                    id
                    name
                    description
                    product_info
                    product_slug
                }
                errors {
                    field
                    messages
                }
            }
        `
    })
        .then((response) => {
            gQlResponseMethod({
                response: response,
                type: 'product',
                successText: 'Продукт успешно создан',
                errorCallback: (data)=>callback({error: data}),
                successCallback: (data)=> {
                    dispatch({
                        type: ADMIN_SET_PRODUCT,
                        payload: null
                    });
                    dispatch({
                        type: ADMIN_SET_PRODUCTS_LIST,
                        payload: null
                    });
                    callback && callback(data);
                }
            });

        })
        .catch((err) => {
            console.log('err',err);
            gQlErrorMethod(err, 'Ошибка создания продукта')
        });
};
/**
 * Изменение продукта
 */
export const updateProduct = ( data, productId, errorCallback) => {
    graphQL.set({
        // adapter: getAllOptionsAdapter,
        data: `
            updatePosterProduct(
                input: {
                  id: ${productId},
                  name: "${data.name}", 
                  description: "${data.description.replace(/[\r\n]+/g, '\\n')}", 
                  product_info: "${JSON.stringify(data.productInfo).replace(/[\r\n]+/g, '\\n').split('"').join('\\"')}",
                  product_images: "${JSON.stringify(data.productImages).split('"').join('\\"')}",
                  product_slug: "${data.productSlug}",
                  visible: ${data.visible},
                  ${data.productGroup ? `product_group: ${data.productGroup}` : ''}
                }
            ){
                product {
                    id
                    name
                    description
                    product_info
                    product_slug
                }
                errors {
                    field
                    messages
                }
            }
        `
    })
        .then((response) => {
            gQlResponseMethod({
                response: response,
                type: 'product',
                successText: 'Продукт успешно обновлен',
                errorCallback: errorCallback,
                successCallback: ()=> {
                    dispatch({
                        type: ADMIN_SET_PRODUCT,
                        payload: null
                    });
                    dispatch({
                        type: ADMIN_SET_PRODUCTS_LIST,
                        payload: {
                            ['poster']: null
                        }
                    });
                }
            });

        })
        .catch((err) => {
            gQlErrorMethod(err, 'Ошибка изменения продукта')
        });
};
/**
 * Удаление продукта
 */
export const deleteProduct = ( id, callback) => {

    graphQL.set({
        // adapter: getAllOptionsAdapter,
        data: `
            deletePosterProduct(
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
        `
    })
        .then((response) => {
            gQlResponseMethod({
                response: response,
                type: 'ok',
                successText: 'Продукт удалён',
                successCallback: ()=> {
                    dispatch({
                        type: ADMIN_SET_PRODUCTS_LIST,
                        payload: null
                    });
                    callback && callback();
                    dispatch({
                        type: ADMIN_SET_PRODUCT,
                        payload: null
                    });
                }
            });
        })
        .catch((err) => {
            console.log('catch err',err);
            gQlErrorMethod(err, 'Ошибка удаления продукта');
        });
};


/**
 * ПАРАМЕТРЫ ОПЦИЙ (цены) - create, update, delete
 */

/**
 * Создание новой опции
 */
export const createProductOptionParameter = ( data, formatId, errorCallback) => {

    let sendData = '';
    data.map((item, i)=>{
        if (item) sendData += `
            createPosterFormatOption_${i}: createPosterFormatOption(
                input: {
                  clientMutationId: "${item.id}"
                  format: ${formatId}
                  option: ${item.optionId}
                  price: ${item.price || 0}
                  default_price: ${item.defaultPrice || false}
                  sort_order: ${item.sort || 0}
                }
            ){
                clientMutationId
                format_option {
                    id
                    price
                    sort_order
                    default_price
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
            gQlResponseMethod({
                response: response,
                type: 'format_option',
                successText: 'Параметр опции успешно создан',
                successText2: 'Параметр опции успешно созданы',
                errorCallback: errorCallback,
                successCallback: ()=> dispatch({
                    type: ADMIN_SET_PRODUCT,
                    payload: null
                })
            });

        })
        .catch((err) => {
            console.log('err',err);
            gQlErrorMethod(err, 'Ошибка создания параметра опции')
        });
};
/**
 * Изменение опции
 */
export const updateProductOptionParameter = ( data, formatId, errorCallback) => {

    let sendData = '';
    data.map((item, i)=>{
        if (item) sendData += `
            updatePosterFormatOption_${i}: updatePosterFormatOption(
                input: {
                  clientMutationId: "${item.id}"
                  id: ${item.id},
                  format: ${formatId},
                  option: ${item.optionId},
                  price: ${item.price},
                  default_price: ${item.defaultPrice || false}
                  sort_order: ${item.sort || 0}
                }
            ){
                clientMutationId
                format_option {
                    id
                    price
                    sort_order
                    default_price
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
            gQlResponseMethod({
                response: response,
                type: 'format_option',
                successText: 'Опция успешно обновлена',
                successText2: 'Опции успешно обновлены',
                errorCallback: errorCallback,
                successCallback: ()=> dispatch({
                    type: ADMIN_SET_PRODUCT,
                    payload: null
                })
            });

        })
        .catch((err) => {
            gQlErrorMethod(err, 'Ошибка изменения опции')
        });
};
/**
 * Удаление опции
 */
export const deleteProductOptionParameter = ( idList) => {
    let sendData = '';
    idList.map((id)=> {
        if (id) sendData += `
            deletePosterFormatOption_${id}: deletePosterFormatOption(
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
            gQlResponseMethod({
                response: response,
                type: 'ok',
                successText: 'Опция продукта удалён',
                successText2: 'Опции продукта удалены',
                successCallback: ()=> dispatch({
                    type: ADMIN_SET_PRODUCT,
                    payload: null
                })
            });
        })
        .catch((err) => {
            gQlErrorMethod(err, 'Ошибка удаления опции');
        });
};
/**
 * Блокировка навигации по табам, если есть несохраненные изменения
 */
export const disableNavigationAction = ( disable ) => {
    dispatch({
        type: ADMIN_DISABLE_NAV,
        payload: disable
    })
};

/**
 * Обработка ответа
 */
const gQlResponseMethod = ({response, type, successCallback, errorCallback, successText,  successText2, errorText }) => {
    console.log('response', response);
    let errorData = [], successData = [];

    // Проверяем ответ и собираем ошибки и данные успешного ответа
    Object.values(response).map((r, i)=>{
        if (!r) return  null;
        if (r.errors && r.errors.length){
            errorData[i] = {
                id: r.clientMutationId,
            };
            r.errors.map((err)=>{
                if (err) errorData[i][err.field] = err.messages[0];
            })
        }
        if (r[type]) {
            successData[i] = r[type];
        } else if (r.ok) successData[i] = true;
    });
    errorData = errorData.filter((item)=> item);
    successData = successData.filter((item)=> item);
console.log('errorData',errorData);
    // Если есть ошибки
    if (errorData.length) {
        errorCallback && errorCallback(errorData);
        toast.error(errorText || 'Ошибка валидации на сервере', {
            autoClose: 4000
        });
    }

    // Если есть успешный ответ
    if (!errorData.length && successData.length) {
        successCallback && successCallback(successData);
        successText && toast.success(successData.length > 1 ? (successText2 || successText) : successText, {
            autoClose: 3000
        });
    }
};
/**
 * Обработка ошибки
 */
const gQlErrorMethod = (error, text) => {
    console.log('ОШИБКА', error && error.response);
    toast.error(text || 'Ошибка сервера', {
        autoClose: 3000
    });
};


/**
 * Запись буфера опций
 */
export const setOptionsBuffer = ( data) => {
    dispatch({
        type: PRODUCT_SET_OPTIONS_BUFFER,
        payload: data
    });
};
/**
 * Запись буфера форматов
 */
export const setFormatsBuffer = ( data) => {
    dispatch({
        type: PRODUCT_SET_FORMATS_BUFFER,
        payload: data
    });
};

//
// const groupProductList = (list) => {
//     if (!list || !list.length) return [];
//
//     let groups = {};
//     let groupList = [];
//
//     for (let i=0; i < list.length; i++) {
//         if (groups[list[i].group]) {
//             groups[list[i].group].push({id: list[i].id, name: list[i].name});
//         } else {
//             groups[list[i].group] = {id: list[i].id, name: list[i].name};
//         }
//     }
//
//
//
//     return groups;
// };