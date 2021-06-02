import React, { useEffect, useContext, useState, memo } from 'react';
import { useSelector, useDispatch } from "react-redux";

import { modalAdminDialogAction } from 'actions/modals';
import { modalAdminDialogSelector } from 'selectors/modals';

import {ModalContext} from 'components/Modal';
import {TYPES} from 'const/types';
import TEXT_MAIN from 'texts/main';

/**
 *  Модалка для админки
 */
const AdminDialogModal = (props) => {
    const {setModal, closeModal} = useContext(ModalContext);
    const AdminDialogSelector = useSelector(modalAdminDialogSelector);

    const confirmActionF = () => {
        AdminDialogSelector.confirmAction && AdminDialogSelector.confirmAction(AdminDialogSelector.contentData);
        closeModal();
    };
    useEffect(() => {
        setModal({
            size: AdminDialogSelector.size,
            title: AdminDialogSelector.title,
            footer: [
                {type: TYPES.BTN, text: TEXT_MAIN.CANCEL, action: closeModal},
                {type: TYPES.BTN, text: TEXT_MAIN.APPLY, action: confirmActionF, primary: true,  disabled: AdminDialogSelector.disabled},
            ]
        });
    },[AdminDialogSelector]);

    return AdminDialogSelector.content || null;
};

export default AdminDialogModal;