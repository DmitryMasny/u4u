import React, {useState, useEffect, memo} from 'react';
import { useSelector, useDispatch } from "react-redux";

import styled from 'styled-components'
import {COLORS} from 'const/styles'
import {EDITOR_SIZES} from './_config'
import { Btn } from 'components/_forms';

import EditorNavbar from './EditorNavbar';
import EditorMenu from './EditorMenu';
import EditorHeaderActions from './EditorHeaderActions';
import {windowIsMobileSelector} from "./_selectors";


/** Styles */
const EditorHeaderWrap = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: ${({isMobile})=>isMobile? EDITOR_SIZES.HEADER_XS : EDITOR_SIZES.HEADER}px;
    background-color: ${COLORS.WHITE};
    border-bottom: 1px solid ${COLORS.LINE};
    line-height: 1em;
`,
    EditorHeaderDivider = styled.div`
    flex-grow: 1;
`;

/**
 * Шапка редактора
 */
const EditorHeader = memo((props) => {
    // const [isLoaded, setIsLoaded] = useState(null);
    const isMobile = useSelector( state => windowIsMobileSelector( state ) );

    return (
        <EditorHeaderWrap isMobile={isMobile}>
            <EditorMenu/>
            { !isMobile && <EditorNavbar/> }
            { !isMobile && <EditorHeaderDivider/> }

            <EditorHeaderActions/>

            <Btn>
                Просмотр
            </Btn>
        </EditorHeaderWrap>
    )
});

export default EditorHeader;