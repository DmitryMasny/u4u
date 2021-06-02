import React from "react";
import { Btn } from 'components/_forms';

import {
    MY_PRODUCTS_GET_PRODUCTS,
    MY_PRODUCTS_GET_DELETED_PRODUCTS,
    MY_PRODUCTS_GET_ORDERS,
    MY_PRODUCTS_GET_CART_COUNT,
    MY_PRODUCTS_SET_CART_COUNT,
    MY_PRODUCTS_MAKE_ORDER_FROM_PRODUCT,
    MY_PRODUCTS_MOVE_PRODUCT_TO_CART,
    MY_PRODUCTS_MAKE_PRODUCT_COPY,
    MY_PRODUCTS_DELETE_PRODUCT,
    MY_PRODUCTS_MOVE_PRODUCT_TO_DELETED,
    MY_PRODUCTS_RECOVER_PRODUCT,
    MY_PRODUCTS_MOVE_PRODUCT_FROM_DELETED,
    MY_PRODUCTS_REORDER_PRODUCT,
    MY_PRODUCTS_UPDATE_ORDERS,
    MY_PRODUCTS_REMOVE_PRODUCT_FROM_CART,
    MY_PRODUCTS_MOVE_PRODUCT_FROM_CART,
    MY_PRODUCTS_CHANGE_PRODUCT_COUNT,
    MY_PRODUCTS_CHANGE_PRODUCT_NAME,
    MY_PRODUCTS_CHANGING_PRODUCT_COUNT,
    MY_PRODUCTS_SET_PRODUCTS,
    MY_PRODUCTS_TOGGLE_SHOW_DELIVERY,
    MY_PRODUCTS_SET_MY_DELIVERY,
    MY_PRODUCTS_SEND_NEW_ORDER_TO_SERVER,
    MY_PRODUCTS_CLEAR_MY_CART,
    PROMOCODE_CHECK,
    PROMOCODE_SET,
    MY_PRODUCTS_CHANGING_PRODUCT_NAME,
    //BIGLION_PROMOCODE_CHECK
} from 'const/actionTypes';

import { FullScreenLoaderAction } from 'components/FullScreenLoader/actions'

import { MY_PRODUCTS_NEW, MY_PRODUCTS_INORDER, MY_PRODUCTS_DELETED, MY_PRODUCTS_CART, MY_PRODUCTS_SHOW_DD_WIDGET } from 'const/myProducts';

import { myProductsConverter, myOrdersConverter, myCartCountDataConverter } from 'libs/myProductsConverters';

import { makeCopyName } from 'libs/helpers';

import TEXT from 'texts/main';
import TEXT_MY_PRODUCTS from 'texts/my_products';
import decamelizeKeysDeep from 'decamelize-keys-deep';

//import LINKS_MAIN from 'config/links';

import { toast } from '__TS/libs/tools';

import WS from 'server/ws';

const setFormatDDMMYYYYtoMMDDYYYY = ( date, separator = '/' ) => {
    const [day, month, year] = date.split( '.' );
    return month + separator + day + separator + year;
};

const returnDate = ( obj ) => {
    if ( obj.lastChanged ) return parseFloat(obj.lastChanged);
    if ( obj.info && obj.info.changed ) {
        let x = obj.info.changed.split('-');
        const z = `${x[ 0 ].trim()} ${setFormatDDMMYYYYtoMMDDYYYY( x[ 1 ].trim() )}`;
        return Date.parse( z );
    }
    return 0;
};

/**
 * Получение продуктов раздела с сервера
 * @param tab {string}
 * @returns {{type: string, payload: object}}
 */
export const getProductsFromServerAction = ( tab ) => dispatch => {

    switch ( tab ) {
        case MY_PRODUCTS_NEW:

            dispatch( {
                         type: MY_PRODUCTS_GET_PRODUCTS,
                         payload: {
                             actions: {
                                 inFail: () => ({
                                     type: MY_PRODUCTS_SET_PRODUCTS,
                                     payload: { tabs: [tab], [ tab ]: { error: true } }
                                 }),
                                 inSuccess: ( { response } ) => {
                                     if ( response.layouts && response.layouts.length ) {
                                         response.layouts = response.layouts.map( item => {
                                             delete (item[ '_id' ]);
                                             return item;
                                         });
                                     }

                                     WS.getPosters().then( wsResponse => {
                                         const result = [ ...(myProductsConverter( response ) || []) ];

                                         wsResponse.layouts.map( lo => {
                                             //убираем все удаленные
                                             if ( lo.layout.isDeleted ) return;

                                             lo.layout.random = Math.random();
                                             result.push( lo.layout );
                                         });

                                         //сортируем таб, если не корзина
                                         if ( tab !== 'cart' ) result.sort( ( a, b ) => (returnDate( b ) - returnDate( a )) );
                                         /*
                                         result.map( i => {
                                             const date = new Date( i.lastChanged );
                                         } );
                                         */

                                         dispatch( {
                                             type: MY_PRODUCTS_SET_PRODUCTS,
                                             payload: { tabs: [tab], [ tab ]: result }
                                         });

                                     }).catch( ( err ) => {

                                         dispatch({
                                             type: MY_PRODUCTS_SET_PRODUCTS,
                                                      payload: {
                                                          tabs: [tab],
                                                          [ tab ]: myProductsConverter( response  ) || []
                                                      }
                                         });
                                     });
                                     return null;
                                 }
                             }
                         }
                     } );
            break;
        case MY_PRODUCTS_DELETED:
            dispatch( {
                         type: MY_PRODUCTS_GET_DELETED_PRODUCTS,
                         payload: {
                             actions: {
                                 inFail: () => {
                                     return {
                                         type: MY_PRODUCTS_SET_PRODUCTS,
                                         payload: { tabs: [tab], [ tab ]: { error: true } }
                                     }
                                 },
                                 inSuccess: ( { response } ) => {
                                     WS.getPosters().then( ( wsResponse ) => {
                                         const result = [...(myProductsConverter( response ) || [])];

                                         wsResponse.layouts.map( ( lo ) => {
                                             //убираем все удаленные
                                             if ( lo.layout.isDeleted ) {
                                                 lo.layout.random = Math.random();
                                                 result.push( lo.layout );
                                             }
                                         });

                                         //сортируем таб, если не корзина
                                         if ( tab !== 'cart' ) result.sort( ( a, b ) => (returnDate( b ) - returnDate( a )));

                                         dispatch( {
                                                       type: MY_PRODUCTS_SET_PRODUCTS,
                                                       payload: { tabs: [ tab ], [ tab ]: result }
                                                   });

                                     }).catch( ( err ) => {
                                         dispatch({
                                                      type: MY_PRODUCTS_SET_PRODUCTS,
                                                      payload: {
                                                          tabs: [tab],
                                                          [ tab ]: myProductsConverter(  response ) || []
                                     }
                                                  });
                                     });
                                     return null;
                                 }
                             }
                         }
                     } );
            break;
        case MY_PRODUCTS_INORDER:
        case MY_PRODUCTS_CART:
            dispatch( {
                         type: MY_PRODUCTS_GET_ORDERS,
                         payload: {
                             actions: {
                                 inProgress: () => ({ type: 0 }),
                                 inFail: () => ({
                                     type: MY_PRODUCTS_SET_PRODUCTS,
                                     payload: {
                                         tabs: [MY_PRODUCTS_INORDER, MY_PRODUCTS_CART],
                                         [ MY_PRODUCTS_INORDER ]: { error: true },
                                         [ MY_PRODUCTS_CART ]: { error: true },
                                     }
                                 }),
                                 inSuccess: ( { response } ) => {
                                     const convertedData = myOrdersConverter( response );

                                     return ({
                                         type: MY_PRODUCTS_SET_PRODUCTS,
                                         payload: {
                                             tabs: [MY_PRODUCTS_INORDER, MY_PRODUCTS_CART],
                                             [ MY_PRODUCTS_INORDER ]: convertedData.orders,
                                             [ MY_PRODUCTS_CART ]: convertedData.cart,
                                             delivery: convertedData.delivery
                                         }
                                     })
                                 }
                             }
                         }
                     } );
            break;
    }
};

/**
 * Получить количество товаров в корзине
 */
export const getCartCountAction = () => ({
    type: MY_PRODUCTS_GET_CART_COUNT,
    payload: {
        actions: {
            inProgress: () => ({ type: 0 }),
            inFail: () => (
                {
                    type: MY_PRODUCTS_SET_CART_COUNT,
                    payload: 0
                }),
            inSuccess: (r) => (
                {
                     type: MY_PRODUCTS_SET_CART_COUNT,
                     payload: r.response.count
                })
        }
    }
});
/**
 * Очистка корзины
 * @returns {{type: *}}
 */
export const clearCartAction = () => {
    return ({
        type: MY_PRODUCTS_CLEAR_MY_CART
    });
};

/**
 * Положить продукт в корзину
 * @param id {string,number}
 * @param hash {string}
 * @param callback {function}
 * @param goToCart {function}
 * @returns {{type: string, payload: object}}
 */
export const makeProductOrderAction = ( {id, hash, callback, goToCart} ) => ({
    type: MY_PRODUCTS_MAKE_ORDER_FROM_PRODUCT,
    payload: {
        urlParams: [id],
        actions: {
            inProgress: () => ({ type: 0 }),
            inSuccess: () => {
                callback && callback();
                toast.success(
                    <div>
                        <div style={{marginBottom: '5px'}}>{TEXT_MY_PRODUCTS.MAKE_ORDER_SUCCESS}</div>
                        <Btn small intent={"success"} onClick={goToCart}>{TEXT_MY_PRODUCTS.MAKE_ORDER_SUCCESS_LINK}</Btn>
                    </div>, {
                        autoClose: 4000
                    });
                return ({
                    type: MY_PRODUCTS_MOVE_PRODUCT_TO_CART,
                    payload: id
                });
            },
            inFail: () => {
                callback && callback();
                if (hash) {
                    const goToEditor = () => {
                        window.location.assign('/redaktor/#' + hash + '/');
                    };
                    toast.error(
                        <div>
                            <div style={{marginBottom: '5px'}}>{TEXT_MY_PRODUCTS.MAKE_ORDER_ERROR}</div>
                            <Btn small intent={"danger"} onClick={goToEditor}>{TEXT_MY_PRODUCTS.MAKE_ORDER_ERROR_BTN}</Btn>
                        </div>, {
                        autoClose: 9000
                    });


                } else console.log('!! no hash data in makeProductOrderAction');
                return ({
                    type: MY_PRODUCTS_MOVE_PRODUCT_TO_CART
                });
            }
        }
    }
});

/**
 * Создать копию продукта
 * @param id {string,number}
 * @param name {string} имя нового продукта
 * @param callback {function} callback для перехода в другой раздел
 * @returns {{type: string, payload: object}}
 */
export const makeProductCopyAction = ( id, name, callback ) => {
    return ({
    type: MY_PRODUCTS_MAKE_PRODUCT_COPY,
    payload: {
        name: makeCopyName( name, TEXT.THE_COPY ),
        urlParams: [id, 'clone'],
        actions: {
            inProgress: () => ({ type: 0 }),
            inFail: () => ({ type: 0 }),
            inSuccess: ( { dispatch } ) => {
                dispatch( getProductsFromServerAction( MY_PRODUCTS_NEW ) );
                callback && callback();
            }
        }
    }
})};

/**
 * Удалить продукт
 * @param id {string,number}
 * @returns {{type: string, payload: object}}
 */
export const deleteProductAction = ( id ) => ({
    type: MY_PRODUCTS_DELETE_PRODUCT,
    payload: {
        deleted: true,
        urlParams: [id],
        actions: {
            inProgress: () => ({ type: 0 }),
            inFail: () => ({ type: 0 }),
            inSuccess: ( { response } ) => {
                return({
                type: MY_PRODUCTS_MOVE_PRODUCT_TO_DELETED,
                payload: id
            })
        }
        }
    }
});

/**
 * Восстановить удаленный продукт
 * @param id {string,number}
 * @returns {{type: string, payload: object}}
 */
export const recoverProductAction = ( id ) => ({
type: MY_PRODUCTS_RECOVER_PRODUCT,
    payload: {
    deleted: false,
        urlParams: [id],
        actions: {
        inProgress: () => ({ type: 0 }),
            inFail: () => ({ type: 0 }),
            inSuccess: ( { response } ) => {
            return({
                type: MY_PRODUCTS_MOVE_PRODUCT_FROM_DELETED,
                payload: id
            })
        }
    }
}
});

export const reOrderProductAction = ( id ) => ({
    type: MY_PRODUCTS_REORDER_PRODUCT,
    payload: {
        urlParams: [id],
        actions: {
            inProgress: () => ({ type: 0 }),
            inFail: () => ({ type: 0 }),
            inSuccess: ( { response } ) => {
                return({
                type: MY_PRODUCTS_UPDATE_ORDERS,
                payload: id
            })
        }
        }
    }
});

/**
 * Убрать позицию заказа из корзины
 * @param id {string,number}
 * @param callback {function}
 * @returns {{type: string, payload: object}}
 */
export const removeProductFromCartAction = ( id, callback = null ) => ({
    type: MY_PRODUCTS_REMOVE_PRODUCT_FROM_CART,
    payload: {
        urlParams: [id],
        actions: {
            inProgress: () => ({ type: 0 }),
            inFail: ( err ) => {
                console.log('АДАМ =>>> не получилось удалиль продукт из корзины:', err );
                return { type: 0 }
            },
            inSuccess: ( { response, dispatch } ) => {
                console.log('АДАМ =>>> успешное удаление продукта из корзины:', response);
                dispatch(clearPromoCodeAction());
                callback && callback( response.deliveryBoxSize );
                return {
                    type: MY_PRODUCTS_MOVE_PRODUCT_FROM_CART,
                    payload: { id }
                }
            }
        }
    }
});

/**
 * Изменение тиража продукта в корзине
 * @param id {string,number}
 * @param count {number}
 * @param promoCode {String}
 * @param orderSetId {Number}
 * @returns {{type: string, payload: object}}
 */
export const changeProductCountAction = ( id, count, promoCode, orderSetId ) => ({
    type: MY_PRODUCTS_CHANGE_PRODUCT_COUNT,
    payload: {
        count: count,
        urlParams: [id],
        actions: {
            inProgress: () => ({ type: 0 }),
            inFail: () => ({ type: 0 }),
            inSuccess: ( { response, dispatch } ) => {
                if (promoCode && orderSetId) {
                    dispatch(clearPromoCodeAction());
                    dispatch(checkPromoCodeAction({promo: promoCode, orderSetId: orderSetId }));
                }
                const convertedData = myCartCountDataConverter( response );
                return ({
                    type: MY_PRODUCTS_CHANGING_PRODUCT_COUNT,
                    payload: {
                        id: id,
                        order: convertedData.order,
                        //totalCost: convertedData.totalCost
                    }
                })
            }
        }
    }
});
/**
 * Изменение имени продукта
 * @param id {string,number}
 * @param name {string}
 * @returns {{type: string, payload: object}}
 */
export const changeProductNameAction = ( id, name ) => ({
    type: MY_PRODUCTS_CHANGE_PRODUCT_NAME,
    payload: {
        name: name,
        urlParams: [id],
        actions: {
            inProgress: () => ({ type: 0 }),
            inFail: () => ({ type: 0 }),
            inSuccess: ( { response } ) => {
                // console.log('changeProductNameAction [Success] ', response);
                return {
                    type: MY_PRODUCTS_CHANGING_PRODUCT_NAME,
                    payload: {id, name}
                }
            }
        }
    }
});

/**
 * Показать/ Скрыть блок оформления доставки
 * @param show {boolean}
 * @returns {{type: string, payload: boolean,undefined}}
 */
export const toggleShowDeliveryAction = ( show = undefined ) =>({
    type: MY_PRODUCTS_TOGGLE_SHOW_DELIVERY,
    payload: show
});

/**
 * Изменение свойств доставки в redux
 * @param data {object}
 * @returns {{type: string, payload: object}}
 */
export const setMyDeliveryAction = ( data ) => ({
    type: MY_PRODUCTS_SET_MY_DELIVERY,
    payload: data
});

/**
 * Отправка на сервер данных нового заказа (о товаре и доставке)
 * @param data {object}
 * @returns {{type: string, payload: object}}
 */
export const sendNewOrderToServerAction = ( data ) => {
    return({
    type: MY_PRODUCTS_SEND_NEW_ORDER_TO_SERVER,
    payload: {
        ...decamelizeKeysDeep( data ),
        urlParams: [data.orderInfo.id,'delivery'],
        actions: {
            inProgress: () => FullScreenLoaderAction( true ),
            inFail: ( {response, code} ) => {
                //если код ошибки 404
                const codeError = parseInt(code);
                if ( codeError === 404 || codeError === 400 ) {
                    switch ( response.data && response.data.error || 0 ) {
                        case 423:
                            toast.error('Неверный код бронирования', {
                                autoClose: 5000
                            });
                            break;
                        case 500:
                            toast.error( 'Произошла ошибка сервера. Если данная ошибка повториться, свяжитесь с службой поддержки U4U.', {
                                autoClose: 10000
                            } );
                            break;
                        case 999:
                            toast.warn('Купон временно заблокирован. Пожалуйста, повторите позднее', {
                                autoClose: 5000
                            });
                            break;default:

                            switch ( response.data && response.data.apply_error || 0 ) {
                                case 419:
                                    toast.warn('Купон просрочен', {
                                        autoClose: 5000
                                    });
                                    break;
                                case  420:
                                    toast.warn('Купон не действителен', {
                                        autoClose: 5000
                                    });
                                    break;
                                default:
                                    if ( response.data ) {
                                        const msgServerArray = {
                                            'fio_name': 'Имя',
                                            'fio_surname': 'Фамилия',
                                            'fio_fathername': 'Отчество',
                                            'to_house': 'Номер дома',
                                            'to_street': 'Адресс',
                                            'comment': 'Комментарий',
                                            'to_flat': 'Квартира',
                                            'to_phone': 'Номер телефона',
                                            'city': 'Город'
                                        };

                                        for ( let prop in msgServerArray ) {
                                            if ( response.data[ prop ] ) {
                                                //toast.warn( `Ошибка в поле "${msgServerArray[ prop ]}". /${response.data[ prop ][0]}`, {
                                                toast.warn( `Ошибка в поле "${msgServerArray[ prop ]}".`, {
                                                    autoClose: 10000
                                                });
                                            }
                                        }

                                    } else {
                                        toast.error( 'Произошла ошибка сервера. Если данная ошибка повториться, свяжитесь с службой поддержки U4U.', {
                                            autoClose: 10000
                                        } );
                                    }
                                    break;
                            }

                            break;
                    }
                }

                return [ toggleShowDeliveryAction(), FullScreenLoaderAction( false ) ]
            },
            inSuccess: ( { response } ) => {
                data.callback( response.link );    // callback для обновления корзины и перехода в мои заказы
                return {
                    type: MY_PRODUCTS_CLEAR_MY_CART
                }
            }
        }
    }
})};

/**
 * Скрыть/показать виджет DDelivery
 * @param show: boolean
 * @returns {{type: *}}
 */
export const showDDWidget = ( show = true ) => ({
    type: MY_PRODUCTS_SHOW_DD_WIDGET,
    payload: show

});


/**
 * Проверяем доступен ли промокод
 * @param promo {string,number}
 * @param orderSetId {string}
 * @param reserveKey {string, null}
 * @param pinCode {string,null}
 * @returns {{type: string, payload: object}}
 */
export const checkPromoCodeAction = ( {promo, orderSetId, reserveKey = null, pinCode = null} ) => {

    return {
        type: PROMOCODE_CHECK,
        payload: {
            promocode: promo,
            orderset_id: orderSetId,
            actions: {
                inProgress: () => ({ type: 0 }),
                inFail: ( err ) => {
                    toast.error('Промокод не найден', {
                        autoClose: 3000
                    });
                },
                inSuccess: ( { response, request } ) => {
                    console.log('response CCC', response);


                    if ( !response.discountType ) {
                        console.error( 'Нет поля discount_type' );
                        return;
                    }

                    //если в нет подходящих альбомов
                    if ( !response.orderDiscountData.length ) {

                        let mgs = 'В заказе нет альбомов к которым можно применить данный промокод';
                        let time = 5000;
                        if ( response.discountType === 'promo_fixed' && response.validPriceMax ) {
                            mgs = `В заказе нет альбомов к которым можно применить данный промокод.
                                   Промокод действует на определенный формат и переплет в ценовом диапазоне от ${parseInt(response.validPriceMin)} ${TEXT.VALUE_RUB} до ${parseInt(response.validPriceMax)} ${TEXT.VALUE_RUB}`;
                            time = 10000;
                        }
                        toast.error( mgs, {
                            autoClose: time
                        });
                        return { type: 0 };
                    }

                    response.name = request.promocode;
                    return ({
                        type: PROMOCODE_SET,
                        payload: {
                            discountData: response,
                            reserveKey: reserveKey,
                            pinCode: pinCode
                        }
                    })

                }
            }
        }
    }
};


/**
 * Проверяем доступен ли промокод
 * @param coupon {string,number}
 * @returns {{type: string, payload: object}}
 */
// export const checkBiglionCodeAction = ( { promo, orderSetId, reserveKey, pinCode } ) => {
//
//     return ({
//         type: BIGLION_PROMOCODE_CHECK,
//         payload: {
//             //urlParams: [ 'coupon=' + coupon, 'orderSetId=' + orderSetId ],
//             coupon: promo,
//             orderset_id: orderSetId,
//             actions: {
//                 inProgress: () => ({ type: 0 }),
//                 inFail: () => {
//                     AppToaster.show( {
//                                          message: "Не верный номер купона",
//                                          intent: 'danger',
//                                          timeout: 3000,
//                                          icon: "error"
//                                      } );
//                 },
//                 inSuccess: ( { response, request } ) => {
//
//                     if (response && response.order_discount_data) {
//                         //если в нет подходящих альбомов
//                         if (!response.order_discount_data.length) {
//                             AppToaster.show( {
//                                                  message: "В заказе нет альбоков к которым можно применить данный купон",
//                                                  intent: 'danger',
//                                                  timeout: 5000,
//                                                  icon: "error"
//                                              } );
//                             return {type:0};
//                         }
//
//                         //устанавливаем скидку на альбом
//                         return({
//                             type: PROMOCODE_SET,
//                             payload: {
//                                 biglionData: response.order_discount_data,
//                                 coupon: promo,
//                                 reserveKey: reserveKey,
//                                 pinCode: pinCode
//                             }
//                         })
//                     }
//                 }
//             }
//         }
//     });
// };


/**
 * удапляем промокод
 * @returns {{type: *, payload: null}}
 */
export const clearPromoCodeAction = () => ({
    type: PROMOCODE_SET,
    payload: null
});
