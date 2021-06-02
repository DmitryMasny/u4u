import React, { useEffect, useContext } from 'react';
import { useSelector } from "react-redux";
import { modalDeleteConfirmSelector } from 'selectors/modals';

import TEXT_MAIN from 'texts/main';
import {ModalContext} from 'components/Modal';
import {TYPES} from 'const/types';

/**
 * Подтверждение удаления фотографии
 */
const DeleteConfirm = (props) => {
    const {setModal, closeModal} = useContext(ModalContext);
    const deleteConfirmSelector = useSelector(modalDeleteConfirmSelector);

    // Кнопка "Да"
    const confirmAction = () => {
        deleteConfirmSelector && deleteConfirmSelector.callback && deleteConfirmSelector.callback();
        closeModal();
    };
    useEffect(() => {
        setModal({
            footer: [
                {type: TYPES.DIVIDER},
                {type: TYPES.BTN, text: TEXT_MAIN.CANCEL, modalClosingBtn: true },
                {type: TYPES.BTN, text: TEXT_MAIN.YES, action: confirmAction, primary: true},
            ]
        });
    },[]);


    return deleteConfirmSelector && deleteConfirmSelector.text;
};

export default DeleteConfirm;