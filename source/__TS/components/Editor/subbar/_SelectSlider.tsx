// @ts-ignore
import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import styled, { css } from 'styled-components';

// @ts-ignore
import { IconArrowDropDown } from "components/Icons";
// @ts-ignore
import { COLORS } from 'const/styles';


/** Interfaces */
interface ISelectSliderDropDown {
    x?: number | string;
    text?: string;
    onChange?: any;
    active?: boolean;
    width: string | number;
}

/** Styles */

const BlockSelectDropDown = styled( 'div' )`
    display: flex;
    vertical-align: middle;
    align-items: center;
    cursor: pointer;
    height: 36px;
    border: 1px solid ${COLORS.LINE};
    border-radius: 2px;
    padding: 0 0 0 5px;
    ${({width}) => width && width > 0 && css`
        width: ${width}px;
    `}
    ${({active}) => active && css`
        border-color: ${COLORS.PRIMARY};
        .icon {
          transform: scaleY(-1);
        }
    `}
`;

const BlockSelectDropDownInput = styled( 'input' )`
    position: relative;
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
    border-radius: 2px;
    padding: 0;
    font-family: inherit;
    line-height: 40px;
    color: ${COLORS.TEXT};
    font-size: 16px;
    font-weight: 400;
    appearance: none;
    box-shadow: none;
    &::placeholder {
        opacity: 1;
        color: ${COLORS.MUTE};
    }
`;
const BlockSelectText = styled( 'div' )`
    display: flex;
    text-align: left;
    align-items: center;
    width: 100%;
    height: 100%;
    font-size: 16px;
`;

/**
 * Слайдер компоненты
 */
const SelectSliderDropDown = ( { x = '', text = '', width = 100, onChange = null, active }: ISelectSliderDropDown ) => {
    const [value, setValue] = useState(x);
    const inputRef = useRef(null);
    const onChangeHandler = (e) => {
        const numberValue = parseFloat(e.target.value);
        setValue(numberValue === 0 ? '0' : numberValue || '')
        if (numberValue || numberValue === 0) onChange(numberValue)
    }

    useEffect(()=>{
        setValue(x)
    }, [x])

    useEffect(()=>{
        if (active && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [active, inputRef])

    return (
        <BlockSelectDropDown width={ width } active={active}>
            { active ?
                <BlockSelectDropDownInput ref={inputRef} type="text" value={value} onChange={onChangeHandler} onBlur={(e)=>onChange(parseFloat(e.target.value) || 0)}/>
                :
                <BlockSelectText>{value} {text}</BlockSelectText>
            }
            <IconArrowDropDown className="icon"/>
        </BlockSelectDropDown>
    )
}

export const SelectSliderDropDownMM = ( props: ISelectSliderDropDown ) => <SelectSliderDropDown {...props} text={ 'мм' }/>

export const SelectSlideDropDownAuto = ( props: ISelectSliderDropDown ) => {
    let text = '';

    if ( props.x === 0 ) text = 'Авто';

    return <SelectSliderDropDown {...props} x={props.x || ''} text={text}/>;
};

export default SelectSliderDropDown;