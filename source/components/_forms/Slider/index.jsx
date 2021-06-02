import React, { memo, useState, useEffect, useRef } from 'react';
import {useSelector} from "react-redux";
import Draggable, {DraggableCore} from 'react-draggable';

import styled, {css} from 'styled-components'
import {COLORS} from 'const/styles'
import {hexToRgbA} from 'libs/helpers'
import {Input} from "components/_forms";
import {windowWidthSelector} from "../../_editor/_selectors";


/** Styles */
const StyledSliderWrap = styled.div`
    display: flex;
    width: 100%;
`;

const StyledSlider = styled.div`
${({size, isDragging})=> css`
    position: relative;
    width: calc(100% - 120px);
    height: 40px;
    margin: 0 -${size/2}px;
    .handler {
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background-color: ${COLORS.WHITE};
      border: 2px solid ${isDragging ? COLORS.PRIMARY : COLORS.LINE };
      box-shadow: ${isDragging ? '1px 2px 5px rgba(0,0,0,.1)' : 'none'};
    }
    &:before {
      content: "";
      position: absolute;
      left: ${size/2}px;
      right: ${size/2}px;
      top: 0;
      bottom: 0;
      height: 2px;   
      margin: auto; 
      border-radius: 1px;
      background-color: ${COLORS.LINE};
    }
`}`;

const StyledValue = styled.div`
    width: 100px;
    margin-left: 20px;
`;


/**
 * Слайдер
 */
const Slider = memo(({className, min, max, value = 0, step = 1, onChange}) => {
    if ( !min || !max ) return null;
    const size = 20;

    const [update, setUpdate] = useState( 0 );               // счетчик принудительного обновления
    const [isDragging, setIsDragging] = useState( false );  // активное состояние для стилей
    const [tempValue, setTempValue] = useState( null );     // значение внутри компонента
    const [slider, setSlider] = useState( {} );             // размеры слайдера
    const sliderEl = useRef( null );
    const handlerEl = useRef( null );
    const windowWidth = useSelector( state => windowWidthSelector( state ) );

    // Обновляем значение внутри
    useEffect(()=>{
        setTempValue(value);
    }, [value]);

    // Считаем размеры слайдера
    useEffect(()=>{
        if (sliderEl.current) {
            const {x, width} = sliderEl.current.getBoundingClientRect();
            setSlider({
                x: x, width: width, scale: (width - size)/(max - min)
            });
        }
    }, [sliderEl.current, windowWidth, min, max]);


    // пересчитываем значение с учетом min, max, step
    const setRightValue = (value) => {
        let v = parseFloat(value) || 0;

        if (step) {
            v = Math.round(v/step) * step;
        }

        if (v < min) {
            v = min;
        } else if (v > max) {
            v = max;
        }
        return v;
    };

    // Начали тащить - ставим активное состояние
    const startHandler = () => {
        setIsDragging(true);
    };

    // тащим - обновляем значение
    const dragHandler = () => {
        const handlerX = handlerEl.current.getBoundingClientRect().x;
        const v = Math.round( (handlerX - slider.x) / slider.scale + min );
        setTempValue( setRightValue( v ) );
    };

    // Закончили тащить - выключаем активное состояние
    const stopHandler = () => {
        setIsDragging(false);
        onChange(tempValue);
    };

    // Меняем значение через поле ввода
    const onChangeHandler = val => {
        const correctValue = setRightValue( val );
        setTempValue( correctValue );
        setUpdate( update + 1 );
        if ( value !== correctValue ) onChange( correctValue );
    };

    // Считаем координаты в px, исходя из значения
    const position = Math.round(slider.scale * (tempValue - min) * 100)/100;

    return <StyledSliderWrap>
        <StyledSlider className={className} size={size} isDragging={isDragging} ref={sliderEl}>
            <Draggable
                axis={'x'}
                bounds={'parent'}
                defaultPosition={{x: 0, y: size/2}}
                position={{x: position, y: size/2}}
                // grid={[Math.round(step * slider.scale * 10)/10, 0]}
                onStart={startHandler}
                onDrag={dragHandler}
                onStop={stopHandler}
            >
                <div className="handler" ref={handlerEl}/>
            </Draggable>
        </StyledSlider>
        <StyledValue>
            <Input latent
                   update={update}
                   value={tempValue || ''}
                   onChange={onChangeHandler}
            />
        </StyledValue>
    </StyledSliderWrap> ;

});

export default Slider;


