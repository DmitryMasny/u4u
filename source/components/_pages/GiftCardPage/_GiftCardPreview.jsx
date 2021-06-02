import React from 'react';
import styled from 'styled-components';

import {IMG_DIR} from "config/dirs";


/**
 * Styles
 */
const StyledGiftCardPreview = styled('svg')`
    position: relative;
    font-size: 0;
    width: calc(100% - 40px);
    max-width: 360px;
    margin: 20px 10px;
    ${({theme}) => theme.media.sm`
        margin: 20px 10px 10px;
        width: calc(100% - 20px);
    `};
`;


/**
 * Превью подарочного сертификата
 */
const GiftCardPreview = ({ amount, url } ) => {
    return <StyledGiftCardPreview preserveAspectRatio="xMidYMid meet"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 540 380">
                <image href={url} width={540} height={380}/>
                {/*<text x="50" y="310" fontSize="20" fill="#211f1e" textAnchor="start">код</text>*/}
                <text x="50" y="350" fontSize="35" fill="#111" textAnchor="start">AA-1111-1A1A</text>
                <text x="50" y="270" fontSize="90" fill="#fff" textAnchor="start" >{amount && amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") || 500}₽</text>
            </StyledGiftCardPreview>;
};

export default GiftCardPreview;