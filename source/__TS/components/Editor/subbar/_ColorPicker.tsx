// @ts-ignore
import React, { memo, useMemo, useState, useEffect, useRef } from 'react';

// @ts-ignore
import styled, {css} from 'styled-components';
// @ts-ignore
import { ChromePicker } from 'react-color';

// @ts-ignore
import { ILayoutColor } from "__TS/interfaces/layout";
// @ts-ignore
import { updateTextContentAction } from "__TS/actions/layout";
// @ts-ignore
import { updateBackgroundContentAction } from "__TS/actions/backgrounds";
// @ts-ignore
import { IconsArray } from "__TS/styles/editor";
// @ts-ignore
import { COLORS } from 'const/styles';

const CP_PADDING = 2;

/** Styles */
const ColorBoxWrap = styled( 'div' )`
    position: relative;
    padding: ${ CP_PADDING }px;   
    border: 1px solid ${COLORS.LINE};
    border-radius: ${ CP_PADDING }px;
    cursor: pointer;
    background: #fff;
    transition: border-color .2s ease-out;
    ${ ({active}: {active: boolean})=> active ? css`
            border-color: ${ COLORS.WARNING };
    ` : `
        &:hover {
            background: ${ COLORS.ATHENSGRAY };
            border-color: ${ COLORS.PRIMARY };
        }
    `}
    
`;
const ColorBox = styled( 'div' )`
    position: relative;
    display: flex;
    width: 30px;
    height: 30px;
    border-right: 10px solid ${COLORS.LINE};
    border-left:  10px solid ${COLORS.LINE};
    background: ${COLORS.ATHENSGRAY};
    
    &:before {
        content: "";
        position: absolute;
        top: 10px;
        left: -10px;
        height: 10px;
        width: 10px;
        background: ${COLORS.ATHENSGRAY};        
    }
    &:after {
        content: "";
        position: absolute;
        background: ${COLORS.ATHENSGRAY};
        border-left: 10px solid ${COLORS.LINE};
        top: 10px;
        right: -10px;
        height: 10px;
        width: 20px;       
    }    
`;

const ColorBoxInner = styled( 'span' )`
    position: absolute;
    top: ${ CP_PADDING }px;
    left: ${ CP_PADDING }px;
    right: ${ CP_PADDING }px;
    bottom: ${ CP_PADDING }px;
`;

const PopoverColor = styled( 'div' )`
    position: fixed;
    z-index: 300;
    margin-top: 8px;
    margin-left: -100px;
`;

const PopoverColorBg = styled( 'div' )`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
`;


/**
 * Компонент выбора цвета
 */
const ColorPicker = memo( ( { colorInvoice, type, disableAlpha = false }: { colorInvoice: ILayoutColor, type: string, disableAlpha?: boolean } ) => {
    const [ color, setColor ] = useState( colorInvoice );
    const [ showColorPicker, setShowColorPicker ] = useState( false );
    const timeoutRef = useRef( null );

    const updateColor = ( colorPicker: ILayoutColor ) => {
        if ( !colorPicker ) return;
        if ( timeoutRef.current ) clearTimeout( timeoutRef.current );
        timeoutRef.current = setTimeout( () => {

            switch ( type ) {
                case 'text':
                    updateTextContentAction( { color: colorPicker } );
                    break;
                case 'bgColor':
                    updateTextContentAction( { bgColor: colorPicker } );
                    break;
                case 'shadowColor':
                    updateTextContentAction( { shadowColor: colorPicker } );
                    break;
                case 'strokeColor':
                    updateTextContentAction( { strokeColor: colorPicker } );
                    break;
                case 'backgroundColor':
                    updateBackgroundContentAction( { bgColor: colorPicker } );
                    break;
            }


        }, 10 );
    };

    useEffect( () => {
        updateColor( color );
    }, [ color ] );

    useEffect( () => {
        setColor( colorInvoice );

        if ( !colorInvoice ) {
            setShowColorPicker( false );
        }
    }, [ colorInvoice ] )

    //выбранный цвет формируем в rgba
    const colorPicked = useMemo( () => {
        if ( !color ) return null
        return `rgba(${ color.r }, ${ color.g }, ${ color.b }, ${ color.a })`
    }, [ color ] );

    return <IconsArray>
        <ColorBoxWrap onClick={ () => setShowColorPicker( !showColorPicker ) } active={showColorPicker}>
            <ColorBox/>
            { color && <ColorBoxInner style={ { background: colorPicked } }/> }
            { color && showColorPicker &&
                <PopoverColor>
                    <PopoverColorBg onClick={ () => setShowColorPicker( !showColorPicker ) }/>
                    <ChromePicker color={ color } onChange={ c => setColor( c.rgb ) }
                                  disableAlpha={ disableAlpha }
                                  onClick={ ( e ) => {
                                      e.stopPropagation();
                                      e.preventDefault()
                                  } }/>
                </PopoverColor>
            || null }
        </ColorBoxWrap>
    </IconsArray>;
} );

export default ColorPicker;