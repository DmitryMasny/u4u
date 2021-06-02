// @ts-ignore
import React, { memo } from 'react';
// @ts-ignore
import { useSelector } from "react-redux";
// @ts-ignore
import styled, {css} from 'styled-components';
// @ts-ignore
import { COLORS } from 'const/styles'

import { windowIsMobileSelector } from "../_selectors";

/** Interfaces */
interface IEmptyLibrary {
    type: 'photo' | 'text';
}

/** Styles */
const EmptyLibraryStyled = styled( 'div' )`
    width: 100%;
    height: 100%;
    color: ${ COLORS.TEXT_MUTE };
    text-align: center;
    display: flex;
    flex-direction: ${({isMobile}: {isMobile?: boolean}) => isMobile ? 'column-reverse' : 'column'};
    overflow: hidden;
    
    .text{
        color: ${COLORS.TEXT_INFO};
        margin: 10px 20px 20px;
        font-size: 18px;
        font-style: italic;
        ${({isMobile}: {isMobile?: boolean}) => isMobile && css`
            margin: 10px 20px 0;
            font-size: 16px;
        `};
    }
    .emptyLibraryImage{
        margin: 0 auto;
        max-width: 240px;
        padding: 20px;
        fill: ${COLORS.LAVENDERMIST};
    }
    .lineImage{
        margin: 10px 30px;
        width: 30%;
        height: 71px;
        ${({isMobile}: {isMobile?: boolean}) => isMobile && css`
            height: 60px;
            transform: scaleY(-1);
        `};
    }
`;

/**
 * Библиотека фотографий
 */
const EmptyLibrary: React.FC<IEmptyLibrary> = ( { type } ) => {
    const isMobile = useSelector( windowIsMobileSelector );
    if ( !type ) return null;

    let text = '';
    switch ( type ) {
        case 'photo':
            text = `В этом проекте нет фотографий, но вы можете их добавить. ${ isMobile ? '' : 'Нажмите кнопку "Добавить фотографии" или перетащите их из папки на компьютере'}`;
            break;
        case 'text':
            text = 'Добавьте текст на страницу. Или выберите существующее текстовое поле';
            break;
        default:
            text = '';
    }

    return (
        <EmptyLibraryStyled isMobile={isMobile}>
            {text && <div className="lineImage">
                <svg height="100%" viewBox="0 0 36 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M6 0L0.585568 10.1989L12.1253 9.78848L6 0ZM5.32266 9.07132C7.89607 44.6967 25.2362 64.8729 34.4567 70.8396L35.5433 69.1604C26.8946 63.5639 9.84968 43.9824 7.31746 8.92723L5.32266 9.07132Z"
                        fill="#32a5da"/>
                </svg>
            </div>}
            {text && <div className="text">{ text }</div>}
            {!isMobile && <div className="emptyLibraryImage">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 430.23 430.23">
                    <path d="M217.875,159.668c-24.237,0-43.886,19.648-43.886,43.886c0,24.237,19.648,43.886,43.886,43.886
                    c24.237,0,43.886-19.648,43.886-43.886C261.761,179.316,242.113,159.668,217.875,159.668z M217.875,226.541
                    c-12.696,0-22.988-10.292-22.988-22.988c0-12.696,10.292-22.988,22.988-22.988h0c12.696,0,22.988,10.292,22.988,22.988
                    C240.863,216.249,230.571,226.541,217.875,226.541z"/>
                    <path d="M392.896,59.357L107.639,26.966c-11.071-1.574-22.288,1.658-30.824,8.882c-8.535,6.618-14.006,16.428-15.151,27.167
                    l-5.224,42.841H40.243c-22.988,0-40.229,20.375-40.229,43.363V362.9c-0.579,21.921,16.722,40.162,38.644,40.741
                    c0.528,0.014,1.057,0.017,1.585,0.01h286.824c22.988,0,43.886-17.763,43.886-40.751v-8.359
                    c7.127-1.377,13.888-4.224,19.853-8.359c8.465-7.127,13.885-17.22,15.151-28.212l24.033-212.114
                    C432.44,82.815,415.905,62.088,392.896,59.357z M350.055,362.9c0,11.494-11.494,19.853-22.988,19.853H40.243
                    c-10.383,0.305-19.047-7.865-19.352-18.248c-0.016-0.535-0.009-1.07,0.021-1.605v-38.661l80.98-59.559
                    c9.728-7.469,23.43-6.805,32.392,1.567l56.947,50.155c8.648,7.261,19.534,11.32,30.825,11.494
                    c8.828,0.108,17.511-2.243,25.078-6.792l102.922-59.559V362.9z M350.055,236.99l-113.894,66.351
                    c-9.78,5.794-22.159,4.745-30.825-2.612l-57.469-50.678c-16.471-14.153-40.545-15.021-57.992-2.09l-68.963,50.155V149.219
                    c0-11.494,7.837-22.465,19.331-22.465h286.824c12.28,0.509,22.197,10.201,22.988,22.465V236.99z M409.112,103.035
                    c-0.007,0.069-0.013,0.139-0.021,0.208l-24.555,212.114c0.042,5.5-2.466,10.709-6.792,14.106c-2.09,2.09-6.792,3.135-6.792,4.18
                    V149.219c-0.825-23.801-20.077-42.824-43.886-43.363H77.337l4.702-40.751c1.02-5.277,3.779-10.059,7.837-13.584
                    c4.582-3.168,10.122-4.645,15.674-4.18l284.735,32.914C401.773,81.346,410.203,91.545,409.112,103.035z"/>
                </svg>
            </div>}
        </EmptyLibraryStyled>
    )
}

export default memo( EmptyLibrary );