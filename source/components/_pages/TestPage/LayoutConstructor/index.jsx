import React from 'react';
import styled from 'styled-components';

import TurnConstructor from './TurnConstructor';

/**
 * Стили
 */
const MainBlock = styled.div`
    background: #fff;
    position: fixed;
    top:100px;
    left:0;
    right:0;
    bottom:0;
    z-index: 100;
`;

/**
 * Строим layout
 * @param layout
 */
const LayoutConstructor = () => {
    console.log('LayoutConstructor');

    return (<MainBlock>
                <TurnConstructor />
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
