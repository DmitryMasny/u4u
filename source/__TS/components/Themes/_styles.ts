// @ts-ignore
import styled, {css} from 'styled-components'
// @ts-ignore
import {hexToRgbA} from "libs/helpers";
// @ts-ignore
import {COLORS, TextOverflow} from "const/styles";

// @ts-ignore
import { IThemes, ITheme } from "__TS/interfaces/themes";

export const StyledTags = styled('div')`
    position: absolute;
    display: flex;
    align-items: center;
    top: 2px;
    right: 2px;
    font-size: 0;
    opacity: .7;
    transition: opacity .2s ease-out;
    z-index: 3;
    .tag {
        padding: 5px;
        border-radius: 50%;
        fill: #fff;
        &.published{
          background-color: ${COLORS.INFO};
        }
    }
`;

const StyledLibraryItemPadding = 5;
const StyledLibraryItemNameHeight = 30;

export const StyledTheme = styled('div')`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: ${({thumbSize}: ITheme)=> thumbSize ? `${thumbSize + StyledLibraryItemPadding*2}px` : 'auto'};
    max-width: 100%;
    margin: 0 10px 20px;
    padding: ${StyledLibraryItemPadding}px;
    user-select: none;
    outline: 2px solid transparent;
    transition: outline-color .1s ease-out, opacity .2s ease-out;
    cursor: pointer;
    //@include media(xs) {
    //        max-width: 300px;
    //        margin: 0 3px 6px;
    //}
    ${({disabled, error}: ITheme)=> disabled ? css`
        pointer-events: none;
        .image, .svgWrap {
            opacity: .5;
            filter: grayscale(.5) blur(1px);
        }
    ` : !error && css`
        &:hover {
            opacity: .8;
            ${StyledTags} {
                opacity: 1;
            }
        }
    `};
    /*.selectionActive &{
        cursor: pointer;
        .selectionBox {
            opacity: .8;
        }
        .image, .svgWrap {
            opacity: .8;
        }
        ${({selected}: ITheme) => selected ? css`
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
    }*/

    
    /*${({error}: ITheme)=> error && css`
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
    `};*/
        
    .image {
        height: ${({thumbSize}: ITheme)=> `${thumbSize || 100}px`};
    }
    .svgWrap, .spinnerWrap {
        width: 100%;
        height: ${({thumbSize}: ITheme)=> thumbSize ? `${thumbSize + StyledLibraryItemPadding*2}px` : 'auto'};
        //padding: 15px;
        perspective: 888px;
    }
    .noPreview {
        width: ${({thumbSize}: ITheme)=> `${thumbSize || 100}px`};
        height: ${({thumbSize}: ITheme)=> `${thumbSize || 100}px`};
        background-color: #fff;
        border: 2px solid ${COLORS.LINE};
        border-radius: 2px;
    }
    .name {
        font-size: 16px;
        font-weight: 200;
        padding: 5px 0;
        margin-top: 5px;
        height: ${StyledLibraryItemNameHeight}px;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: center;
        ${({error}: ITheme)=> error && css`
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
    /*.errorWrap {
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
    }*/
    body > &{
        .SortHandle{
             background-color: ${COLORS.PRIMARY};
        }
    }
`;

export const StyledThemesEmptyGallery = styled('div')`
  font-size: 18px;
  padding: 20px;
  text-align: center;
`;

export const StyledThemesGallery = styled('div')`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
    padding-left: 20px;
    margin: 0 -10px;
    //width: 100%;
    transition: opacity .2s ease-out .2s;
    ${( { theme } ) => theme.media.sm`
        padding-left: 0;
    `};
    ${({disabled}: IThemes)=> disabled && css`
        pointer-events: none;
        opacity: .8;
    `};
    ${({disableEvents}: IThemes)=> disableEvents && css`
        & > ${StyledTheme}:hover {
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


// ------------------

export const ThemesWrapStyled = styled('div')`
  display: flex;
  flex-direction: column;
  .themesHeader {
      position: relative;
      display: flex;
      flex-direction: ${({isMobile}: IThemes)=> isMobile ? 'row' : 'column'};
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      &:first-child{
        margin-top: 10px;
      }
      &Text {
        text-align: center;
        font-size: 28px;
        font-weight: 200;
        margin: 0;
      } 
      &Btn {
        margin-right: 10px;
      }
      &LinkToUserThemes {
          padding: 10px;
      }
  }
  .themesMainBlock {
      display: flex;
      flex-direction: ${({isMobile}: IThemes)=> !isMobile ? 'row' : 'column'};
  }
  .galleryWrap{
    flex-grow: 1;
  }
`
export const ThemesProductTypesStyled = styled('div')`
  padding: 10px 0;
`

export const FiltersStyled = styled('div')`
  width: 220px;
  padding: 10px;
  flex-shrink: 0;
  .filterGroup{
    width: 100%;
    margin-bottom: 10px;
  }
  .filterTitle{
    font-size: 18px;
    text-transform: uppercase;
    padding: 5px 0;
  }
`
export const FormatTitleStyled = styled('div')`
  display: flex;
  align-items: center;
`
export const ThemeCategoriesStyled = styled('div')`
  .categories{
    &Wrap{
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    &Loading{
      padding-top: 30px;
    }
    &SpecProjectKey{
      margin-left: 20px;
      color: green;
      user-select: none;
    }
    &SpecProjectCancel{
      margin: 5px 0 0 20px;
      border-bottom: 1px dashed;
      user-select: none;
    }
  }
  
.category {
    cursor: pointer;
    padding: .5em 0;
    line-height: 1em;
    margin-left: 20px;
    user-select: none;
    &.spec {
        margin-top: 15px;
        margin-left: -2px;
    }
    &:not(.active):hover {
        color: ${COLORS.TEXT_PRIMARY};
        fill: ${COLORS.TEXT_PRIMARY};
    }
    &.active {
        color: ${COLORS.TEXT_WARNING};
        fill: ${COLORS.TEXT_WARNING};
    }
}
`
