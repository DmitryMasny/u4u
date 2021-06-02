import React from 'react';
import { connect } from 'react-redux';

import { Btn } from 'components/_forms';

import s from './MyProductsPage.scss';
// import { timeConverter } from 'libs/converters'
import TEXT from 'texts/main';
import TEXT_MY_PRODUCTS from 'texts/my_products';
import { MY_DELIVERY_PICKUP } from 'const/myProducts';
import { numberToMoneyFormat } from 'libs/helpers';
import { modalOrderDeliveryInfoAction } from 'actions/modals';

/**
 * Инфо о доставке продукта в заказе
 */
const OrderDeliveryInfo = ( { delivery, totalCost, orderId, modalOrderDeliveryInfoAction } ) => {
    if ( !delivery ) return null;

    delivery.orderId = orderId;

    const deliveryPrice = parseInt( delivery.price ),
          deliveryLabel = delivery.deliveryType === MY_DELIVERY_PICKUP ?
                          TEXT_MY_PRODUCTS.PICKUP : TEXT_MY_PRODUCTS.DELIVERY_ADDRESS;

    return (
        <div className={s.deliveryInfoWrap}>
            <div className={`${s.deliveryInfo} ${s.deliveryInfoLeft}`}>
                { delivery.companyInfo && delivery.companyInfo.deliveryCompanyName &&
                <div className={s.deliveryInfoItem}>
                    <span className={s.deliveryInfoLabel}>{TEXT_MY_PRODUCTS.DELIVERY_INFO_COMPANY}: </span>
                    <a className={s.deliveryInfoLink} href={delivery.companyUrl} target="_blank">
                        {delivery.companyInfo.deliveryCompanyName}
                    </a>
                </div>}

                <div className={s.deliveryInfoItem}>
                    <span className={s.deliveryInfoLabel}>{deliveryLabel}: </span>
                    <span className={s.deliveryInfoText}>{delivery.address}</span>
                </div>

                { delivery.trackNumber &&
                <div className={s.deliveryInfoItem}>
                    <span className={s.deliveryInfoLabel}>{TEXT_MY_PRODUCTS.DELIVERY_TRACK_NUMBER}: </span>
                    <span className={s.deliveryInfoText}>{delivery.trackNumber}</span>
                </div>}

                <div className={s.deliveryInfoItem}>
                    <span className={s.deliveryInfoLabel}>{TEXT_MY_PRODUCTS.DELIVERY_TRACK_COST}: </span>
                    { deliveryPrice > 0 ?
                    <span className={s.deliveryInfoText}>{numberToMoneyFormat(deliveryPrice)} {TEXT.VALUE_RUB}</span>
                      :
                    <span className={s.deliveryInfoText}>{TEXT_MY_PRODUCTS.FREE_PRICE}</span>
                    }
                </div>
                {/*<div className={s.deliveryInfoItem}>
                    <span className={s.deliveryInfoLabel}>Статус:</span>
                    <span className={s.deliveryInfoText}>{delivery.address}</span>
                </div>*/}
            </div>

            <div className={`${s.deliveryInfo} ${s.deliveryInfoRight}`}>
                <div className={s.deliveryInfoItem}>
                    <span className={s.deliveryInfoLabel}>{TEXT_MY_PRODUCTS.ORDER_SUM}: </span>
                    <span className={s.deliveryInfoCost}>{numberToMoneyFormat(totalCost)} {TEXT.VALUE_RUB}</span>
                </div>
                <div className={s.deliveryInfoItem}>
                    <Btn small fill  className={s.deliveryInfoBtn} onClick={()=>modalOrderDeliveryInfoAction(delivery)}>{TEXT_MY_PRODUCTS.DELIVERY_INFO_BTN}</Btn>
                </div>
            </div>
        </div>);

};

export default connect(
    state => ({}),
    dispatch => ({
        modalOrderDeliveryInfoAction: ( obj ) => dispatch( modalOrderDeliveryInfoAction ( obj ) )
    })
)(OrderDeliveryInfo);