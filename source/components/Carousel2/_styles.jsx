import styled, {keyframes, css} from 'styled-components';
import {hexToRgbA} from "libs/helpers";
import {COLORS} from "const/styles";

/** Carousel Styles **/
export const CarouselStyled = styled.div`
    position: relative;
    width: 100%;
    margin: 0 auto;
    border-radius: 10px;
    overflow: hidden;
    touch-action: pan-y;
    height: ${({height})=> height || 0}px;
    ${({theme}) => theme.media && theme.media.sm`
          height: auto;
    `};
    padding-bottom: ${({proportion})=>proportion && `calc(${proportion} * 100%)` || 0};
    z-index: 5;
    transform: translateZ(0);
`;

export const PaginationStyled = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    bottom: 10px;
    left: 0;
    right: 0;
    width: fit-content;
    margin: 0 auto;
    z-index: 2;
    .item {
        width: 10px;
        height: 10px;
        margin: 0 5px;
        padding: 2px;
        border-radius: 50%;
        cursor: pointer;
        background: ${hexToRgbA(COLORS.BLACK,.1)};
        box-shadow: inset 0 1px 5px ${hexToRgbA(COLORS.BLACK,.2)};
        &.active {
            cursor: default;
            &:after{
                display: block;
                content: "";
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: ${COLORS.WHITE};
                box-shadow: 0 1px 3px ${hexToRgbA(COLORS.BLACK,.25)};
            }
        }
    }
`;
export const ArrowBtnStyled = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    top: 0;
    bottom: 0;
    height: 25%;
    min-height: 40px;
    margin: auto;
    cursor: pointer;
    user-select: none;
    background-color: ${hexToRgbA(COLORS.WHITE,.33)};
    fill: ${COLORS.MUTE};
    transition: background-color .1s ease-out, fill .1s ease-out;
    z-index: 3;
    ${({theme}) => theme.media && theme.media.sm`
        width: 25px;
    `};
    ${({isRight})=>isRight ? css`
        right: 0;
        border-radius: 4px 0 0 4px;
    ` : css`
        left: 0;
        border-radius: 0 4px 4px 0;
    `};
    ${({disabled})=>disabled ? css`
        opacity: .5;
        pointer-events: none;
    ` : css`
        &:hover {
            background-color: ${hexToRgbA(COLORS.WHITE,.6)};
            fill: ${COLORS.TEXT};
        }
        &:active {
            background-color: ${hexToRgbA(COLORS.WHITE,.2)};
        }
    `};
`;

export const SlideWrapStyled = styled.div`
    height: 100%;
    ${({move})=> !move && css`transition: transform .5s ease-in-out`};
    //transform: translateX(${({slideIndex})=> (slideIndex * -100 +'%')});
    display: flex;
    flex-wrap: nowrap;
    transform: translateX(calc(${({slideIndex, move})=> (`${move}px - ${slideIndex * 100}%`)}));
`;
export const GestureMoveStyled = styled.div`
    height: 100%;
    display: flex;
    flex-wrap: nowrap;
    transform: translateX(${({move})=> (move +'px')});
`;