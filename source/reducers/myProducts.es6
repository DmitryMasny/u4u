import {
    MY_PRODUCTS_GET_PRODUCTS,
    MY_PRODUCTS_GET_CART_COUNT,
    MY_PRODUCTS_SET_CART_COUNT,
    MY_PRODUCTS_GET_DELETED_PRODUCTS,
    MY_PRODUCTS_GET_ORDERS,
    MY_PRODUCTS_SET_PRODUCTS,
    MY_PRODUCTS_CHANGING_PRODUCT_COUNT,
    MY_PRODUCTS_CHANGING_PRODUCT_NAME,
    MY_PRODUCTS_MOVE_PRODUCT_TO_DELETED,
    MY_PRODUCTS_MOVE_PRODUCT_FROM_DELETED,
    MY_PRODUCTS_MOVE_PRODUCT_FROM_CART,
    MY_PRODUCTS_MOVE_PRODUCT_TO_CART,
    MY_PRODUCTS_TOGGLE_SHOW_DELIVERY,
    MY_PRODUCTS_SET_MY_DELIVERY,
    MY_PRODUCTS_CLEAR_MY_CART,
    MY_PRODUCTS_RESET_DEFAULT_STATE,
    PROMOCODE_CHECK,
    PROMOCODE_SET,
    MY_PRODUCTS_SET_DELIVERY_BOX_SIZE
} from 'const/actionTypes';

import { MY_PRODUCTS_NEW, MY_PRODUCTS_INORDER, MY_PRODUCTS_DELETED, MY_PRODUCTS_CART, MY_DELIVERY_PICKUP, MY_PRODUCTS_SHOW_DD_WIDGET } from 'const/myProducts';

import { toast } from '__TS/libs/tools';

import { setDeliveryInfoToLocalStorage } from 'libs/delivery';

/**
 * MyProducts
 */
const defaultState = {
    inProgress: false,
    showDelivery: false,
    [MY_PRODUCTS_NEW]: null,
    [MY_PRODUCTS_INORDER]: null,
    [MY_PRODUCTS_DELETED]: null,
    [MY_PRODUCTS_CART]: null,
    promoCodeInProgress: false,
    cartQuantity: null,
    maxPromoPrice: 0,
    mixPromoPrice: 0,
    reserveKey: null,
    promoCode: null,
    pinCode: null,
    useBiglion: false,
    usePromoCode: false,
};
/**
 * Калькуляция итоговой суммы заказа
 * @param orders
 * @returns {number}
 */

const calculateTotalCost = ( orders ) => {
    let totalCost = 0;

    orders.map( ( item ) => {
        const discount = parseInt(item.discount) || 0, //если есть скидка в процентах
              discountFixed = parseInt(item.discountFixed) || 0, //если есть фиксировання скидка
              discountGiftCard = parseInt(item.discountGiftCard) || 0, //если есть подарочный сертификат
              biglionDiscount = parseInt(item.biglionDiscount) || 0, //если есть скидка Biglion
              itemCost = parseFloat(item.info.price);

        if ( !discountFixed && !biglionDiscount && !discountGiftCard) {
            totalCost = totalCost + ((itemCost * (100 - discount) / 100) * item.count);
        } else if ( biglionDiscount ) {
            const bDiscount = itemCost - biglionDiscount;
            totalCost = totalCost + (bDiscount < 0 ? 0 : bDiscount) + itemCost * (item.count - 1);
        } else if (discountGiftCard) {
            const dFixed = itemCost*item.count - discountGiftCard;
            totalCost = totalCost + (dFixed < 0 ? 0 : dFixed);
        } else {
            const dFixed = itemCost - discountFixed;
            totalCost = totalCost + itemCost * (item.count - 1) + (dFixed < 0 ? 0 : dFixed);
        }

        if ( totalCost < 0 ) totalCost = 0;
    });

    return totalCost < 0 ? 0 : totalCost;
};

export function myProducts ( state = defaultState, { type, payload } ) {
    switch ( type ) {
        case PROMOCODE_CHECK:
            return { ...state,
                promoCode: defaultState.promoCode,
                promoCodeInProgress: true
            };
        case PROMOCODE_SET:
            //получаем тип скидки (promo, promo_fixed или biglion)
            const discountType = payload && payload.discountData.discountType;

            const isBiglion      = discountType === 'biglion';
            const isPromo        = discountType === 'promo_percent' ||
                                   discountType === 'uniq_discount' ||
                                   discountType === 'qty_discount';

            const isPromoFixed   = discountType === 'promo_fixed';
            const isGiftCard     = discountType === 'gift_card';
            const isPageDiscount = discountType === 'page_discount';

            //получаем массив с активнми скидками по промокоду
            const discountsArray = payload && payload.discountData.orderDiscountData || [];

            //получаем список родуктов
            let cartData = state[MY_PRODUCTS_CART];

            let usePromocode = false,
                useBiglion = false;

            //добавляем скидку (или убираем)
            if ( cartData && cartData.orders) {

                if (discountsArray.length) {
                    //выставляем скидку
                    cartData.orders.map( ( order ) => {

                        //скидка по купону Biglion
                        if ( isBiglion && order.id === discountsArray[ 0 ].orderId ) {
                            const cost = order.const / order.count;
                            order.biglionDiscount = parseInt( (discountsArray[ 0 ].discountSum < cost ? cost : discountsArray[ 0 ].discountSum) );
                            if ( order.biglionDiscount ) useBiglion = true;
                        } else {
                            order.biglionDiscount = 0;
                        }

                        //скидка по промокоду
                        if ( isPromo || isPromoFixed ) {

                            for ( let d = 0; d < discountsArray.length; d++ ) {

                                if ( order.id === discountsArray[ d ].orderId ) {

                                    order.discount = 0;
                                    order.discountFixed = 0;

                                    if ( isPromo ) {
                                        order.discount = discountsArray[ d ].discountPercent;
                                    } else if ( isPromoFixed ) {
                                        order.discountFixed = discountsArray[ d ].discountSum;
                                    }

                                    if ( order.discount || order.discountFixed ) usePromocode = true;
                                }
                            }
                        }

                        //скидка по промокоду
                        if ( isGiftCard || isPageDiscount ) {

                            for ( let d = 0; d < discountsArray.length; d++ ) {

                                if ( order.id === discountsArray[ d ].orderId ) {
                                    order.discountGiftCard = discountsArray[ d ].discountSum;

                                    if ( order.discountGiftCard ) usePromocode = true;
                                }
                            }
                        }
                    } );
                } else {
                    cartData.orders.map((order) => {
                        order.discount = 0;
                        order.discountFixed = 0;
                        order.biglionDiscount = 0;
                        order.discountGiftCard = 0;
                    });
                }

                //считаем сумму
                cartData.totalCost = calculateTotalCost( cartData.orders );

                if ( (isPromo || isPromoFixed) && !usePromocode && !isPageDiscount) {
                    toast.error('В корзине нет продуктов к которым можно применить данный промокод', {
                        autoClose: 3000
                    });
                }
                if ( isBiglion && !useBiglion ) {
                    toast.error('В корзине нет продуктов к которым можно применить данный купон', {
                        autoClose: 3000
                    });
                }

            }
            return { ...state,
                maxPromoPrice: 0,
                mixPromoPrice: 0,
                useBiglion: useBiglion,
                usePromoCode: usePromocode,
                //promoCode: isBiglion && useBiglion && payload.discountData.name || (isPromo || isPromoFixed) && usePromocode && payload.discountData.name || null,
                promoCode:  payload && payload.discountData.name || null,
                pinCode: useBiglion && payload.pinCode || null,
                reserveKey: useBiglion && payload.reserveKey || null,
                promoCodeInProgress: false,
                [MY_PRODUCTS_CART]: cartData
            };

        case MY_PRODUCTS_SET_PRODUCTS:
            let xx = { inProgress: false };

            for ( let tab of payload.tabs ) xx[ tab ] = payload[ tab ];

            //для корзины считаем стоимость
            if ( xx[ MY_PRODUCTS_CART ] && xx[ MY_PRODUCTS_CART ].orders ) {
                xx[ MY_PRODUCTS_CART ].totalCost = calculateTotalCost( xx[ MY_PRODUCTS_CART ].orders );
                xx.cartQuantity = xx[ MY_PRODUCTS_CART ].orders.length;
            }

            return { ...state, ...xx };

        case MY_PRODUCTS_GET_PRODUCTS:
        case MY_PRODUCTS_GET_DELETED_PRODUCTS:
        case MY_PRODUCTS_GET_ORDERS:
            return { ...state, inProgress: true };

        case MY_PRODUCTS_GET_CART_COUNT:
            return { ...state, cartQuantity: -1 };

        case MY_PRODUCTS_SET_CART_COUNT:
            return { ...state, cartQuantity: payload };

        case MY_PRODUCTS_MOVE_PRODUCT_TO_CART:
            if ( !payload ) return { ...state, inProgress: false };
            return { ...state,
                cartQuantity: state.cartQuantity + 1,
                [MY_PRODUCTS_CART]: null,
                [MY_PRODUCTS_NEW]: filterProducts(state[MY_PRODUCTS_NEW], payload),
            };
        case MY_PRODUCTS_MOVE_PRODUCT_FROM_CART:
            const products = filterProducts( state[ MY_PRODUCTS_CART ], payload.id );
            products.totalCost = calculateTotalCost( products.orders );

            return { ...state,
                cartQuantity: state.cartQuantity === 0 ? 0 : state.cartQuantity - 1,
                [MY_PRODUCTS_NEW]: null,
                [MY_PRODUCTS_CART]: products
            };

        case MY_PRODUCTS_MOVE_PRODUCT_TO_DELETED:
            return { ...state, [MY_PRODUCTS_DELETED]: null, [MY_PRODUCTS_NEW]: filterProducts(state[MY_PRODUCTS_NEW], payload)  };

        case MY_PRODUCTS_MOVE_PRODUCT_FROM_DELETED:
            return { ...state, [MY_PRODUCTS_NEW]: null, [MY_PRODUCTS_DELETED]: filterProducts(state[MY_PRODUCTS_DELETED], payload)  };

        case MY_PRODUCTS_CHANGING_PRODUCT_COUNT:
            let cart = { ...state[ MY_PRODUCTS_CART ] };//, totalCost: payload.totalCost

            for ( let i = 0; i < cart.orders.length; i++ ) {
                if ( cart.orders[ i ].id === payload.order.id ) {
                    cart.orders[i] = { ...cart.orders[i], ...payload.order };
                    break;
                }
            }

            cart.totalCost = calculateTotalCost( cart.orders );

            return { ...state, [ MY_PRODUCTS_CART ]: cart };

        case MY_PRODUCTS_CHANGING_PRODUCT_NAME:
            return {
                ...state,
                [ MY_PRODUCTS_NEW ]: state[ MY_PRODUCTS_NEW ].map( ( item ) => item.id === payload.id ? { ...item, ...payload } : item )
            };

        case MY_PRODUCTS_TOGGLE_SHOW_DELIVERY:
            return { ...state, showDelivery: (payload === undefined) ?  !state.showDelivery : payload };

        case MY_PRODUCTS_CLEAR_MY_CART:
            return { ...state, [ MY_PRODUCTS_CART ]: null, [ MY_PRODUCTS_INORDER ]: null, showDelivery: false };

        case MY_PRODUCTS_RESET_DEFAULT_STATE:
            return defaultState;

        default:
            return state;
    }
}

// Поиск и удаление продукта в нужном разделе при его удалении или переносе в другой раздел
const filterProducts = ( tab, id ) => {
    if ( tab.orders ) {
        tab.orders = tab.orders.filter( product => product.id !== id );
        return tab;
    }

    return tab.filter( product => product.id !== id );
};

/**
 * MyDelivery
 */
const defaultDeliveryState = {
    type: MY_DELIVERY_PICKUP,
    showDDWidget: true,
    name: '',
    surname: '',
    fathername: '',
    email: '',
    phone: '',
    comments: '',
    localStorageChecked: false
};

export function delivery ( state = defaultDeliveryState, { type, payload } ) {
    switch ( type ) {
        case MY_PRODUCTS_SET_MY_DELIVERY:
            const mergerData = { ...state, ...payload };
            if ( state.localStorageChecked ) {
                setDeliveryInfoToLocalStorage( mergerData );
            }
            return mergerData;
        case MY_PRODUCTS_SHOW_DD_WIDGET:
            const data = {
                showDDWidget: payload
            };
            if ( payload ) data.sessionId = null;
            return { ...state, ...data };
        case MY_PRODUCTS_SET_PRODUCTS:
            if ( payload.delivery ) {
                return { ...state, delivery: payload.delivery }
            }
            return state;
        case MY_PRODUCTS_SET_DELIVERY_BOX_SIZE:
            if ( payload ) {
                return { ...state, delivery: {
                        ...state.delivery,
                        boxSize: payload
                    } }
            }
            return state;
        default:
            return state;
    }
}