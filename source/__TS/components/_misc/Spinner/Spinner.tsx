// @ts-ignore
import React, { useState, useEffect, memo } from 'react';
// @ts-ignore
import styled, { keyframes }  from 'styled-components'
// @ts-ignore
import {COLORS} from 'const/styles'
// @ts-ignore
import {hexToRgbA} from "libs/helpers";



/** interfaces */
interface ISpinner {
    size?: number;
    delay?: number;
    light?: boolean;
    fill?: boolean;
    fillWidth?: boolean;
    intent?: string;
    className?: string;
}

/** Styles */
const spin = keyframes`
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
`;

const StyledSpinner = styled('div')`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    padding: ${({fillWidth}: ISpinner)=>fillWidth ? '50px 0' : 0};
    overflow: hidden;
    &>.loader {
        border: ${({size}: ISpinner)=>Math.round(size*16/100) || 16}px solid ${
    ({intent, light}: ISpinner)=> hexToRgbA(
        light ? COLORS.BLACK : intent ? COLORS[intent.toUpperCase()] || COLORS.INFO : COLORS.INFO
        , .12)
};
        border-top: ${({size}: ISpinner)=>Math.round(size*16/100) || 16}px solid ${
    ({intent, light}: ISpinner)=> light ? COLORS.WHITE : intent ? COLORS[intent.toUpperCase()] || COLORS.INFO : COLORS.INFO
};
        border-radius: 50%;
        width: ${({size}: ISpinner)=>size || 100}px;
        height: ${({size}: ISpinner)=>size || 100}px;
        animation: 1s ${spin} linear infinite;
        display: inline-flex;
        vertical-align: middle;
        align-self: center;
    }
`;


/**
 * Спиннер загрузки
 */
const Spinner: React.FC<ISpinner>  = memo(({className, size, delay, light, fill, intent}) => {
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
});

export default Spinner;