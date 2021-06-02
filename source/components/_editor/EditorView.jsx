import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";

import styled from 'styled-components'
import {COLORS} from 'const/styles'
import {EDITOR_SIZES} from './_config'
import {windowIsMobileSelector} from "./_selectors";

import LayoutConstructor from 'components/LayoutConstructor/';

/** Styles */
const EditorViewWrap = styled.div`
    flex-grow: 1;
    width: 100%;
    padding-${({isMobile})=>isMobile ? 'top' : 'bottom' }: ${EDITOR_SIZES.PAGES_HEIGHT}px;
    //height: calc(100vh - ${EDITOR_SIZES.HEADER}px - ${EDITOR_SIZES.ACTION_PANEL}px );
    height: 100%;
    position: relative;
`;

/**
 * Редактор
 */
const EditorView = (props) => {

    const isMobile = useSelector( state => windowIsMobileSelector( state ) );

    return <EditorViewWrap isMobile={isMobile}>
                <LayoutConstructor />
           </EditorViewWrap>
};

export default EditorView;