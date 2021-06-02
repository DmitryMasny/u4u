// @ts-ignore
import React, { memo } from 'react';
// @ts-ignore
import styled from 'styled-components'

// @ts-ignore
import Logo from "components/Logo";
// @ts-ignore
import { IconMenu } from 'components/Icons'
// @ts-ignore
import { hexToRgbA } from "libs/helpers";
// @ts-ignore
import { COLORS } from 'const/styles';
import { EDITOR_SIZES } from './_config';


// @ts-ignore
import MainSideMenu from '__TS/components/_misc/MainSideMenu';
import EditorNavBar from './_EditorNavBar';
import EditorHeaderActions from './_EditorHeaderActions';

// @ts-ignore
//import { Btn } from 'components/_forms';

/** Interfaces */
interface IProps {
    isMobile: boolean; //мобильный режим или нет
    themeParams: object|null;
}

/** Styles */
const EditorHeaderWrap = styled('div')`
    display: flex;
    align-items: center;
    width: 100%;
    height: ${ ({ isMobile }: IProps) => isMobile ? EDITOR_SIZES.HEADER_XS : EDITOR_SIZES.HEADER }px;
    background-color: ${ COLORS.WHITE };
    border-bottom: 1px solid ${ COLORS.LINE };
    line-height: 1em;
    overflow: hidden;
    flex-shrink: 0;
    .NavbarWrap {
      margin-left: 30px;
        ${({ theme }) => theme.media.md`
            margin-left: 10px;
        `}
    }
`;
const EditorHeaderDivider = styled('div')`
    flex-grow: 1;
`;


/** Styles */
const EditorHeaderMenuBtn = styled( 'div' )`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    height: ${ EDITOR_SIZES.HEADER }px;
    width: ${ EDITOR_SIZES.HEADER }px;
    cursor: pointer;
    font-size: 0;
    .hovered {
        display: none;
    }
    .notHovered {
        display: inherit;
    }
    &:hover {
        fill: ${ COLORS.PRIMARY };
        background-color: ${ hexToRgbA( COLORS.PRIMARY, .1 ) };
        .hovered {
            display: inherit;
        }
        .notHovered {
            display: none;
        }
    }
`;

const LogoWrapper = styled('div')`
    height: 24px;
`;
// @ts-ignore
const headerMenuBtn = <EditorHeaderMenuBtn><div className="hovered"><IconMenu/></div><LogoWrapper className="notHovered"><Logo min/></LogoWrapper></EditorHeaderMenuBtn>;

/**
 * Шапка редактора
 */
const EditorHeader: React.FC<IProps> = ( { isMobile, themeParams } ): any => (
        <EditorHeaderWrap isMobile={ isMobile } id={'editorHeader'}>
            <MainSideMenu button={headerMenuBtn}/>

            { !isMobile && <div className="NavbarWrap"><EditorNavBar /></div> }
            { !isMobile && <EditorHeaderDivider /> }

            <EditorHeaderActions isMobile={isMobile} themeParams={themeParams}/>

        </EditorHeaderWrap>
    );

export default memo( EditorHeader );