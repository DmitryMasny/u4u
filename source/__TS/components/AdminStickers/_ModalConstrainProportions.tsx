// @ts-ignore
import React, { memo } from 'react';
import {createPortal} from "react-dom";
// @ts-ignore
import {useSelector, useDispatch} from "react-redux";

// @ts-ignore
import {TYPES} from 'const/types';
// @ts-ignore
import {Btn} from 'components/_forms';
// @ts-ignore
import Modal from 'components/Modal';

import { Isticker } from "../../interfaces/admin/adminStickers";

// /** Actions */
// import {
//     selectStickerAction,
// } from "../../actions/admin/adminStickers";

/** Interfaces */
interface ImodalConstrainProportions {
    isOpen: boolean;        // показывать модалку
    closeCallback: ()=>any;        // закрыть модалку
    selectedList: Isticker[]
}


/**
 * Модалка создания стикерпака
 */
const ModalConstrainProportions: React.FC<ImodalConstrainProportions> = ({isOpen, closeCallback, selectedList}) => {
    if (!isOpen) return null;

    const setConstrainProportionsHandler = (isConstrain) => {
        closeCallback();
    };

    const modalFooter = [
        {type: TYPES.BTN, text: 'Сохранять пропорции', action: ()=>setConstrainProportionsHandler(true), intent: 'primary'},
        {type: TYPES.DIVIDER},
        {type: TYPES.BTN, text: 'Не сохранять пропорции', action: ()=>setConstrainProportionsHandler(false), intent: 'warning'},

    ];


    return createPortal(
        // @ts-ignore
        <Modal size={'xs'} title={'Правила пропорций'} isOpen={isOpen} action={closeCallback} footer={modalFooter}>
            Задайте правила сохранения пропорций стикера.
        </Modal>
        ,
        document.getElementById( 'spa-top' )
    );
};

export default memo(ModalConstrainProportions);



