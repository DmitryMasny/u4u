import React, {memo} from 'react';
// import pSBC from 'shade-blend-color';
import styled, {css} from 'styled-components'
import {COLORS} from "const/styles";

// Кнопки разных цветов
const ColorSwatchStyled = styled.div`
    width: 26px;
    height: 26px;
    border-radius: 13px;
    margin: -1px;
    border: 1px solid ${COLORS.LAVENDERMIST};
    background-color: #fff;
    .circle{
        position: relative;
        display: flex;
        width: 20px;
        height: 20px;
        margin: 2px;
        border-radius: 10px;
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKAQMAAAC3/F3+AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURcHBwfHx8RZMN0cAAAARSURBVAjXY2A/wICMfjAgIwB8gwi84a8abQAAAABJRU5ErkJggg==');
        overflow: hidden;
        .color {
            height: 100%;
            width: 100%;
            flex-shrink: 1;
            background-color: ${({color, disabled})=>((disabled || !color) ? COLORS.LAVENDERMIST : color)};
            ${({disabled})=>disabled && css`
                &:after{
                    content: "";
                    position: absolute;
                    width: 1px;
                    height: 25px;
                    top: -2px;
                    left: 10px;
                    transform: rotate(-45deg);
                    background-color: #fff;
                }
            `}
            &:last-child {
                opacity: ${({opacity, disabled})=>((!disabled && opacity) ? opacity : 1)};
            }
        }
    }
`;

const ColorSwatch = memo(({color, opacity, disabled, onClick}) => <ColorSwatchStyled opacity={opacity} color={color} disabled={disabled}>
    <div className="circle" onClick={onClick || null}>
        <div className="color"/>
        { !disabled && opacity && opacity < 1 && <div className="color"/> }
    </div>
</ColorSwatchStyled>);

export default ColorSwatch;