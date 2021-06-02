/** Import libs */
// @ts-ignore
import React, { useState } from 'react';
// @ts-ignore
import { useSelector } from "react-redux";
// @ts-ignore
import styled, {css} from 'styled-components';
// @ts-ignore
import { MoreVertical } from 'components/Icons/LineIcon';

import {
    windowIsMobileSelector
} from "../_selectors";

// @ts-ignore
import { COLORS } from 'const/styles';


/** Interfaces */
interface IMultilinePanel {
    children: any;
    disabled?: boolean;
    isOpen?: boolean;
}


/** Styles */
export const SubBarPanelMultiline = styled( 'div' )`
    overflow: hidden;
    height: 64px;
    flex-grow: 1;
    padding-right: 30px;
    padding-left: 11px;
    margin-left: -11px;
    margin-right: ${ ( { isMobile } ) => isMobile ? 0 : -10}px;
    ${ ( { isMobile } ) => isMobile ? 'border-top' : 'border-bottom'}: 1px solid transparent;
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;    
    ${ ( { opened, isMobile } ) => opened ? css`
        position: ${isMobile ? 'absolute' : ''};
        ${isMobile ? 'margin-right: 0' : ''};
        height: ${isMobile ? 'auto' : '130px'};
        bottom: ${isMobile ? 0 : 'auto'};
        border-color: #bed0dd;
        background: #fff;
        z-index: 500; 
        box-shadow: 1px 2px 3px rgb(28 59 84 / 26%);     
    ` : '' };
`;

export const SubBarPanelMultilineInner = styled( 'div' )`
    position: relative;
    display: flex;
    flex-wrap: wrap;
`;

export const MoreVerticalWrapper = styled( 'div' )`
    position: absolute;
    right: -30px;
    bottom: 68px;
    padding: 15px 5px;
    cursor: pointer;
    ${ ({disabled}: {disabled: boolean})=> disabled && css`
      opacity: .5;
      pointer-events: none;
    ` }
    ${ ({isMobile}: {isMobile: boolean})=> isMobile && css`
          bottom: auto;
          top: 5px;
    ` }
    &:hover .icon{
      stroke: ${ ({active}: {active: boolean})=> active ? COLORS.TEXT : COLORS.PRIMARY }
    }
    &:active .icon{
      stroke: ${ ({active}: {active: boolean})=> active ? COLORS.PRIMARY : COLORS.TEXT }
    }
`;

/**
 * Компонент суб-меню управления текстом
 */
const MultilinePanel: React.FC<IMultilinePanel> = ({children, disabled, isOpen}) => {
    const isMobile: boolean = useSelector( windowIsMobileSelector );
    const [isOpenedPanel, setIsOpenedPanel] = useState( false );

    return (
        <SubBarPanelMultiline opened={ isOpenedPanel } isMobile={ isMobile }>
            <SubBarPanelMultilineInner>
                { children }
                <MoreVerticalWrapper disabled={disabled} isMobile={ isMobile } active={ !disabled && isOpenedPanel } onClick={ () => setIsOpenedPanel( state => !state ) }>
                    <MoreVertical className={ 'icon' } type={ isOpenedPanel ? 'shift' : '' }/>
                </MoreVerticalWrapper>
            </SubBarPanelMultilineInner>
        </SubBarPanelMultiline>
    )
};

export default MultilinePanel;