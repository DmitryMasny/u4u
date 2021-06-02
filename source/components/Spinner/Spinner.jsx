import React, { useState, useEffect, memo } from 'react';
import styled, { keyframes }  from 'styled-components'
import {COLORS} from 'const/styles'
import {hexToRgbA} from "libs/helpers";

const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const StyledSpinner = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    padding: ${({fillWidth})=>fillWidth ? '50px 0' : 0};
    overflow: hidden;
    &>.loader {
        border: ${({size})=>Math.round(size*16/100) || 16}px solid ${
            ({intent, light})=> hexToRgbA(
                light ? COLORS.BLACK : intent ? COLORS[intent.toUpperCase()] || COLORS.INFO : COLORS.INFO
                , .12)
        };
        border-top: ${({size})=>Math.round(size*16/100) || 16}px solid ${
            ({intent, light})=> light ? COLORS.WHITE : intent ? COLORS[intent.toUpperCase()] || COLORS.INFO : COLORS.INFO
        };
        border-radius: 50%;
        width: ${({size})=>size || 100}px;
        height: ${({size})=>size || 100}px;
        animation: 1s ${spin} linear infinite;
        display: inline-flex;
        vertical-align: middle;
        align-self: center;
    }
`;


/**
 * Спиннер загрузки
 */
const Spinner = ({className, size, delay, light, fill, intent}) => {
    const [showLoader, setShowLoader] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoader(true);
        }, delay || delay === 0 ? 0 : 700);
        return () => clearTimeout( timer );
    }, []);

    if (!showLoader) return null;

    return <StyledSpinner size={size} light={light} fillWidth={fill} intent={intent} className={className || ''}>
                <div className="loader"/>
            </StyledSpinner>
};

export default memo(Spinner);