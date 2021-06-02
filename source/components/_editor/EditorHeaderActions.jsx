import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";

import styled from 'styled-components'
import {COLORS} from 'const/styles'
import {EDITOR_SIZES} from './_config'

import {connect} from 'react-redux';
import EditorNavbar from './EditorNavbar';

import Tooltip from 'components/_forms/Tooltip';
import TEXT_EDITOR from "texts/editor";
import {IconArrowBack, IconArrowForward, IconChevronDown, IconChevronUp} from "../Icons";
import {windowIsMobileSelector} from "./_selectors";


/** Styles */
const EditorHeaderActionsWrap = styled.div`
    display: flex;
    align-items: center;
    flex-grow: ${({isMobile})=>isMobile ? 1 : 0};
    justify-content: flex-end;
    height: ${({isMobile})=>isMobile ? EDITOR_SIZES.HEADER_XS : EDITOR_SIZES.HEADER}px;
    margin: 0 10px;
`,
    EditorHeaderActionBtn = styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    margin-right: 1px;
    cursor: pointer;
    &:hover{
        fill: ${COLORS.PRIMARY};
    }
`;

/**
 * Редактор
 */
const EditorHeader = (props) => {
    const isMobile = useSelector( state => windowIsMobileSelector( state ) );

    return <EditorHeaderActionsWrap isMobile={isMobile}>

        <Tooltip tooltip={TEXT_EDITOR.BACK}>
            <EditorHeaderActionBtn onClick={(x) => console.log('BACK')}>
                <IconArrowBack/>
            </EditorHeaderActionBtn>
        </Tooltip>

        <Tooltip tooltip={TEXT_EDITOR.FORWARD}>
            <EditorHeaderActionBtn onClick={(x) => console.log('FORWARD')}>
                <IconArrowForward/>
            </EditorHeaderActionBtn>
        </Tooltip>

        <Tooltip tooltip={TEXT_EDITOR.LAYER_UP}>
            <EditorHeaderActionBtn onClick={(x) => console.log('LAYER_UP')}>
                <IconChevronUp/>
            </EditorHeaderActionBtn>
        </Tooltip>

        <Tooltip tooltip={TEXT_EDITOR.LAYER_DOWN}>
            <EditorHeaderActionBtn onClick={(x) => console.log('LAYER_DOWN')}>
                <IconChevronDown/>
            </EditorHeaderActionBtn>
        </Tooltip>

    </EditorHeaderActionsWrap>
};

export default EditorHeader;