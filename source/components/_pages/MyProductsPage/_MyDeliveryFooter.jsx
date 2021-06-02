import React, { Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Btn } from 'components/_forms';

import s from './MyProductsPage.scss';
import { IconArrowBack } from 'components/Icons';

import LINKS_MAIN from "config/links";
import TEXT_MY_PRODUCTS from 'texts/my_products';
import TEXT from 'texts/main';
import {
    MY_PRODUCTS_NEW,
    MY_PRODUCTS_INORDER,
    MY_PRODUCTS_DELETED,
    MY_PRODUCTS_CART,
    MY_DELIVERY_PICKUP,
    MY_DELIVERY_U4U,
    MY_DELIVERY_DDELIVERY
} from 'const/myProducts';
import {
    myDeliverySelector,
    promoCodeSelector,
    promoReservedKeySelector,
    useBiglionSelector,
    usePromoCodeSelector,
    promoPinCodeSelector,
    myDeliveryCommentsSelector,
    cartSelector
} from "./selectors";
import {
    toggleShowDeliveryAction,
    sendNewOrderToServerAction,
    setMyDeliveryAction,
    getProductsFromServerAction
} from "./actions";

import { getDeliveryInfoToLocalStorage } from 'libs/delivery';

import { contactFormData, addressFormData } from 'config/delivery';

import { validateArray, convertValidationToStoreObject, getMostImportantText } from 'libs/validators';

import { toast } from '__TS/libs/tools';

import { numberToMoneyFormat } from 'libs/helpers';
import { getPhoneFormatFor10 } from 'libs/converters';

import { modalConditionAction } from 'actions/modals';
import { userSendDeliveryAction } from 'actions/user';

import { ORDER_PAY } from 'const/metrics'
import sendMetric from 'libs/metrics'
import { scrollToTop } from 'libs/helpers';

import postSend from 'libs/postSend';

/**
 * Проверям доставка,
 * @param cart
 * @param delivery
 * @param callback
 * @param promoCode
 * @param usePromoCode
 * @param useBiglion
 * @param promoReservedKey
 * @param promoPinCode
 * @returns {{fio_name: *, fio_surname: (*|string), fio_fathername: (string|*), to_phone: *, to_email: *, orderInfo: {id: *, orders: {id: *}[]}, callback: *, type: *, delivery_sum: (*|(number)), delivery_company_id: *, pickup_company_id: *, delivery_point_id: *, city: *, to_city_id: *, to_street: *, to_house: *, to_flat: *, company_info: (o.company_info|{name, to_city_id, city}|{to_city_id, to_street, to_house, to_flat, city}|null|*|{})}}
 */
const checkDeliveryData = ( { cart, delivery, callback, promoCode, usePromoCode, useBiglion, promoReservedKey, promoPinCode, comments } ) => {
    const orders = cart.orders.map( ( order ) => ({ id: order.id }) );

    let deliveryTypeData = {};

    if ( delivery.type === MY_DELIVERY_PICKUP ) {
        deliveryTypeData = {
            type: MY_DELIVERY_PICKUP,
            deliverySum: 0,
        };
    } else if ( delivery.type === MY_DELIVERY_U4U ) {
        if (delivery.addressObj && delivery.addressObj.address) {
            deliveryTypeData = {
                type: MY_DELIVERY_U4U,
                deliverySum: delivery.addressObj.price || 0,
                to_zone: `ZONE_${delivery.addressObj.zoneId}`,
                to_street: delivery.addressObj.address,
                to_house: delivery.addressObj.building,
                to_pd: delivery.addressObj.pd,
                to_floor: delivery.addressObj.floor,
                to_flat: delivery.addressObj.flat,
            };
        } else deliveryTypeData = {
            type: MY_DELIVERY_U4U,
            deliverySum: 0,
        };
    } else {
        deliveryTypeData = {
            type: delivery.deliveryType,
            deliverySum: delivery.price || 0,
            deliveryCompanyId: delivery.deliveryCompanyId,
            pickupCompanyId: delivery.pickupCompanyId,
            deliveryPointId: delivery.deliveryPointId,
            city: delivery.cityName,
            toCityId: delivery.toCityId,
            toStreet: delivery.toStreet,
            toHouse: delivery.toHouse,
            toFlat: delivery.toFlat,
            companyInfo: delivery.companyInfo
        };
    }

    //если есть индекс то шлем
    if ( delivery.toPostalCode && delivery.toPostalCode.length ) {
        deliveryTypeData.toPostalCode = delivery.toPostalCode;
    }

    //если есть промокод, добавляем его в запрос
    if ( usePromoCode && promoCode && promoCode.toString().length ) {
        deliveryTypeData.promocode = promoCode;
    }

    //если есть biglion, добавляем его в запрос
    if ( useBiglion && promoCode && promoCode.toString().length ) {
        deliveryTypeData.promocode = promoCode;
        deliveryTypeData.reserveCode = promoReservedKey;
        deliveryTypeData.pinCode = promoPinCode;
    }

    return {
        comment: comments || "",
        fioName: delivery.name,
        fioSurname: delivery.surname,
        fioFathername: delivery.fathername,
        toPhone: getPhoneFormatFor10( delivery.phone ),
        toEmail: delivery.email,
        orderInfo: {
            id: cart.id,
            orders: orders
        },
        callback: callback,

        ...deliveryTypeData
    };
};

const payIsDisabled = ( delivery ) => {
    if (delivery.type === MY_DELIVERY_U4U) return !delivery.addressObj || !delivery.addressObj.zoneId || !delivery.addressObj.address || !delivery.addressObj.building || delivery.addressObj.notAvaible ;
    return ((delivery.type === MY_DELIVERY_DDELIVERY) && !delivery.sessionId)
};

let checkedDeliveryLocalStorage = false;
const MyDeliveryFooter = ( props ) => {

    const {
        cartData,
        usePromoCodeSelector,
        useBiglionSelector,
        myDeliverySelector,
        promoCodeSelector,
        promoReservedKeySelector,
        promoPinCodeSelector,
        userSendDelivery,
        myDeliveryCommentsSelector
    } = props;

    const goToNewOrders = ( link ) => {
        const cart = props.cartSelector;

        cart.orders = cart.orders.map( order => {
            delete (order.previewCover);
            return (order);
        } );

        localStorage.setItem( 'cart_data', JSON.stringify( cart ) );

        if ( link ) {
            postSend( link );
            //window.location.replace( link );
        } else props.history.push( LINKS_MAIN.MY_PRODUCTS.replace( /:tab/, MY_PRODUCTS_INORDER ) + '/' );
    };

    const sendData = checkDeliveryData( {
                                            cart: cartData,
                                            delivery: myDeliverySelector,
                                            promoCode: promoCodeSelector,
                                            usePromoCode: usePromoCodeSelector,
                                            useBiglion: useBiglionSelector,
                                            promoReservedKey: promoReservedKeySelector,
                                            promoPinCode: promoPinCodeSelector,
                                            comments: myDeliveryCommentsSelector.toString().trim(),
                                            callback: goToNewOrders
                                        } );

    const totalPrice = sendData.deliverySum + props.cartData.totalCost;

    if ( !checkedDeliveryLocalStorage ) {
        checkedDeliveryLocalStorage = true;
        const dData = getDeliveryInfoToLocalStorage( { id: props.cartData.id, totalCost: props.cartData.totalCost } );
        props.setMyDeliveryAction( dData );
    }

    //проверка заполнения данных доставки
    const checkContactsData = () => {
        const data = props.myDeliverySelector;
        if ( !data ) return;

        sendMetric( ORDER_PAY );

        //проводим валидацию по полям
        const errors = validateArray( { instructionArray: contactFormData, sourceData: data } );

        //проводим валидацию по полям
        const addressErrors = data.type === MY_DELIVERY_U4U && validateArray( { instructionArray: addressFormData, sourceData: data.addressObj || {} } );

        if ( !errors && !addressErrors ) {
            //если нет ошибок то шлем на сервер запрос на получение ссылки на заказ
            props.sendNewOrderToServerAction( sendData );

            userSendDelivery( {
                                        name: myDeliverySelector.name,
                                        surname: myDeliverySelector.surname,
                                        fathername: myDeliverySelector.fathername,
                                        phone: myDeliverySelector.phone,
                                        email: myDeliverySelector.email,
                                        comments: myDeliverySelector.comments,
                                        address: myDeliverySelector.addressObj || myDeliverySelector.address,
                                    } );

            if ( props.cartData.totalCost === 0 ) props.getProductsFromServerAction( MY_PRODUCTS_INORDER );
        } else {
            //показываем тостер с необходимым тестом
            errors && toast.error(getMostImportantText( errors ), {
                autoClose: 5000
            });
            //показываем тостер с необходимым тестом
            addressErrors && toast.error(getMostImportantText( addressErrors ), {
                autoClose: 5000
            });

            //выставляем ошибки в redux state
            props.setMyDeliveryAction( {...(convertValidationToStoreObject( errors ) || {}), addressErrors: addressErrors} );
        }
    };

    return (
        <Fragment>
            <div className={s.myDeliveryFooter}>
                <Btn large
                        className={s.myDeliveryFooterBtnBack}
                        icon={<IconArrowBack/>}
                        onClick={() => {
                            scrollToTop( { scrollDuration: 0 } );
                            props.toggleShowDeliveryAction( false )
                        }}
                >
                    {TEXT_MY_PRODUCTS.GO_TO_CART}
                </Btn>

                <div className={s.myDeliveryFooterSum}>
                    <span className={s.myDeliveryFooterSumLabel}>{TEXT_MY_PRODUCTS.ORDER_SUM}:&nbsp;</span>
                    <span className={s.myDeliveryFooterSumValue}>{` ${numberToMoneyFormat( totalPrice )} ${TEXT.VALUE_RUB}`}</span>
                </div>

                <Btn intent="primary" large
                        className={s.myDeliveryFooterBtn}
                        onClick={() => checkContactsData()}
                        disabled={payIsDisabled( props.myDeliverySelector )}
                >
                    {totalPrice ?
                        TEXT_MY_PRODUCTS.PAY
                        :
                        TEXT_MY_PRODUCTS.MAKE_ORDER
                    }
                </Btn>

                <div className={s.myDeliveryConditions}>
                    <span className={s.myDeliveryFooterConditionsText}>{TEXT_MY_PRODUCTS.USER_CONDITION_TEXT}</span>
                    <a onClick={() => props.modalConditionAction( true )}>{TEXT_MY_PRODUCTS.USER_CONDITION_LINK}</a>
                </div>
            </div>

        </Fragment>
    );
};

export default withRouter( connect(
    state => ({
        myDeliveryCommentsSelector: myDeliveryCommentsSelector( state ),
        myDeliverySelector: myDeliverySelector( state ),
        promoCodeSelector: promoCodeSelector( state ),
        usePromoCodeSelector: usePromoCodeSelector( state ),
        useBiglionSelector: useBiglionSelector( state ),
        promoReservedKeySelector: promoReservedKeySelector( state ),
        promoPinCodeSelector: promoPinCodeSelector( state ),
        cartSelector: cartSelector( state )
    }),
    dispatch => ({
        getProductsFromServerAction: ( tab ) => dispatch( getProductsFromServerAction( tab ) ),
        setMyDeliveryAction: ( data ) => dispatch( setMyDeliveryAction( data ) ),
        toggleShowDeliveryAction: ( show ) => dispatch( toggleShowDeliveryAction( show ) ),
        sendNewOrderToServerAction: ( data ) => dispatch( sendNewOrderToServerAction( data ) ),
        userSendDelivery: ( data ) => dispatch( userSendDeliveryAction( data ) ),
        modalConditionAction: ( show ) => dispatch( modalConditionAction( show ) )
    })
)( MyDeliveryFooter ) );
