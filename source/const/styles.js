import pSBC from 'shade-blend-color';
import styled, {css} from 'styled-components'
import {EDITOR_SIZES} from "components/_editor/_config";
import MEDIA from "config/media";
import {hexToRgbA} from "../libs/helpers";
/**
 * Цвета
 * @type {Object}
 */
let COLORS = {
    WHITE: '#fff',
    SNOWWHITE: '#f0f5fa',
    ATHENSGRAY: '#eef1f7',
    LAVENDERMIST: '#dde5ef',
    LINE: '#bed0dd',
    NEPAL: '#889db5',
    MUTE: '#6e7a8e',
    TEXT: '#3d4c62',
    BLUEGRAY: '#73a3d0',
    BLACK: '#131825',
    HIBISCUS: '#cc2f69',
    PRIMARY: '#137ed5',
    INFO: '#32a5da',
    WARNING: '#f68225',
    DANGER: '#d83f46',
    SUCCESS: '#53a529',
    YELLOW: '#f7db50',
    LOGO1: '#136db7',
    LOGO2: '#12a3d6'
};

COLORS = {
    ...COLORS,
    TEXT_PRIMARY:   pSBC(-.05, COLORS.PRIMARY),
    TEXT_WARNING:   pSBC(-.05, COLORS.WARNING),
    TEXT_DANGER:    pSBC(-.05, COLORS.DANGER),
    TEXT_INFO:      pSBC(-.05, COLORS.INFO),
    TEXT_SUCCESS:   pSBC(-.04, COLORS.SUCCESS),
    TEXT_MUTE:      pSBC(-.05, COLORS.MUTE),
};

// let MEDIASIZES = {
//     xs: `(max-width: ${MEDIA.xs - 1})`,
//     sm: `(max-width: ${MEDIA.sm - 1})`,
//     md: `(max-width: ${MEDIA.md - 1})`,
//     lg: `(max-width: ${MEDIA.lg - 1})`,
//     xl: `(max-width: ${MEDIA.xl - 1})`,
//
//     HOR: `(orientation: landscape) and (-webkit-min-device-pixel-ratio: 2)`,
//     VERT: `(orientation: portrait) and (-webkit-min-device-pixel-ratio: 2)`,
// };

let MEDIASIZES = Object.keys(MEDIA).reduce((acc, label) => {
    acc[label] = (...args) => css`
      @media (max-width: ${MEDIA[label]}px) {
         ${css(...args)};
      }
   `;
    return acc
}, {});
MEDIASIZES.hor = (...args) => css`
      @media (orientation: landscape )  {
         ${css(...args)};
      }
   `;
MEDIASIZES.vert = (...args) => css`
      @media (orientation: portrait) {
         ${css(...args)};
      }
   `;
MEDIASIZES.x2 = (...args) => css`
      @media (min-device-pixel-ratio: 2) {
         ${css(...args)};
      }
   `;

export { COLORS, MEDIASIZES as MEDIA };


/**
 * Стильные компоненты
 */

// Разделитель кнопок
export const Divider = styled.div`
    flex-grow: 1;
    min-width: 10px;
`;
// Верстка - строка и колонки
export const Row = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: 0 -10px;
`;
export const Col = styled.div`
    padding: 0 10px;
    width: ${({x,w})=>w ? (
        x ? (
            Math.round(10000*x/w)/100
        ): Math.round(10000/w)/100
    ): 100}%;
    max-width: 100%;
    text-align: ${({align})=>align ? align : 'inherit'};
    .mr {
        margin-right: 10px;
    }
    .looong {
        padding: 0 40px;
    }
    .rightProductBlock {
        padding-top: 20px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }
    .iconWrap {
        padding: 4px;
        display: inline-block;
    }
    .success {
        color: ${COLORS.TEXT_SUCCESS};
        fill: ${COLORS.TEXT_SUCCESS};
    }
    .mute {
        color: ${COLORS.TEXT_MUTE};
        fill: ${COLORS.TEXT_MUTE};
    }
`;

// Ограничитель длинного текста
export const TextOverflow = styled.div`
    overflow: hidden;
    padding-right: 2px;
    text-overflow: ellipsis;
    white-space: pre;
`;
//
export const Wrapper = styled.div`
    position: relative;
    max-width: ${MEDIA.lg + 40}px;
    margin: 0 auto;
    padding: 0 20px;
    flex-grow: 1;
    ${({ theme }) => theme.media.md`
        padding: 10px 0;
    `}
`;
// Кнопка default
const BtnBase = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: ${COLORS.TEXT};
    font-size: ${({large})=>(large ? 18 : 16)}px;
    padding: 0 ${({small, large})=>(small ? 8 : large ?  12 :10)}px;
    border-radius: 2px;
    height: ${({small, large})=>(small ? 30 : large ?  50 :40)}px;
  
    ${({width, widthFill})=>width ? css`
        width: ${width}px;
    ` : `
        width: ${widthFill ? '100%' : 'auto'};
    `};
    
    cursor: pointer;
    transition: color .2s ease-out, fill .2s ease-out, background-color .2s ease-out, box-shadow .1s ease-out;
    user-select: none;
    background: transparent;
    border: none;
    line-height: 1em;
    box-shadow: inset 0 2px 12px 1px rgba(0, 0, 0, 0);
    ${({inInput})=>inInput && css`
        height: 30px;
        position: absolute;
        top: 5px;
        right: 5px;
        z-index: 3;
    `}
    ${({iconed})=>iconed && css`
        padding: 0 ${({small, large})=>(small ? 3 : large ?  6 :5)}px;
    `}
`;

/**
 * Цвета и состояния кнопки
 */
const Btn = styled(BtnBase)`
    ${({intent})=>{
    if (intent) {
        switch (intent) {
            case 'primary': return css`
                    color: ${COLORS.WHITE};
                    background-color: ${COLORS.PRIMARY};
                    &:hover{
                        background-color: ${COLORS.TEXT_PRIMARY};
                    }
                    &:active{
                        box-shadow: inset 0 2px 12px 1px rgba(0, 0, 0, 0.13);
                    }
                `;
            case 'success': return css`
                    color: ${COLORS.WHITE};
                    fill: ${COLORS.WHITE};
                    background-color: ${COLORS.SUCCESS};
                    &:hover{
                        background-color: ${COLORS.TEXT_SUCCESS};
                    }
                    &:active{
                        box-shadow: inset 0 2px 12px 1px rgba(0, 0, 0, 0.1);
                    }
                `;
            case 'warning': return css`
                    color: ${COLORS.WHITE};
                    background-color: ${COLORS.WARNING};
                    &:hover{
                        background-color: ${COLORS.TEXT_WARNING};
                    }
                    &:active{
                        box-shadow: inset 0 2px 12px 1px rgba(0, 0, 0, 0.1);
                    }
                `;
            case 'danger': return css`
                    color: ${COLORS.WHITE};
                    background-color: ${COLORS.DANGER};
                    &:hover{
                        background-color: ${COLORS.TEXT_DANGER};
                    }
                    &:active{
                        box-shadow: inset 0 2px 12px 1px rgba(0, 0, 0, 0.1);
                    }
                `;
            case 'info': return css`
                    color: ${COLORS.WHITE};
                    background-color: ${COLORS.INFO};
                    &:hover{
                        background-color: ${COLORS.TEXT_INFO};
                    }
                    &:active{
                        box-shadow: inset 0 2px 12px 1px rgba(0, 0, 0, 0.1);
                    }
                `;
            case 'minimal': return css`
                &:hover{
                    color: ${COLORS.TEXT_PRIMARY};
                    fill: ${COLORS.TEXT_PRIMARY};
                }
                `;
            case 'minimal-primary': return css`
                &:hover{
                    color: ${COLORS.TEXT_PRIMARY};
                    fill: ${COLORS.TEXT_PRIMARY};
                }
                `;
            case 'minimal-warning': return css`
                &:hover{
                    color: ${COLORS.TEXT_WARNING};
                    fill: ${COLORS.TEXT_WARNING};
                }
                `;
            case 'minimal-danger': return css`
                &:hover{
                    color: ${COLORS.TEXT_DANGER};
                    fill: ${COLORS.TEXT_DANGER};
                }
                `;
        }
    } else return css`
                background-color: ${COLORS.ATHENSGRAY};
                &:hover{
                    background-color: ${COLORS.LAVENDERMIST};
                }
                &:active{
                    box-shadow: inset 0 2px 12px 1px rgba(0, 0, 0, 0.08);
                }
            `;
    }};
    ${({disabled})=>disabled && css`
        pointer-events: none;
        filter: grayscale(.33);
        opacity: .7;
    ` };
`;


export const getInputIntentColor = (intent, focus, alpha) => {
    let color = focus ? COLORS.PRIMARY : COLORS.LINE;
    if (intent) switch (intent) {
        case 'primary':
            color = COLORS.PRIMARY ;
            break;
        case 'success':
            color = COLORS.SUCCESS ;
            break;
        case 'warning':
            color = COLORS.WARNING ;
            break;
        case 'danger':
            color = COLORS.DANGER ;
            break;
        case 'info':
            color = COLORS.INFO ;
            break;
        case 'minimal':
            color = COLORS.WHITE ;
            break;
    }
    return alpha ? hexToRgbA(color, alpha) : color;
};


// Input
export const Input = styled.div`
    position: relative;
    width: 100%;
    &>input, &>textarea {
        position: relative;
        width: 100%;
        outline: none;
        border: 2px solid ${({intent})=>getInputIntentColor(intent)};
        border-radius: 2px;
        background: ${COLORS.WHITE};
        height: 40px;
        padding: 0 10px;
        line-height: 40px;
        color: ${COLORS.TEXT};
        font-size: 16px;
        font-weight: 400;
        transition: box-shadow 100ms cubic-bezier(0.4, 1, 0.75, 0.9);
        appearance: none;
        box-shadow: none;
        &:hover {
            box-shadow: 0 0 4px 1px ${({intent})=>getInputIntentColor(intent,  true, .2)};
        }
        &:focus {
            box-shadow: 0 0 0 1px ${({intent})=>getInputIntentColor(intent,  true)}, 0 0 0 3px ${({intent})=>getInputIntentColor(intent,  true, .3)}, inset 0 1px 2px ${hexToRgbA(COLORS.BLACK, .1)}
        }
        &::placeholder {
            opacity: 1;
            color: ${COLORS.MUTE};
        }
        
        ${({disabled})=> disabled && css`
            box-shadow: none;
            background: ${COLORS.ATHENSGRAY};
            cursor: not-allowed;
            color: ${COLORS.TEXT_MUTE};
            resize: none;
            &:hover{
              box-shadow: none;
            }
        `};
        ${({latent})=> latent && css`
            display: none;
        `};
        
        ${({large, small, leftEl, rightEl}) => large ? css`
            height: 50px;
            line-height: 50px;
            font-size: 18px;
            ${leftEl && 'padding-left: 50px'};
            ${rightEl && 'padding-left: 50px'};
            ` : small ? css`
                height: 30px;
                line-height: 30px;
                ${leftEl && 'padding-left: 30px'};
                ${rightEl && 'padding-left: 30px'};
            ` : css`
            ${leftEl && 'padding-left: 40px'};
            ${rightEl && 'padding-left: 40px'};
                `
        };
    }
    &>textarea {
        height: auto;
        line-height: 1em;
        //min-height: 70px;
        padding: 10px;
        max-width: 100%;
        min-width: 100%;
    }
    &>.latentText {
        display: inline-block;
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        color: ${({isLoading})=> isLoading ? COLORS.MUTE : COLORS.TEXT};
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        max-width: 100%;
        ${({latent})=> !latent && css`
            display: none;
        `};
        & + input {
            padding-left: 8px;
        }
        .btnEdit{
            cursor: pointer;
            margin-left: 2px;
            fill: ${COLORS.LINE};
        }
        ${({disabled})=> !disabled && css`
            cursor: ${({isLoading})=> isLoading ? 'default' : 'pointer'};
            &:hover {
                color: ${({isLoading})=> isLoading ? COLORS.MUTE : COLORS.TEXT_PRIMARY};
                .btnEdit{
                    fill: ${COLORS.PRIMARY};
                }
            }
        `};
    } 

    &>.leftEl, &>.rightEl{
        position: absolute;
        top: 8px;
        z-index: 3;
        &:first-child {
            left: 8px;
        }
        &:last-child {
            right: 8px;
        }
        &.latent{
          top: 5px;
          right: 4px;
        }
    }
    .loader {
      display: inline-flex;
      width: auto;
      height: auto;
      margin-left: 2px;
    }
`;

// Checkbox
const FormControl = styled.div`
    display: ${( { display } ) => display || 'inline-flex'};
    font-size: 0;
    align-items: center;
    user-select: none;
    height: ${( { height } ) => height || 40}px;
    //min-width: ${( { maxWidth } ) => maxWidth || 40}px;
    cursor: pointer;
    transition: opacity .1s ease-out;
    ${( { inline } ) => inline && css`
        &:not(:last-child){
            margin-right: 20px;
        }
    `}
    .control {
        width: 24px;
        height: 24px;
        border: 2px solid ${COLORS.LINE};
        border-radius: 2px;
        margin-top: -.25em;
        transition: border-color .1s ease-out;
        background-color: #fff;
        &.box{
        }
        &.radio{
            border-radius: 12px;
            padding: 5px;
            &:before{
               display: block;
               content: "";
               width: 10px;
               height: 10px;
               border-radius: 5px;
               background-color: ${({ intent }) => intent === 'warning' ? COLORS.WARNING : COLORS.PRIMARY };
               opacity: 0;
               transform: scale(0);
               transition: all .1s cubic-bezier(0.18, 0.89, 0.32, 1.28);
               ${({active})=>active && css`
                  
                `}
               } 
            
        }
    }
    
    .icon {
        margin: -2px;
        fill: ${({ intent }) => intent === 'warning' ? COLORS.WARNING : COLORS.PRIMARY };
        opacity: 0;
        transform: scale(0);
        transition: all .1s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }
    .label {
        line-height: 1em;
        margin-left: 10px;
        font-size: initial;
    }

    &:hover {
        .icon {
            opacity: ${({active})=>active ? 1 : .5 };
        }
        .control {
            border-color: ${({active, intent})=>active ? (intent === 'warning' ? COLORS.WARNING : COLORS.PRIMARY) : COLORS.NEPAL };
            &.radio:before{
              opacity: ${({active})=>active ? 1 : .5 };
            }
        }
        
    }
    &:active {
        .icon {
            transform: scale(.9);
        }
        .control.radio:before{
             transform: scale(.9);
            }
    }
    ${({active, intent})=>active && css`
        .icon {
            opacity: 1;
            transform: scale(1);
        }
        .control {
            border-color: ${ intent === 'warning' ? COLORS.WARNING : COLORS.PRIMARY };
            &.radio:before{
             opacity: 1;
                transform: scale(1);
            }
        }
    `}
    ${({disabled})=>disabled && css`
        opacity: .5;
        pointer-events: none;
        .icon {
            fill: ${COLORS.NEPAL};
        }
        .control {
            border-color: ${COLORS.LINE};
        }
    `}
`;

const Checkbox = styled(FormControl)`
  height: inherit;
  //min-height: 40px;
`;
const StyledRadio = styled(Checkbox)`
  height: inherit;
`;

const StyledScrollbar = styled('div')`
    overflow-x: scroll;
    overflow-y: hidden;
    user-select: none;
    -webkit-overflow-scrolling: touch;
    ::-webkit-scrollbar {
        height: 15px;
    }    
    ::-webkit-scrollbar-track {
        background-color: ${COLORS.ATHENSGRAY};
        box-shadow: inset 0 0 5px ${hexToRgbA(COLORS.BLACK, .3)};
    }
    ::-webkit-scrollbar-thumb {
        background: ${COLORS.WHITE};
        border: 1px solid ${COLORS.LAVENDERMIST};
        border-bottom: none;
        &:hover {
            background: ${COLORS.BLUEGRAY}; 
            border-color: ${COLORS.BLUEGRAY};
        }
        &:active {
            background: ${COLORS.TEXT}; 
            border-color: ${COLORS.TEXT};
        }
    } 
`;

export {
    Btn,
    BtnBase,
    Checkbox,
    StyledRadio,
    FormControl,
    StyledScrollbar,
};