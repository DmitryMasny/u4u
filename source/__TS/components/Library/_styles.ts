import styled, {css} from 'styled-components'
// @ts-ignore
import {hexToRgbA} from "libs/helpers";
// @ts-ignore
import {COLORS} from "const/styles";

import {Ilibrary, IlibraryItem} from "./_interfaces";


export const StyledTags = styled('div')`
    position: absolute;
    display: flex;
    align-items: center;
    bottom: 2px;
    right: 2px;
    font-size: 0;
    opacity: .7;
    transition: opacity .2s ease-out;
    z-index: 3;
    .fileTypeTag {
        display: inline-flex;
        align-items: center;
        line-height: 12px;
        margin: 0 2px;
        text-transform: uppercase;
        font-weight: bold;
        padding: 1px;
        border-radius: 2px;
        font-size: 11px;
        color: ${COLORS.WHITE};
        background-color: ${COLORS.NEPAL};
    }
`;

const StyledLibraryItemPadding = 5;
const StyledLibraryItemNameHeight = 30;

export const StyledLibraryItem = styled('div')`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: ${({thumbSize}: IlibraryItem)=> thumbSize ? `${thumbSize + StyledLibraryItemPadding*2}px` : 'auto'};
    height: ${({thumbSize, isNamed}: IlibraryItem)=> thumbSize ? `${thumbSize + StyledLibraryItemPadding*2 + (isNamed ? StyledLibraryItemNameHeight : 0)}px` : 'auto'};
    max-width: 100%;
    margin: 0 5px 10px;
    padding: ${StyledLibraryItemPadding}px;
    user-select: none;
    outline: 2px solid transparent;
    transition: outline-color .1s ease-out, opacity .2s ease-out;
    cursor: pointer;
    z-index: 5;
    //@include media(xs) {
    //        max-width: 300px;
    //        margin: 0 3px 6px;
    //}
    ${({disabled, error}: IlibraryItem)=> disabled ? css`
        pointer-events: none;
        .image, .svgWrap {
            opacity: .5;
            filter: grayscale(.5) blur(1px);
        }
    ` : !error && css`
        &:hover {
            opacity: .8;
            outline-color: ${COLORS.LAVENDERMIST};
            ${StyledTags} {
                opacity: 1;
            }
        }
    `};
    .selectionActive &{
        cursor: pointer;
        .selectionBox {
            opacity: .8;
        }
        .image, .svgWrap {
            opacity: .8;
        }
        ${({selected}: IlibraryItem) => selected ? css`
            outline-color: ${COLORS.PRIMARY};
            .selectionBox {
                background: ${COLORS.PRIMARY};
                border-color: ${COLORS.PRIMARY};            
                opacity: 1 ;            
            }
            .image, .svgWrap {
                opacity: 1;
            }
            &:hover {
                outline-color: ${COLORS.PRIMARY};
                opacity: 1;
                .selectionBox {
                    opacity: 1;
                }
            }`
        : css`
            &:hover {
                outline-color: ${COLORS.LINE};
            }
        `};
    }

    
    ${({error}: IlibraryItem)=> error && css`
       &:after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: ${COLORS.DANGER};
            mix-blend-mode: color;
       }
    `};
        
    .image {
        height: ${({thumbSize}: IlibraryItem)=> `${thumbSize || 100}px`};
        object-fit: contain;
    }
    .svgWrap, .spinnerWrap {
        width: ${({thumbSize}: IlibraryItem)=> `${thumbSize || 100}px`};
        height: ${({thumbSize}: IlibraryItem)=> `${thumbSize || 100}px`};
        &>svg {
            width: 100%;
            height: 100%;
        }
    }
    .name {
        font-size: 14px;
        padding: 5px 0;
        height: ${StyledLibraryItemNameHeight}px;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: center;
        ${({error}: IlibraryItem)=> error && css`
           color: ${COLORS.TEXT_DANGER};
        `};
    }
    .selectionBox {
        position: absolute;
        width: 24px;
        height: 24px;
        bottom: 5px;
        left: 5px;
        border-radius: 12px;
        border: 2px solid ${COLORS.WHITE};
        background-color: ${hexToRgbA(COLORS.TEXT, .2)};
        cursor: pointer;
        opacity: 0;
        pointer-events: none;
        font-size: 0;
        transition: opacity .1s ease-out;
        //@include media(xs) {
        //        width: 16px;
        //        height: 16px;
        //        left: 5px;
        //        border-radius: 8px;
        //    }
        & > svg {
            fill: #fff;
            margin: -2px 0 0 -2px;
        //@include media(xs) {
        //        font-size: 12px !important;
        //        margin: 0;
        //    }
        }
    }
    .SortHandle {
        position: absolute;
        top: 5px;
        left: 5px;
        fill: #fff;
        width: 24px;
        height: 24px;
        border-radius: 12px;
        background-color: ${COLORS.LINE};
        cursor: -webkit-grab;
        z-index: 2;
        &:hover {
             background-color: ${COLORS.PRIMARY};
        }
    }
    .errorWrap {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 5;
        opacity: .7;
    }
    body > &{
        .SortHandle{
             background-color: ${COLORS.PRIMARY};
        }
    }
`;

export const StyledLibrary = styled('div')`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    padding: 10px;
    margin: 0 -3px;
    min-width: 100%;
    transition: opacity .2s ease-out .2s;
    ${({disabled}: Ilibrary)=> disabled && css`
        pointer-events: none;
        opacity: .8;
    `};
    ${({disableEvents}: Ilibrary)=> disableEvents && css`
        & > ${StyledLibraryItem}:hover {
            cursor: default;
            outline-color: transparent;
        }
    `};
    & > .spinner {
        margin-top: 50px;
    }
`;

export const StyledImageLoader = styled('div')`
    .loaderWrap{
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        width: 100%;
        padding: 0 10px;
    }
    .prevImage {
        top:0;
        right:0;
        bottom:0;
        transform: translate(0, 0);
        max-height: 100%;
        &.abs {
            position: absolute;
            width: 100%;
        }
    }
`;