// @ts-ignore
import React, { memo, useEffect, useRef, useState, useCallback } from 'react';
// @ts-ignore
import { useSelector } from "react-redux";
// @ts-ignore
import { Scrollbars } from 'react-custom-scrollbars';
// @ts-ignore
import styled from 'styled-components';
// @ts-ignore
import { contentLayoutByBlockIdSelector } from '__TS/selectors/layout';

// @ts-ignore
import { COLORS } from 'const/styles';

import {
    currentControlElementIdSelector,
    currentControlElementTypeSelector,
    //currentControlWidthPxSelector,
    selectedAreaSelector
} from '../_selectors';
import { addTextToPageAction, updateTextContentAction } from "../../../actions/layout";
import { ILayoutContentText } from "../../../interfaces/layout";
import EmptyLibrary from "./_EmptyLibrary";


/** Interfaces */
interface ITextArea {
    placeholder?: string;
    value?: string;
    onChange?: any;
}

/** Styles */
const TextInputBlock = styled( 'div' )`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  width: 100%;
  height: 100%;
`;
const TextAreaStyled = styled( 'textarea' )`
  width: 100%;
  height: 100%;
  padding: 10px;
  border: none;
  resize: none;
  font-size: 20px;
  &::-webkit-input-placeholder, &::-moz-placeholder, &:-ms-input-placeholder {
    font-size: 20px;
    color: ${COLORS.TEXT_MUTE}
  }
`;

const AddTextButton = styled( 'button' )`
  display: flex;
  align-self: center;
  flex-direction: column;
  justify-content: center;
  align-items: ${ ( { align } ) => align || "center" };
  text-align: center;
  padding: 5px;
  font-size: 16px;
  line-height: 1.2em;
  border-radius: 4px;
  user-select: none;
  box-shadow: inset 0 2px 12px 1px rgba(0, 0, 0, 0);
  color: #777;
  fill: #777;
  border: 2px dashed #777;
  background-color: #fff;
  height: 150px;
  margin: 20px auto;
  width: 100%;
  max-width: 150px;
  min-width: 100px;
  cursor: pointer;
  flex-flow: column wrap;

  &:hover {
    border: 2px solid #777;
  }
`;

// TextArea
const TextArea: React.FC<ITextArea> = ( props ) => {
    const textAreaRef:any = useRef({ current: null });

    // ставим фокус на текстовое поле при появлении
    useEffect( () => {
        if ( textAreaRef.current ) {
            textAreaRef.current.focus();
        }
    }, [ textAreaRef.current ] );

    return <TextAreaStyled { ...props } ref={textAreaRef} />
};

/**
 * Библиотека фотографий
 */
const TextLibrary: React.FC = () => {
    const [ currentText, currentTextSet ] = useState( '' );

    //const photoLibraryShowOnlyNotUsed = useSelector( photoLibraryShowOnlyNotUsedSelector );
    //const currentControlWidthPx: string = useSelector( currentControlWidthPxSelector );

    const currentControlElementId: string | number = useSelector( currentControlElementIdSelector );
    const currentControlElementType: string = useSelector( currentControlElementTypeSelector );
    const selectedArea: number = useSelector( selectedAreaSelector );
    const contentLayout: ILayoutContentText = useSelector( state => contentLayoutByBlockIdSelector( state, currentControlElementId ) );

    //ref для timeout debounce ввода текста
    const timeout = useRef( null );

    //назначаем текст в локальный стейт
    useEffect( () => {
        if ( contentLayout ) currentTextSet( contentLayout.text );
    }, [ contentLayout ] );

    //назначаем текст в локальный стейт
    useEffect( () => {
        if ( !contentLayout ) return;

        if ( contentLayout.type == 'text' && currentText !== contentLayout.text ) {
            if ( timeout.current ) clearTimeout( timeout.current );
            timeout.current = setTimeout( () => {
                updateTextContentAction( { text: currentText } );
            }, 200 );
        }
    }, [ currentText ] );

    const addTextToPage = useCallback( () => {
        addTextToPageAction( { areaNumber: selectedArea } );
    }, [ selectedArea ] )

    const isSelectedPhotoBlock = currentControlElementId && currentControlElementType === 'text';

    //если не выбран блок текста, то ставим загрушку "кнопку добавить текст"
    return <Scrollbars>
        { isSelectedPhotoBlock ?
            <TextInputBlock>
                <TextArea placeholder="Введите текст"
                          value={ currentText }
                          onChange={ event => currentTextSet( event.target.value ) }
                />
            </TextInputBlock>
            :
            <EmptyLibrary type={'text'}/>
        }
    </Scrollbars>
};

export default memo( TextLibrary );