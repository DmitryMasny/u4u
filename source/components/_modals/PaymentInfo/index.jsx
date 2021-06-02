import React, { useEffect, useContext } from 'react';
import styled from 'styled-components';

import {ModalContext} from 'components/Modal';
import {TYPES} from 'const/types';
import {IMG_DIR} from 'config/dirs'
import {useSelector} from "react-redux";
import {modalPaymentInfoSelector} from "selectors/modals";


/** Styles */
const PaymentImage = styled.img`
    margin-bottom: 15px;
`;

const PAYMENT_INFO_DATA = {
    decline: {
        title: 'Не удалось оплатить подарочный сертификат',
        src: `${IMG_DIR}common/payment_trouble@2x.png`,
        text: 'Если проблема повторяется, сообщите нам на support@u4u.ru'
    },
    accept: {
        title: 'Оплата успешно выполнена',
        src: `${IMG_DIR}common/payment_success@2x.png`,
        // text: 'Подарочный сертификат успешно оплачен!',
        btnText: 'Отлично!'
    }
};

/**
 *
 */
const PaymentInfo = (props) => {
    const {setModal, closeModal} = useContext(ModalContext);
    const modalSelector = useSelector(modalPaymentInfoSelector);

    const current = PAYMENT_INFO_DATA[modalSelector.decline ? 'decline' : 'accept'];

    useEffect(() => {
        setModal({
            footer: [
                {type: TYPES.DIVIDER},
                {type: TYPES.BTN, text: current.btnText || 'Ok', action: closeModal, primary: true},
                {type: TYPES.DIVIDER},
            ],
            title: current.title
        });
    },[]);


    if (!current) return null;

    return (
        <>
            <PaymentImage src={current.src}/>
            <h3>{current.title}</h3>
            {current.text && <p>{current.text}</p>}
            {modalSelector.amount && <p>Сумма: {modalSelector.amount}</p>}
            {modalSelector.to_email && <p>E-mail: {modalSelector.to_email}</p>}
            {modalSelector.to_phone && <p>Телефон: {modalSelector.to_phone}</p>}
        </>
    );
};

export default PaymentInfo;