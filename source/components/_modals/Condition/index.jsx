import React, { useEffect, useContext } from 'react';
import { useSelector } from "react-redux";

import WINDOW_TEXT from 'texts/condition';
import GIFT_CARD_RULES from 'texts/conditionRules';
import TEXT_MAIN from 'texts/main';
import {ModalContext} from 'components/Modal';
import {TYPES} from 'const/types';
import {modalConditionSelector} from 'selectors/modals'

/**
 * Содержимое модалки
 */
const Condition = (props) => {
    const {setModal, closeModal} = useContext(ModalContext);
    const modalCondition = useSelector( modalConditionSelector );
    const modalText = typeof modalCondition === 'object' ? GIFT_CARD_RULES : WINDOW_TEXT;

    useEffect(() => {
        setModal({
            footer: [
                {type: TYPES.DIVIDER},
                {type: TYPES.BTN, text: TEXT_MAIN.CLOSE, action: closeModal},
                {type: TYPES.DIVIDER},
            ],
            title: modalText.title
        });
    },[]);


    return <div dangerouslySetInnerHTML={{__html: modalText.text}}/>;
};

export default Condition;