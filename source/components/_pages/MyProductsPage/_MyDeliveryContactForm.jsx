import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import TEXT_MY_PRODUCTS from 'texts/my_products';
import { myDeliverySelector, myDeliveryShowDDWidgetSelector } from "./selectors";
import { userGetDeliveryAction } from 'actions/user';
import { contactFormData } from 'config/delivery';
import DeliveryFormGroup from './_DeliveryFormGroup';
import s from './MyProductsPage.scss';


class MyDeliveryContactForm extends Component {

    UNSAFE_componentWillMount () {
        !this.props.myDeliverySelector.updated && this.props.userGetDeliveryAction();
    }

    shouldComponentUpdate ( nextProps ) {
        if (
            this.props.myDeliveryShowDDWidgetSelector !== nextProps.myDeliveryShowDDWidgetSelector ||
            this.props.myDeliverySelector.type !== nextProps.myDeliverySelector.type

        )  return true;
        return this.props.myDeliverySelector.updated !== nextProps.myDeliverySelector.updated;
    }

    render () {
        const { myDeliverySelector, myDeliveryShowDDWidgetSelector } = this.props;
        if ( !(myDeliverySelector && myDeliverySelector.type !== 'DDELIVERY') && myDeliveryShowDDWidgetSelector ) return null;

        return (
            <Fragment>
                <h3 className={s.myDeliveryHeader}>{TEXT_MY_PRODUCTS.CONTACT_INFO}</h3>

                <div className={s.myDeliveryContactForm}>
                    {contactFormData.map((item, key) => <DeliveryFormGroup data={item} key={key}/>)}
                </div>
            </Fragment>
        );
    }
}


export default connect(
    state => ({
        myDeliverySelector: myDeliverySelector( state ),
        myDeliveryShowDDWidgetSelector: myDeliveryShowDDWidgetSelector( state )
    }),
    dispatch => ({
        userGetDeliveryAction: ( ) => dispatch( userGetDeliveryAction( ) ),
    })
)( MyDeliveryContactForm );