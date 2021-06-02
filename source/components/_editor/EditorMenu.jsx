import React from 'react';
import styled from 'styled-components'

import {COLORS} from 'const/styles'
import {IconMenu} from 'components/Icons'
import SideMenu from "components/SideMenu";
import {EDITOR_SIZES} from "./_config";
import {hexToRgbA} from "libs/helpers";
import TEXT from "texts/main";
import LINKS from "config/links";

/** Styles */

const EditorHeaderMenuBtn = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    height: ${EDITOR_SIZES.HEADER}px;
    margin-right: 10px;
    cursor: pointer;
    &:hover{
    fill: ${COLORS.PRIMARY};
    background-color: ${hexToRgbA(COLORS.PRIMARY,.1)};
    }
`;

/**
 * Боковое меню
 */
const EditorMenu = props => {
    const SIDE_MENU_ITEMS = [
        { name: TEXT.MAIN_PAGE,        link: LINKS.INDEX },
        { divider: 'Это разделитель. Он ставится вместо пункта меню, разделяя остальные пункты' },
        { name: 'Боковае меню'}
    ];

    return <SideMenu menu={SIDE_MENU_ITEMS} button={<EditorHeaderMenuBtn><IconMenu/></EditorHeaderMenuBtn>}/>;
};
export default EditorMenu;
