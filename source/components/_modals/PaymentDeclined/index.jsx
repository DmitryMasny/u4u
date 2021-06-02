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
 * Оплата не удалась
 */
const PaymentDeclined = (props) => {
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
            <PaymentImage src={`${IMG_DIR}common/payment_trouble.png`} srcSet={`${IMG_DIR}common/payment_trouble@2x.png 2x`}/>
            <p>К сожалению, оплата не была произведена. Попробуйте повторить платеж.</p>
        </Fragment>
    );
};

export default PaymentDeclined;