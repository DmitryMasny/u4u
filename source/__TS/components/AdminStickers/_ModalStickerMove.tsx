// @ts-ignore
import React, {useState, useEffect, memo, useCallback} from 'react';
import {createPortal} from "react-dom";
// @ts-ignore
import {useSelector, useDispatch} from "react-redux";

// @ts-ignore
import {TYPES} from 'const/types';
// @ts-ignore
import TEXT_MAIN from 'texts/main';
// @ts-ignore
import {Input, Btn} from 'components/_forms';
// @ts-ignore
import Modal from 'components/Modal';
import {adminStickersSelector} from "./selectors";
import {IadminStickersList} from "../../interfaces/admin/adminStickers";

import AdminStickerPacksPanel from './_AdminStickerPacksPanel';


/** Actions */
import {
    moveStickersAction
} from "../../actions/admin/adminStickers";

/** Interfaces */
interface ImodalStickerMove {
    isOpen: boolean;        // показывать модалку
    closeCallback: ()=>any;        // закрыть модалку
    currentStickerPackId?: string;     // id текущего стикерпака
    movedStickersList?: [string];     // id текущего стикерпака
    createStickerPackAction?: any;      // Показать модалку создания стикерпака
}

/**
 * Модалка выбора коллекции куда перенести стикер
 */
const ModalStickerMove: React.FC<ImodalStickerMove> = ({isOpen, closeCallback, currentStickerPackId, movedStickersList, createStickerPackAction}) => {
    if (!isOpen) return null;

// @ts-ignore
    const adminStickers: IadminStickersList[] = useSelector( adminStickersSelector );

    const modalFooter = [
        {type: TYPES.DIVIDER},
        {type: TYPES.BTN, text: TEXT_MAIN.CLOSE, action: closeCallback},
        {type: TYPES.DIVIDER},
    ];

    const moveStickersHandler = useCallback((packId) => {
        moveStickersAction({packId, idList: movedStickersList});
        closeCallback();
    }, [movedStickersList]);

    const createStickerPackHandler = useCallback((o) => {
        createStickerPackAction(o);
        closeCallback();
    }, [createStickerPackAction]);


    const filteredStickerPacksList = adminStickers && adminStickers.length && adminStickers.filter((item)=>item.id !== currentStickerPackId) || [];

    return createPortal(
        // @ts-ignore
        <Modal size={'md'} title={'Выбор набора стикеров'} isOpen={isOpen} action={closeCallback} footer={modalFooter}>
            <AdminStickerPacksPanel onSelect={moveStickersHandler} list={filteredStickerPacksList} isInModal createStickerPackAction={createStickerPackHandler}/>
        </Modal>,
        document.getElementById( 'spa-top' )
    );
};

export default memo(ModalStickerMove);



