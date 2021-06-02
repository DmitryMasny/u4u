import React, { Fragment, memo } from 'react';
import { connect } from 'react-redux';

import { Btn } from 'components/_forms';

//import { PageTitle, Wrapper } from 'components/Page';

import s from './MyProductsPage.scss';
//import { IconEdit,IconChevronRight,IconBack,IconArrowBack,IconCheck } from 'components/Icons';
//import { PackageIcon,MapPinIcon } from 'components/Icons/LineIcon';

import TEXT_MY_PRODUCTS from 'texts/my_products';
import { MY_PRODUCTS_NEW, MY_PRODUCTS_INORDER, MY_PRODUCTS_DELETED, MY_PRODUCTS_CART, MY_DELIVERY_PICKUP, MY_DELIVERY_DDELIVERY, MY_DELIVERY_U4U } from 'const/myProducts';

import { myDeliverySelector, myDeliveryTypeSelector, myDeliveryShowDDWidgetSelector, myDeliveryAddressSelector, myDeliveryCompanyDataSelector, myDeliveryPriceSelector, myDeliveryDeliveryIsPVZ } from "./selectors";
import { setMyDeliveryAction, showDDWidget } from "./actions";
import DDeliveryWidget from "components/DDeliveryWidget";
import U4UDelivery from './_U4UDelivery';

import { modalContactsMapAction } from 'actions/modals';



/**
 * Содержимое исходя из выбранного типа доставки
 * @param props{{cartData: object}}
 * @returns {*}
 */
const MyDeliveryContent = ( props ) => {
    switch ( props.myDeliveryTypeSelector ) {

        //Забор из офиса
        case MY_DELIVERY_PICKUP:
            return (
                <div className={s.myDeliveryPickup}>
                    <p>{TEXT_MY_PRODUCTS.DELIVERY_OFFICE_TEXT}</p>
                    <p className={s.myDeliveryPickupAddress}>
                        <span style={{display:'block'}}>{TEXT_MY_PRODUCTS.DELIVERY_OFFICE_ADDRESS}</span>
                        <Btn intent="info" className={s.myDeliveryPickupBtn} onClick={()=>props.modalContactsMapAction( true )}>
                            {TEXT_MY_PRODUCTS.DELIVERY_OFFICE_SHOW_MAP}
                        </Btn>
                    </p>
                    <p>{TEXT_MY_PRODUCTS.DELIVERY_OFFICE_DESC}</p>
                </div>);

        //Доставка DDelivery
        case MY_DELIVERY_DDELIVERY:
            return (
                <Fragment>
                { props.myDeliveryShowDDWidgetSelector
                    ?
                    <div className={s.myDeliveryWidget}>
                        <DDeliveryWidget
                            cartData={props.cartData}
                            deliveryData={props.myDeliverySelector}
                            setDeliveryAction={props.setMyDeliveryAction}
                        />
                    </div>
                    :
                    <div className={s.myDeliveryPickup}>
                        {props.myDeliveryDeliveryIsPVZ
                            ?
                            <Fragment>
                                <p>Доставка в пункт самовывоза
                                    компании: <span>{props.myDeliveryCompanyDataSelector.name}</span></p>
                                <p className={s.myDeliveryPickupAddress}>Адрес пунтка самовывоза: <span>{props.myDeliveryAddressSelector}</span></p>
                            </Fragment>
                            :
                            <Fragment>
                                <p>Курьерская доставка
                                    компанией: <span>{props.myDeliveryCompanyDataSelector.name}</span></p>
                                <p className={s.myDeliveryPickupAddress}>Адрес назначения: <span>{props.myDeliveryAddressSelector}</span></p>
                            </Fragment>
                        }
                        <p>Стоимость доставки: <span>{props.myDeliveryPriceSelector} руб.</span></p>
                        <Btn intent="info" className={s.myDeliveryPickupBtn} onClick={()=>props.showDDWidget(true)}>
                            Изменить данные доставки
                        </Btn>
                    </div>
                }
                </Fragment>
            );
        case MY_DELIVERY_U4U:
            const changeDeliveryDataHandler = (data) => {
                if (data.type) {
                    props.setMyDeliveryAction(data);
                } else props.setMyDeliveryAction({
                    addressObj: {...props.myDeliverySelector.addressObj, ...data},
                    addressErrors: {},
                });
            };
            return <U4UDelivery changeDeliveryData={changeDeliveryDataHandler} addressObj={props.myDeliverySelector.addressObj} errors={props.myDeliverySelector.addressErrors}/>;

    }

    return null;
};

export default memo(connect(
    state => ({
        myDeliverySelector: myDeliverySelector( state ),
        myDeliveryTypeSelector: myDeliveryTypeSelector( state ),
        myDeliveryShowDDWidgetSelector: myDeliveryShowDDWidgetSelector( state ),
        myDeliveryCompanyDataSelector: myDeliveryCompanyDataSelector( state ),
        myDeliveryAddressSelector: myDeliveryAddressSelector( state ),
        myDeliveryPriceSelector: myDeliveryPriceSelector( state ),
        myDeliveryDeliveryIsPVZ: myDeliveryDeliveryIsPVZ( state )
    }),
    dispatch => ({
        setMyDeliveryAction: ( o ) => { dispatch( setMyDeliveryAction( o )); dispatch(showDDWidget(false)); },
        showDDWidget:        ( show ) => dispatch( showDDWidget( show ) ),
        modalContactsMapAction: ( show ) => dispatch( modalContactsMapAction( show ) )

    })
)( MyDeliveryContent) );
