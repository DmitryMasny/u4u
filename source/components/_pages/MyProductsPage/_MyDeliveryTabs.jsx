import React from 'react';
import { connect } from 'react-redux';

import FilterBtn from 'components/FilterBtn';

import s from './MyProductsPage.scss';
import { PackageIcon, MapPinIcon } from 'components/Icons/LineIcon';
import { IconDelivery } from 'components/Icons';

import TEXT_MY_PRODUCTS from 'texts/my_products';
import {
    MY_DELIVERY_PICKUP,
    MY_DELIVERY_DDELIVERY,
    MY_DELIVERY_U4U
} from 'const/myProducts';

import { myDeliveryTypeSelector } from "./selectors";
import { setMyDeliveryAction, } from "./actions";


const MyDeliveryTabs = (props) => {

    console.log('myDeliveryTypeSelector', props.myDeliveryTypeSelector);
    console.log('MY_DELIVERY_U4U', MY_DELIVERY_U4U);
    console.log('props.myDeliveryTypeSelector === MY_DELIVERY_U4U', props.myDeliveryTypeSelector === MY_DELIVERY_U4U);

    const handlerSetMyDeliveryType = ( type ) => {
        props.setMyDeliveryAction( {
            type: type
        } );
    };

    return (
        <div className={s.myDeliveryTabs}>
            <FilterBtn large
                       className={s.myDeliveryTab}
                       icon={<MapPinIcon/>}
                       active={props.myDeliveryTypeSelector === MY_DELIVERY_PICKUP}
                       onClick={() => handlerSetMyDeliveryType( MY_DELIVERY_PICKUP )}
            >
                {TEXT_MY_PRODUCTS.PICKUP}
            </FilterBtn>
            <FilterBtn large
                       className={s.myDeliveryTab}
                       icon={<IconDelivery/>}
                       active={props.myDeliveryTypeSelector === MY_DELIVERY_U4U}
                       onClick={() => handlerSetMyDeliveryType( MY_DELIVERY_U4U )}
            >
                {TEXT_MY_PRODUCTS.U4UDELIVERY}
            </FilterBtn>
            <FilterBtn large
                       className={s.myDeliveryTab}
                       icon={<PackageIcon/>}
                       active={props.myDeliveryTypeSelector === MY_DELIVERY_DDELIVERY}
                       onClick={() => handlerSetMyDeliveryType( MY_DELIVERY_DDELIVERY )}
            >
                {TEXT_MY_PRODUCTS.DDELIVERY}
            </FilterBtn>

            {/*<div className={s.myDeliveryTab}>
                        <div className={s.myDeliveryTabTitle}>{TEXT_MY_PRODUCTS.PICKUP}</div>
                        <div className={s.myDeliveryTabDesc}>
                            Доставка по России<br/>
                            Стоимость: бесплатно
                        </div>
                    </div>
                    <div className={s.myDeliveryTab}>
                        <div className={s.myDeliveryTabTitle}>{TEXT_MY_PRODUCTS.DDELIVERY}</div>
                        <div className={s.myDeliveryTabDesc}>
                            Доставка по России<br/>
                            Стоимость: бесплатно
                        </div>
                    </div>*/}
        </div>
    );
};

export default connect(
    state => ({
        myDeliveryTypeSelector: myDeliveryTypeSelector( state ),

    }),
    dispatch => ({
        setMyDeliveryAction: ( data ) => dispatch( setMyDeliveryAction( data ) ),

    })
)( MyDeliveryTabs);
