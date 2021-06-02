import {
    PRODUCT_TYPES_GET,
    PRODUCT_TYPES_PUT,
    PRODUCT_SELECTED_DATA_PUT,
    PRODUCT_GET_THEME_DATA,
    PRODUCT_PUT_THEME_DATA,
    PRODUCT_PUT_PRODUCT_DATA,
    PRODUCT_UPDATE_PRODUCT_DATA,
    PRODUCT_SET_SELECTED,
    FORMAT_SET_SELECTED,
    FORMAT_SET_ROTATION,
    OPTION_SET_SELECTED
} from 'const/actionTypes';
import { graphQL } from 'server/graphql';
import { productGetPostersAdapter } from 'server/adapters/posters';


//устанавливаем выбранный продукт
export const productSetSelectByIdAction = ( selectedId, productSlug ) => ({
    type: PRODUCT_SET_SELECTED,
    payload:  {
        id: selectedId,
        productSlug: productSlug
    }
});
//устанавливаем выбранный формат
export const productSetFormatSelectByIdAction = ( id, productSlug ) => ({
    type: FORMAT_SET_SELECTED,
    payload:  {
        id: id,
        productSlug: productSlug
    }
});
//устанавливаем поворот или нет
export const productSetFormatRotationAction = ( productSlug ) => ({
    type: FORMAT_SET_ROTATION,
    payload:  {
        productSlug: productSlug
    }
});
//устанавливаем опцию как выбранную
export const productSetOptionAction = ( { productSlug, id, filterId, formatId } ) => ({
    type: OPTION_SET_SELECTED,
    payload:  {
        productSlug: productSlug,
        id: id,
        filterId: filterId,
        formatId: formatId
    }
});



//получение типов фотокниг с сервера
export const productTypesGetAction = ( productSlug ) => ({
    type: PRODUCT_TYPES_GET,
    payload: {
        productSlug: productSlug,
        actions: {
            inProgress: () => ({ type: 0 }),  //в прогрессе
            inSuccess: ( { response = {}, request } ) => (  //выполнено
                {
                    type: PRODUCT_TYPES_PUT,
                    payload: {
                        productSlug: productSlug,
                        [request.productSlug || productSlug]: response
                    }
                }
            ),
            inFail: () => ({ type: 0 })       //неудача
        }
    }
});

// сохраняем данные в state
export const productSaveDataAction = ( type, data ) => ({
    type: PRODUCT_SELECTED_DATA_PUT,
    payload: {
        productSlug: type,
        data: data
    }
});

// создаем новый продукт
export const productCreateLayoutAction = ( layout ) => {
    return {
                type: PRODUCT_PUT_PRODUCT_DATA,
                payload: {
                    ...layout
                }
            }
};

// обновляем продукт
export const productUpdateLayoutAction = ( data ) => {
    return {
        type: PRODUCT_UPDATE_PRODUCT_DATA,
        payload: data
    }
};

// сохраняем данные в state
export const productGetThemeDataAction = ( type, data ) => ({
    type: PRODUCT_GET_THEME_DATA,
    payload: {
        urlParams: [data],
        actions: {
            inProgress: () => ({ type: 0 }),  //в прогрессе
            inSuccess: ( {response = {}, request } ) => {
                if (response && response.products) {
                    //выполнено
                    return ({
                        type: PRODUCT_PUT_THEME_DATA,
                        payload: {
                            products: response.products,
                            type: type
                        }
                    })
                }
            },
            inFail: () => ({ type: 0 })       //неудача
        }
    }
});

//получение постеров с сервера
// export const productGetPostersAction = (  ) => ({
//     type: PRODUCT_GET_POSTERS,
//     payload: {
//         productType: PRODUCT_TYPE_POSTER,
//         actions: {
//             inSuccess: ( { response = {}, request } ) => (  //выполнено
//                 {
//                     type: PRODUCT_TYPES_PUT,
//                     payload: {
//                         response: response,
//                         request: request
//                     }
//
//                 }
//             ),
//             inFail: (err) => {
//                 console.log('err',err);
//                 return { type: 0 }}       //неудача
//         }
//     }
// });

// Рудимент!
export const productSetToReduxAction = ( { productSlug, response } ) => ({
    type: PRODUCT_TYPES_PUT,
    payload: {
        response,
        productSlug
    }
});



// Назначение типа переплета
//export const productTypeSetAction = ( id = false ) => ({ type: PRODUCT_TYPE_SET, payload: id });

// Назначение формата
//export const productFormatSetAction = ( id = false ) => ({ type: PRODUCT_FORMAT_SET, payload: id });

// Назначение кол-ва страниц
//export const productPagesSetAction = ( id = false ) => ({ type: PRODUCT_PAGES_SET, payload: id });

// Назначение вида ламинации обложки
//export const productGlossSetAction = ( id = false ) => ({ type: PRODUCT_GLOSS_SET, payload: id });


