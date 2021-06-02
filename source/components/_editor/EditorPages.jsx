import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";

import styled, {ThemeProvider} from 'styled-components'
import {COLORS} from 'const/styles'
import {EDITOR_SIZES} from './_config'
import { IconChevronUp, IconChevronDown, IconAddPage, IconSelect  } from 'components/Icons'
import {BtnEditor, BtnEditorText, Divider} from 'const/styles'
import {pagesPanelSelector, windowHeightSelector, windowIsMobileSelector} from "./_selectors";
import {togglePagesPanelAction} from "./_actions";
import TEXT_EDITOR from "texts/editor";
import TEXT_MAIN from "texts/main";

/** Styles */
const EditorPagesWrap = styled.div`
        position: absolute;
        bottom: ${({theme})=>theme.isMobile ? 'auto' : 0};
        top: ${({theme})=>!theme.isMobile ? 'auto' : 0};
        display: flex;
        align-items: center;
        width: 100%;
            height: ${({isMobile, height})=>(isMobile && height) ? `${height}px`:'100vh'};

        height: ${
            ({theme, height})=>theme.expand ?
                (theme.isMobile ? `calc(${height ? height + 'px' : '90vh'} - ${ EDITOR_SIZES.HEADER_XS }px )` : `calc(100vh - ${ EDITOR_SIZES.HEADER }px - ${ EDITOR_SIZES.ACTION_PANEL }px )`)
                :
                `${EDITOR_SIZES.PAGES_HEIGHT}px`
        };
        background-color: ${COLORS.ATHENSGRAY};
        //border-top: 1px solid ${COLORS.LINE};
        line-height: 1em;
        z-index: 3;
        transition: height .25s ease-in-out;
`,
    EditorPagesActionPanel = styled.div`
        position: absolute;
        bottom: 0;
        display: flex;
        align-items: center;
        width: 100%;
        height: ${EDITOR_SIZES.PAGES_HEIGHT}px;
        border-top: ${({theme})=>theme.isMobile ? 'none' : `1px solid ${COLORS.LINE}`};
        border-bottom: ${({theme})=>!theme.isMobile ? 'none' : `1px solid ${COLORS.LINE}`};
        transition: background-color .25s ease-out;
        background-color: ${({theme})=>theme.expand ? COLORS.WHITE : 'transparent'};
`,
    EditorPagesBtn = styled(BtnEditor)`
        height: 100%;
        background-color: ${COLORS.WHITE};
`,
    EditorPagesList = styled.div`
        flex-grow: 1;
        display: flex;
        justify-content: center;
        height: 100%;
        padding: 5px 0;
`,
    EditorPagesItem = styled.div`
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0 10px;
        height: 50px;
        margin: 0 5px;
        background-color: ${COLORS.WHITE};
`;


/**
 * Панель страниц
 */
const EditorPages = (props) => {
    const pagesPanelIsExpand = useSelector( state => pagesPanelSelector( state ) );
    const isMobile = useSelector( state => windowIsMobileSelector( state ) );
    const windowHeight = useSelector( state => windowHeightSelector( state ) );
    const dispatch = useDispatch();

    return (
        <ThemeProvider theme={{expand:pagesPanelIsExpand, isMobile: isMobile}}>
            <EditorPagesWrap expand={pagesPanelIsExpand} height={windowHeight}>

                <EditorPagesList>
                    <EditorPagesItem>
                        EditorPage
                    </EditorPagesItem>
                    <EditorPagesItem>
                        EditorPage
                    </EditorPagesItem>
                </EditorPagesList>

                <EditorPagesActionPanel>
                    <EditorPagesBtn onClick={() => dispatch(togglePagesPanelAction())}>
                        { (isMobile && !pagesPanelIsExpand || !isMobile && pagesPanelIsExpand) ? <IconChevronDown/> : <IconChevronUp/> }
                    </EditorPagesBtn>

                    { pagesPanelIsExpand &&
                    <EditorPagesBtn onClick={() => {console.log('select')}}>
                        <IconSelect/>
                        {TEXT_MAIN.SELECT}
                    </EditorPagesBtn>
                    }

                    <Divider/>

                    <EditorPagesBtn>
                        <IconAddPage/>
                        { pagesPanelIsExpand && <BtnEditorText>{TEXT_EDITOR.ADD_TURN}</BtnEditorText> }
                    </EditorPagesBtn>
                </EditorPagesActionPanel>


            </EditorPagesWrap>
        </ThemeProvider>
        )
};

export default EditorPages;