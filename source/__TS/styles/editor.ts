// @ts-ignore
import styled, {css} from 'styled-components';

// @ts-ignore
import {hexToRgbA} from "libs/helpers";

// @ts-ignore
import { COLORS, TextOverflow } from 'const/styles';

// @ts-ignore
import {  Divider, BtnBase } from "const/styles";


/** Styles */


// Кнопка вертикальная (в инструментах редактора)
export const BtnEditor = styled(BtnBase)`
    position: relative;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    border-right: 1px solid ${COLORS.LAVENDERMIST};
    height: 100%;
    ${Divider} + &{
      border-left: 1px solid ${COLORS.LAVENDERMIST};
    }
    &:last-child{
        border-right: none;
        border-left: 1px solid ${COLORS.LAVENDERMIST};
        margin-left: -1px;
    }
`;
// Выпадашка Select(в инструментах редактора)
export const SelectEditor = styled(BtnEditor)`
    &:before {
        position: absolute;
        content: "";
        left: 0;
        right: 0;
        margin: 0 auto;
        bottom: 0;
        width: 6px;
        height: 6px;
        border: 3px solid transparent;
        border-top-color: ${COLORS.LINE};
        transition: border-color .2s ease-out;
    }
    &:hover:before {
        border-top-color: ${COLORS.PRIMARY};
    }
`;

// Переключатель (в инструментах редактора)
export const ToggleEditor = styled(BtnEditor)`
    flex-direction: row;
    padding: 0;
    &:hover{
        color: inherit;
        fill: ${'inherit'};
    }
    .toggleInner {
        position: relative;
        padding: 10px;
        display: flex;
        align-items: center;
        height: 100%;
        transition: all .2s ease-out;
        &:first-child:after{
          position: absolute;
          content: "";
          width: 1px;
          top: 5px;
          bottom: 5px;
          right: 0;
          background-color: ${COLORS.LAVENDERMIST};
        }
        &:hover {
            color: ${COLORS.PRIMARY};
            fill: ${COLORS.PRIMARY};
        }
        &.active {
            color: ${COLORS.TEXT_WARNING};
            fill: ${COLORS.TEXT_WARNING};
        }
    }
`;

// Текст в BtnEditor-Кнопке
export const BtnEditorText = styled('div')`
    font-size: 14px;
    margin-top: 2px;
    //margin-bottom: 3px;
`;

// Текст EditorActionsPanel
export const TextEditor = styled(BtnEditor)`
        cursor: default;
        &:hover{
            color: inherit;
            fill: ${'inherit'};
        }
`;

// -----------
/**
 * Кнопка в шапку редактора
 */
export const EditorHeaderBtn = styled(BtnBase)`
    &:hover{
        color: ${COLORS.PRIMARY};
        fill: ${COLORS.PRIMARY};
        background-color: ${hexToRgbA(COLORS.INFO, .08)};
    }
    &:active{
        box-shadow: inset 0 2px 12px 1px rgba(0, 0, 0, 0.08);
    }
    ${({intent, intentOnHover, active})=>{
    if (intent) {
        switch (intent) {
            case 'primary': return css`
                    ${!intentOnHover && `
                        color: ${COLORS.TEXT_PRIMARY};
                        fill: ${COLORS.TEXT_PRIMARY};
                    `};
                    ${ active && `
                        background-color: ${hexToRgbA(COLORS.PRIMARY, .2)};
                    `};
                    &:hover{
                        color: ${COLORS.PRIMARY};
                        fill: ${COLORS.PRIMARY};
                        background-color: ${hexToRgbA(COLORS.PRIMARY, .1)};
                    }
                `;
            case 'success': return css`
                    ${!intentOnHover && `
                        color: ${COLORS.TEXT_SUCCESS};
                        fill: ${COLORS.TEXT_SUCCESS};
                    `};
                    ${ active && `
                        background-color: ${hexToRgbA(COLORS.SUCCESS, .2)};
                    `};
                    &:hover{
                        color: ${COLORS.SUCCESS};
                        fill: ${COLORS.SUCCESS};
                        background-color: ${hexToRgbA(COLORS.SUCCESS, .1)};
                    }
                `;
            case 'warning': return css`
                    ${!intentOnHover && `
                        color: ${COLORS.TEXT_WARNING};
                        fill: ${COLORS.TEXT_WARNING};
                    `};
                    ${ active && `
                        background-color: ${hexToRgbA(COLORS.WARNING, .2)};
                    `};
                    &:hover{
                        color: ${COLORS.WARNING};
                        fill: ${COLORS.WARNING};
                        background-color: ${hexToRgbA(COLORS.WARNING, .1)};
                    }
                `;
            case 'danger': return css`
                    ${!intentOnHover && `
                        color: ${COLORS.TEXT_DANGER};
                        fill: ${COLORS.TEXT_DANGER};
                    `};
                    ${ active && `
                        background-color: ${hexToRgbA(COLORS.DANGER, .2)};
                    `};
                    &:hover{
                        color: ${COLORS.DANGER};
                        fill: ${COLORS.DANGER};
                        background-color: ${hexToRgbA(COLORS.DANGER, .1)};
                    }
                `;
            case 'info': return css`
                    ${!intentOnHover && `
                        color: ${COLORS.TEXT_INFO};
                        fill: ${COLORS.TEXT_INFO};
                    `};
                    ${ active && `
                        background-color: ${hexToRgbA(COLORS.INFO, .2)};
                    `};
                    &:hover{
                        color: ${COLORS.INFO};
                        fill: ${COLORS.INFO};
                        background-color: ${hexToRgbA(COLORS.INFO, .1)};
                    }
                `;
        }
    }
}}
    ${({disabled})=>disabled && css`
        pointer-events: none;
        filter: grayscale(.33);
        opacity: .7;
    ` };
`;


export const IconsArray = styled( 'div' )`
    display: flex;
    flex-direction: row;
    height: 36px;
    font-size: 0;
    align-items: center;
`;

export const IconsArrayItem = styled( BtnBase )`
    width: 30px;
    height: 30px;
    padding: 3px;
    border-radius: 4px;
    fill: ${ ( { active } ) => active ? COLORS.WARNING : COLORS.MUTE };
    transition: fill .1s ease-out;
    &:hover {
        background: ${ COLORS.ATHENSGRAY };
        fill: ${ ( { active } ) => active ? COLORS.WARNING : COLORS.PRIMARY };
    }    
`;


export const SubBarSector = styled( 'div' )`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: ${ ( { align }: { align: string } ) => align || "center" };
    text-align: center;
    padding: 5px;
    font-size: 12px;
    line-height: 1.1em;
    user-select: none;
    color: ${COLORS.MUTE};
    transition: opacity .2s ease-out, filter .2s ease-out;
     ${ ( { isDisabled } ) => isDisabled && css`
        pointer-events: none;
        filter: grayscale(.33);
        opacity: .5;
    `}
`;

export const SubBarButton = styled( SubBarSector )`
    cursor: pointer;
    color: ${ ( { active } ) => active ? COLORS.PRIMARY : '' };
    transition: color .1s ease-out, fill .1s ease-out;
    flex-shrink: 0;
    flex-grow: ${ ( { grow } ) => grow ? 1 : 0 };
    &:hover {
        color: ${COLORS.PRIMARY};
        fill: ${COLORS.PRIMARY};
        .SubBarButtonCheckbox .control {
            border-color: ${ COLORS.PRIMARY };
        }
    }
`;

export const SubBarDivider = styled( 'div' )`
    border-left: 1px solid ${COLORS.LINE};
    margin: 5px 10px;
    display: inline-flex;
`;
export const SubBarSpace = styled( 'div' )`
    flex-grow: 1;
    border-left: 1px solid ${COLORS.LINE};
    border-right: 1px solid ${COLORS.LINE};
    margin: 5px 10px;
`;

export const SubBarSmallHeader = styled( 'div' )`
    padding-bottom: 5px;
    white-space:  nowrap;
`;

export const HelperText = styled( 'div' )`
    padding: 0 5px;
    color: ${COLORS.TEXT_INFO};
    font-size: 18px;
    font-style: italic;
    ${({ theme }) => theme.media.sm`
        font-size: 16px;
    `}
`;


export const FontListItem = styled( 'div' )`
    padding: 8px;
    &:hover {
        text {
            fill: ${COLORS.PRIMARY};
        }
    }
`;
export const TextSVG = styled( 'text' )`
    pointer-events: none;
    user-select: none;
    
    font-family: '${( { fontFamily } ) => fontFamily}';
    @font-face {
                font-family: '${( { fontFamily } ) => fontFamily}';
                src: url('${( { fontUrl } ) => fontUrl}') format('truetype');
                font-weight: normal;
                font-style: normal;
                }     
`;
