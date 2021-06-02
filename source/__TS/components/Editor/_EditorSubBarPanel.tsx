// @ts-ignore
import React from 'react';
// @ts-ignore
import { useSelector } from "react-redux";
// @ts-ignore
import styled, { css } from 'styled-components';

import { EDITOR_TABS } from './_config'

//селекторы
import { currentTabSelector } from './_selectors';

import SubBarPanelPhoto from "./subbar/SubBarPanelPhoto";
import SubBarPanelText from "./subbar/SubBarPanelText";
import SubBarPanelBackgrounds from "./subbar/SubBarPanelBackgrounds";
import SubBarPanelStickers from "./subbar/SubBarPanelStickers";
import SubBarPanelTemplates from "./subbar/SubBarPanelTemplates";

/** Interfaces */
interface Props {
    themeId?: string;
}

interface IEditorSubBarPanel {
    isMobile?: boolean;
    isThemeLayout?: boolean;
}

/** Styles */
const SubBar = styled( 'div' )`
    position: relative;
    width: 100%;
    height: 65px;
    display: flex;
    background: #fff;
    padding: 0 10px;
    ${({isMobile})=>isMobile ? css`
        border-top: 1px solid #bed0dd;
    ` : css`
        border-bottom: 1px solid #bed0dd;
    `};
`;


/**
 * Компонент суб-меню управления выбранным типом блока
 */
const EditorSubBarPanel = ( { isMobile, isThemeLayout }: IEditorSubBarPanel ) => {
    const currentTab: string = useSelector( currentTabSelector );

    let currentPanel = null;
    switch ( currentTab ) {
        case EDITOR_TABS.PHOTOS:
            currentPanel = <SubBarPanelPhoto isThemeLayout={isThemeLayout}/>;
            break;
        case EDITOR_TABS.TEXT:
            currentPanel = <SubBarPanelText />;
            break;
        case EDITOR_TABS.STICKERS:
            currentPanel = <SubBarPanelStickers />;
            break;
        case EDITOR_TABS.BACKGROUNDS:
            currentPanel = <SubBarPanelBackgrounds />;
            break;
        case EDITOR_TABS.TEMPLATES:
            currentPanel = <SubBarPanelTemplates />;
            break;
        default:
            currentPanel = null;
    }

    return <SubBar id={'editorSubMenu'} isMobile={isMobile}>
                { currentPanel }
           </SubBar>
};

export default EditorSubBarPanel

//const