import React from 'react';
import styled, { css } from 'styled-components';
import {COLORS} from "const/styles";

/**
 * Styles
 */
const StyledFilterBtn = styled.div`    
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    line-height: 1em;
    border: 2px solid ${COLORS.NEPAL};
    margin-right: 10px;
    margin-bottom: 10px;
    min-width: 100px;
    padding: 5px 10px;
    background-color: transparent;
    cursor: pointer;
    transition: border-color .12s ease-out;
    user-select: none;

    ${({large})=>large && css`
      padding: 10px;
        .icon{
            padding: 2px 2px 8px;
        }
    `}
    &:hover{
        border-color: ${COLORS.PRIMARY};
    }
    &:last-child{
        margin-right: 0;
    }

    .icon{
        padding: 2px 2px 4px;
        transition: transform .2s ease-in-out;
        ${({isRotate}) => isRotate && 'transform: rotate(90deg)'};
    }

    ${({active, toggle})=>active && css`
        border-color: ${COLORS.WARNING};
        outline: 1px solid ${COLORS.WARNING};
        background-color: ${COLORS.WHITE};
        cursor: ${toggle ? 'pointer': 'default'};
        ${toggle ? css`
            &:hover{
                        border-color: ${COLORS.PRIMARY};
                        outline: 1px solid ${COLORS.PRIMARY};
                    }
        ` : css`
            &:hover{
                        border-color: ${COLORS.WARNING};
                    }
        `};
    `}
`;

/**
 * FilterBtn
 * @param children
 * @param className
 * @param icon
 * @param title
 * @param small
 * @param large
 * @param toggle
 * @param onClick
 * @param active
 * @param isRotate
 * @returns {*}
 * @constructor
 */
const FilterBtn = ({children, className, icon, title, small, large, toggle, onClick, active, rotate}) => {

    return (
        <StyledFilterBtn onClick={onClick}
                         active={active}
                         small={small}
                         large={large}
                         toggle={toggle}
                         isRotate={!!rotate}
                         className={className}
        >
            {icon && <span className="icon">
                    {icon}
                </span>}
            {title && <span className="title">
                    {title}
                </span>}
            {children}
        </StyledFilterBtn>);
};

export default FilterBtn;
