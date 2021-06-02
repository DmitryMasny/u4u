// @ts-ignore
import React, {useState, useEffect, memo} from 'react';
// @ts-ignore
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

// @ts-ignore
import {NameLengthInfoText} from '__TS/styles/admin';




/** Interfaces */
interface ImodalCreateStickerPack {
    isOpen: boolean;        // показывать модалку
    closeCallback: ()=>any;        // закрыть модалку
    createStickerPackAction: (name: string)=>any;     // создать новый стикерпак
}

const MAX_NAME_LENGTH = 25;

/**
 * Модалка создания стикерпака
 */
const ModalCreateStickerPack: React.FC<ImodalCreateStickerPack> = ({isOpen, closeCallback, createStickerPackAction}) => {
    if (!isOpen) return null;

    const [name, setName] = useState('');

    const onCreateHandler = () => {
        createStickerPackAction(name);
        setName('');
        closeCallback();
    };
    const selectedLength: number = name && name.length || 0;
    const lettersLeft: number = MAX_NAME_LENGTH - selectedLength || 0;

    const modalFooter = [
        {type: TYPES.DIVIDER},
        {type: TYPES.BTN, text: TEXT_MAIN.READY, action: onCreateHandler, primary: true, disabled: !selectedLength},
        {type: TYPES.DIVIDER},
    ];

    const handleChange = (e) => {
        setName(e.target.value || '');
    };

    return createPortal(
        // @ts-ignore
        <Modal size={'xs'} title={'Создание набора стикеров'} isOpen={isOpen} action={closeCallback} footer={modalFooter}>
            <Input value={name || ''}
                   onChange={handleChange}
                   label={'Название набора'}
                   helperText={<NameLengthInfoText className={lettersLeft? '' : 'danger'}>
                       <span className="left">{selectedLength}</span> <span className="total">/{MAX_NAME_LENGTH}</span>
                   </NameLengthInfoText>}
                   maxLength={MAX_NAME_LENGTH}
                   autoFocus
            />
        </Modal>,
        document.getElementById( 'spa-top' )
    );
};

export default memo(ModalCreateStickerPack);



