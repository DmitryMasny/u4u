import React, { Component, Fragment, memo } from 'react';

import { PageTitle, Wrapper } from 'components/Page';
import MyDeliveryTabs from './_MyDeliveryTabs';
import MyDeliveryContent from './_MyDeliveryContent';
import MyDeliveryContactForm from './_MyDeliveryContactForm';
import MyDeliveryFooter from './_MyDeliveryFooter';

import s from './MyProductsPage.scss';
import TEXT_MY_PRODUCTS from 'texts/my_products';


/**
 * Оформление доставки
 */
const MyDelivery = ( { cartData } ) => {
    //
    // const handlerSetMyDelivery = ( option, value ) => {
    //     console.log( 'option', option );
    //     console.log( 'value', value );
    //     this.props.setMyDeliveryAction( {
    //         [option]: value
    //     } );
    // };
    //console.log('cartData',cartData);
    if ( !cartData ) return null;
    //console.log('this.props.cartData ',cartData );

    return (
        <Fragment>
            <PageTitle className={s.myDeliveryTitle}>{TEXT_MY_PRODUCTS.MY_DELIVERY}</PageTitle>
            <Wrapper className={s.myDelivery}>
                <h3 className={s.myDeliveryHeader}>Способ доставки</h3>

                <MyDeliveryTabs/>

                <MyDeliveryContent cartData={cartData}/>

                <MyDeliveryContactForm/>

                <MyDeliveryFooter cartData={cartData}/>

            </Wrapper>
        </Fragment>);
};


export default memo( MyDelivery );
