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
import {adminBackgroundsSelector} from "./selectors";
import {IadminBackgroundsList} from "../../interfaces/admin/adminBackgrounds";

import AdminBackgroundPacksPanel from './_AdminBackgroundPacksPanel';


/** Actions */
import {
    moveBackgroundsAction
} from "../../actions/admin/adminBackgrounds";

/** Interfaces */
interface ImodalBackgroundMove {
    isOpen: boolean;        // показывать модалку
    closeCallback: ()=>any;        // закрыть модалку
    currentBackgroundPackId?: string;     // id текущего стикерпака
    movedBackgroundsList?: [string];     // id текущего стикерпака
    createBackgroundPackAction?: any;      // Показать модалку создания стикерпака
}

/**
 * Модалка выбора коллекции куда перенести фон
 */
const ModalBackgroundMove: React.FC<ImodalBackgroundMove> = ({isOpen, closeCallback, currentBackgroundPackId, movedBackgroundsList, createBackgroundPackAction}) => {
    if (!isOpen) return null;

// @ts-ignore
    const adminBackgrounds: IadminBackgroundsList[] = useSelector( adminBackgroundsSelector );

    const modalFooter = [
        {type: TYPES.DIVIDER},
        {type: TYPES.BTN, text: TEXT_MAIN.CLOSE, action: closeCallback},
        {type: TYPES.DIVIDER},
    ];

    const moveBackgroundsHandler = useCallback((packId) => {
        moveBackgroundsAction({packId, idList: movedBackgroundsList});
        closeCallback();
    }, [movedBackgroundsList]);

    const createBackgroundPackHandler = useCallback((o) => {
        createBackgroundPackAction(o);
        // closeCallback();
    }, [createBackgroundPackAction]);


    const filteredBackgroundPacksList = adminBackgrounds && adminBackgrounds.length && adminBackgrounds.filter((item)=>item.id !== currentBackgroundPackId) || [];

    return createPortal(
        // @ts-ignore
        <Modal size={'md'} title={'Выбор набора фонов'} isOpen={isOpen} action={closeCallback} footer={modalFooter}>
            <AdminBackgroundPacksPanel onSelect={moveBackgroundsHandler} list={filteredBackgroundPacksList} isInModal createBackgroundPackAction={createBackgroundPackHandler}/>
        </Modal>,
        document.getElementById( 'spa-top' )
    );
};

export default memo(ModalBackgroundMove);



