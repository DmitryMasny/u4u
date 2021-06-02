import React, { useEffect, useContext, Fragment } from 'react';
import styled from 'styled-components';

import {ModalContext} from 'components/Modal';
import {TYPES} from 'const/types';
import {IMG_DIR} from 'config/dirs'


/** Styles */
const PaymentImage = styled.img`
    margin-bottom: 15px;
`;

/**
 * Оплата успешно выполнена
 */
const PaymentAccepted = (props) => {
    const {setModal, closeModal} = useContext(ModalContext);

    useEffect(() => {
        const modalFooter = [
            {type: TYPES.DIVIDER},
            {type: TYPES.BTN, text: 'Отлично!', action: closeModal, primary: true},
            {type: TYPES.DIVIDER},
        ];
        setModal({
            footer: modalFooter
        });
    },[]);


    return (
        <Fragment>
            <PaymentImage src={`${IMG_DIR}common/payment_success.png`} srcSet={`${IMG_DIR}common/payment_success@2x.png 2x`}/>
            <p>Ваш заказ передан в работу. По готовности заказа, мы пришлем вам SMS уведомление. </p>
            <p>Спасибо, что вы с нами! </p>
        </Fragment>
    );
};

export default PaymentAccepted;