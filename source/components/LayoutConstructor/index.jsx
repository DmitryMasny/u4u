import React from 'react';
import { useSelector } from "react-redux";

import styled from 'styled-components';

import AreaConstructor from './AreaConstructor';
import { windowWidthSelector, windowHeightSelector } from "selectors/global";

/**
 * Стили
 */
const MainBlock = styled.div`
    width: 100%;
    height: 100%;
    z-index: 100;
    background: transparent;
    .react-transform-component{
        overflow: visible !important;
    }
`;

/**
 * Строим layout
 */
const LayoutConstructor = () => {
    const windowWidth = useSelector( windowWidthSelector );
    const windowHeight = useSelector( windowHeightSelector );
    return (<MainBlock id={"main-block"}>
                <AreaConstructor windowSize={{width: windowWidth, height: windowHeight}}/>
            </MainBlock>)
};

export default LayoutConstructor;




/*
 * Типизация входящих данных
 */
/*
LayoutConstructor.propTypes = {
    layout: shape({
                    id: string.isRequired,
                    userId:  string.isRequired,
                    type: string.isRequired,
                    format: shape({
                                            w: number.isRequired,
                                            h: number.isRequired,
                                         }).isRequired,
                    blockSize: shape({
                                            w: number.isRequired,
                                            h: number.isRequired,
                                          }).isRequired,
                    coverType: string.isRequired,
                    lamination: string.isRequired,
                    photos: array,
                    backgrounds: array,
                    stickers: array,
                    turns: arrayOf(object).isRequired
                }).isRequired
};
*/
