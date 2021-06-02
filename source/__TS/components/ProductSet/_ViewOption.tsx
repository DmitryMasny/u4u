// @ts-ignore
import React, { useState, memo} from 'react';

import styled, {css} from 'styled-components';
// @ts-ignore
import {COLORS} from 'const/styles';

// @ts-ignore
import {IMG_DIR} from "config/dirs";
// @ts-ignore
import {hexToRgbA} from "libs/helpers";

import {ViewOptionsProps} from "./_config";



/** Interfaces */
interface Props {
    item: ViewOptionsProps;
    hide: boolean;      // не показывать
    active: boolean;    // это текущий вид (выбран)
    selectAction: (item: any)=>any     // Выбрать этот вид
}
interface ViewOptionProps {
    preview: boolean;
    active: boolean;
}

/** Styles */
const StyledViewOption = styled('div')`
    width: 68px;
    height: 50px;
    background-size: cover;
    background-repeat: no-repeat;
    box-shadow: inset 0 0 0 1px ${hexToRgbA(COLORS.TEXT, .2)};
    ${({preview}: ViewOptionProps)=>preview ? `background-image: url(${preview})` : `background-color: ${COLORS.ATHENSGRAY}`};
    border: 3px solid white;
    opacity: 1;
    transition: border-color .1s ease-out, opacity .2s ease-out;
    ${({active}: ViewOptionProps)=>active ? css`
        border-color: ${COLORS.WARNING};
        box-shadow: none;
    ` :
    css`
        cursor: pointer;
        &:hover{
            opacity: .9;
        }
    `
}
`;

const ViewOption: React.FC<Props> = ({item, hide, active, selectAction}) => {

    if ( hide ) {
        return null;
    }
    return <StyledViewOption onClick={() => selectAction( item )} preview={item.preview} active={active}/>
};

export default ViewOption;



