// @ts-ignore
import React, { memo} from 'react';
// @ts-ignore
import {createPortal} from "react-dom";
// @ts-ignore
import {TYPES} from 'const/types';
// @ts-ignore
import TEXT_MAIN from 'texts/main';
// @ts-ignore
import Modal from 'components/Modal';



/** Interfaces */
interface I_DialogOverwriteConfirm {
    isOpen: boolean;        // показывать модалку
    text?: string;           // текст модалки
    closeCallback: (agree?:boolean)=>any;        // закрыть модалку
}

/**
 * Модалка создания стикерпака
 */
const DialogOverwriteConfirm: React.FC<I_DialogOverwriteConfirm> = ({isOpen, text, closeCallback}) => {
    if (!isOpen) return null;

    const modalFooter = [
        {type: TYPES.BTN, text: TEXT_MAIN.CANCEL, action: ()=>closeCallback() },
        {type: TYPES.DIVIDER},
        {type: TYPES.BTN, text: TEXT_MAIN.YES, action: ()=>closeCallback(true), primary: true },
    ];

    return createPortal(
        // @ts-ignore
        <Modal size={'xs'} title={'Подтвердите действие'} isOpen={isOpen} action={closeCallback} footer={modalFooter}>
            {text || 'Вы уверены, что хотите перезаписать формат темы?'}
        </Modal>,
        document.getElementById( 'spa-top' )
    );
};

export default memo(DialogOverwriteConfirm);



