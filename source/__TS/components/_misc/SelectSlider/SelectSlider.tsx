// @ts-ignore
import React, { memo, useState, useRef, useEffect } from 'react';
// @ts-ignore
import styled from 'styled-components';
// @ts-ignore
import Slider from 'react-input-slider';
// @ts-ignore
import { Tooltip } from "components/_forms";
// @ts-ignore
import { COLORS } from 'const/styles';

interface ISliderParams {
    value: number;
    min: number;
    max: number;
    step?: number;
    width?: number;
}

const SliderWrapStyled = styled('div')`
  margin: 0 10px;
  height: 28px;
`

const styles = {
    track: {
        backgroundColor: COLORS.LINE,
        height: 2,
        borderRadius: 1,
    },
    active: {
        backgroundColor: COLORS.PRIMARY
    },
    thumb: {
        width: 20,
        height: 20,
        backgroundColor: 'white',
        border: `2px solid ${COLORS.LINE}`,
        boxShadow: 'none',
        transition: 'border-color .2s ease-out',
        '&:hover': {
            borderColor: COLORS.BLUEGRAY,
        },
        '&:active': {
            borderColor: COLORS.PRIMARY,
        }
    },
    disabled: {
        opacity: 0.5
    }
};

const checkInteger = ( n ) => {
    // @ts-ignore
    if ( Number.isInteger( n ) ) {
        return n
    }
    return n.toFixed(2);
}

const SliderWrap = memo(({ xParams, x, onChange }: any) => (
    <SliderWrapStyled>
        <Slider styles={styles}
                axis="x"
                x={x}
                xmin={xParams.min}
                xmax={xParams.max}
                xstep={xParams.step || 1}
                onChange={ onChange } />
    </SliderWrapStyled>
))


const SelectSlider = ( { xParams, yParams, callBackFunction, debounce = 0, InnerDrawComponent, width = 'auto' }: { xParams?: ISliderParams, yParams?: ISliderParams, callBackFunction: any, debounce?: number, InnerDrawComponent: any, width: number | string } ) => {
    const [ state, setState ] = useState( { x : xParams.value } );
    const [ active, setActive ] = useState( false );
    const timeoutRef = useRef( null );

    const updateSlider = ( state ) => {
        if ( timeoutRef.current ) clearTimeout( timeoutRef.current );
        timeoutRef.current = setTimeout( () => callBackFunction( state ), debounce );
    }
    const onChangeHandler = ( { x } ) => (x || x === 0) && setState( { x: checkInteger( x ) } );

    useEffect( () => {
        if ( xParams.value !== state.x ) {
            updateSlider( state );
        }
    }, [ state ] );

    return  (
        <Tooltip intent={'slider'}
                 trigger={ 'click' }
                 onVisibilityChange={(visible)=> setActive(visible) }
                 tooltip={<SliderWrap x={state.x} xParams={xParams} onChange={onChangeHandler} />}
                 placement="bottom"
            // styleParent={ { display: 'flex' } }
        >
            <InnerDrawComponent x={state.x} width={width} onChange={(x)=>onChangeHandler({x})} active={active}/>
        </Tooltip>
    )
}

export default SelectSlider;