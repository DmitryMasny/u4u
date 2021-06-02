// @ts-ignore
import React, {useState, useEffect, memo} from 'react';
// @ts-ignore
import {TYPES} from 'const/types';

// @ts-ignore
import Modal from 'components/Modal';

// @ts-ignore
import styled from 'styled-components';



/** Interfaces */
interface ImodalDataAction {
    type?: TYPES.COMPONENT | TYPES.DIVIDER | TYPES.TEXT | TYPES.BTN;    // Тип элемента футера
    component?: any;            // Если тип - компонент, надо передать этот компонент
    text?: string;              // Текст кнопки или просто текст
    action?: any;               // Действие кнопки
    modalClosingBtn?: boolean;  // Закрывать окно после действия
    primary?: boolean;          // Главная кнопка окна (Сработает на enter)
    intent?: string;            // Цвет кнопки
    disabled?: boolean;         // disabled
    divider?: boolean;          // разделитель между кнопками
    width?: number;             // ширина кнопки
    icon?: any;                 // Иконка кнопки
}
export interface ImodalData {
    actions?: ImodalDataAction[];
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    title?: string;
    svgImage?: any;
    text?: string | string[];
    component?: any;
    blocked?: boolean;
}
interface IDialog {
    modalData: ImodalData;
    closeCallback: ()=>any; // закрыть модалку
}

/** Styles */
const SvgImageWrap = styled('div')`
    padding: 0 10px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 150px;
    width: 100%;
`;


/**
 * Диалоговая модалка (fast)
 */
const Dialog: React.FC<IDialog> = ({modalData, closeCallback}) => {

    const [ isOpen, isOpenSet ] = useState(false);
    const [ modalFooter, modalFooterSet ] = useState(null);

    useEffect(() => {
        if (!isOpen && modalData) isOpenSet(true);
    }, [modalData, isOpen]);

    useEffect(() => {
        if (modalData.actions && modalData.actions.length) modalFooterSet([
            ...(modalData.actions.length === 1 ? [{type: TYPES.DIVIDER}] : []),
            ...modalData.actions.map((a)=>( !a.divider ? {
                type: TYPES.BTN, modalClosingBtn: true, ...a
            } : {type: TYPES.DIVIDER })),
            ...(modalData.actions.length === 1 ? [{type: TYPES.DIVIDER}] : []),
        ])
    }, [modalData && modalData.actions]);

    return (// @ts-ignore
        <Modal size={modalData.size || 'xs'} title={modalData.title} isOpen={isOpen} action={closeCallback} footer={modalFooter} blocked={modalData.blocked}>
            { modalData.svgImage && <SvgImageWrap>{modalData.svgImage}</SvgImageWrap> }
            { modalData.text && Array.isArray(modalData.text) ? modalData.text.map((item: string, i)=><p  key={i}>{item}</p>) : <p>{modalData.text}</p>}
            { modalData.component }
        </Modal>
    );

};

export default memo(Dialog);



