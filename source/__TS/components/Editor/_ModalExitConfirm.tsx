// @ts-ignore
import React, {memo} from 'react';
// @ts-ignore
import {createPortal} from "react-dom";

// @ts-ignore
import {TYPES} from 'const/types';
// @ts-ignore
import Modal from 'components/Modal';


/** Interfaces */
interface IModalExitConfirm {
    modalData: any;
    closeCallback: ()=>any;        // закрыть модалку
}


/**
 * Модалка создания набора фонов
 */
const ModalExitConfirm: React.FC<IModalExitConfirm> = ({modalData, closeCallback}) => {
    if (!modalData || !modalData.callback) return null;

    const modalFooter = [
        {type: TYPES.BTN, text: 'Да', action: ()=>modalData.callback(true), primary: true},
        {type: TYPES.DIVIDER},
        {type: TYPES.BTN, text: 'Нет', action: ()=>modalData.callback()},
        // {type: TYPES.BTN, text: 'Отмена', action: closeCallback}
    ];


    return createPortal(
        // @ts-ignore
        <Modal size={'xs'} title={'Закрытие редактора'} isOpen={modalData} action={closeCallback} footer={modalFooter}>
            Сохранить изменения?
        </Modal>,
        document.getElementById( 'spa-top' )
    );
};

export default memo(ModalExitConfirm);



