import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import InputMask from 'react-input-mask';

import { Input, TextArea } from 'components/_forms';


import s from './MyProductsPage.scss';

import { myDeliverySelector } from "./selectors";
import { setMyDeliveryAction, } from "./actions";
import TEXT from "../../../texts/main";


class DeliveryFormGroup extends Component {

    shouldComponentUpdate ( nextProps ) {
        const name = this.props.data.name;
        if (this.props.myDeliverySelector['error_' + name] !== nextProps.myDeliverySelector['error_' + name] ) return true;
        return this.props.myDeliverySelector[name] !== nextProps.myDeliverySelector[name];
    }

    handlerSetMyDelivery = ( name, value ) => {
        this.props.setMyDeliveryAction( {
                                 [name]: value,
                                 ['error_' + name]: null
                             } );
    };

    render () {
        const { data, myDeliverySelector } = this.props;

        return data.textArea ?
            <TextArea
                error={myDeliverySelector['error_' + data.name]}
                label={data.label + (data.require ? '*' : '')}
                onChange={(e) => this.handlerSetMyDelivery(data.name, e.target.value)}
                value={myDeliverySelector[data.name]}
                maxLength={data.maxLength}
                className={`${s.myDeliveryFormGroup} ${s[data.className] || ''}`}
            />
            :
            <Input
                error={myDeliverySelector['error_' + data.name]}
                label={data.label + (data.require ? '*' : '')}
                onChange={(e) => this.handlerSetMyDelivery(data.name, e.target.value)}
                value={myDeliverySelector[data.name]}
                mask={data.mask} // TODO: mask!
                className={`${s.myDeliveryFormGroup} ${s[data.className] || ''}`}
            />;
    }
}
export default connect(
    state => ({
        myDeliverySelector: myDeliverySelector( state ),
    }),
    dispatch => ({
        setMyDeliveryAction: ( data ) => dispatch( setMyDeliveryAction( data ) ),
    })
)( DeliveryFormGroup );
