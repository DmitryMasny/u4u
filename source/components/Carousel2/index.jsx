import React, {useState, useRef, useEffect, memo} from 'react';
import Gesture from 'rc-gesture';


import { CarouselStyled, ArrowBtnStyled, PaginationStyled, SlideWrapStyled, GestureMoveStyled } from './_styles';
import { IconChevronRight, IconChevronLeft } from 'components/Icons';



//
// this.autoPlay = this.props.autoPlay || 3000;
// this.state = {
//     width: null,
//     cardsCount: 3,
//     autoPlay: this.props.startDelay ? 0 : (this.props.autoPlay || 0),
//     type: this.props.type ,
//     dots: this.props.dots || false,
//     arrows: this.props.arrows || false,
// };


const SlideWrap = memo(({viewComponent, slideIndex, data, move}) => {
    if (data.length < 1) return viewComponent(0);

    return <SlideWrapStyled slideIndex={slideIndex || 0} move={move || 0}>
            {data.length && data.map((slide, i)=>viewComponent(slide, slideIndex === i, i))}
    </SlideWrapStyled>
});

const Carousel = memo(({
                      dots = true,
                      arrows = true,
                      loop = true,
                      data = [],
                      viewComponent = () => <div>Не передан viewComponent</div>,
                      height, proportion, autoplay, delay, animation
}) => {
    const autoPlay = autoplay === true ? 3000 : autoplay;

    const [slideIndex, setSlideIndex] = useState(0);    // номер текущего слайда
    const [holdSlide, setHoldSlide] = useState(false);  // не листать автоматом при наведении
    const [moveGesture, setMoveGesture] = useState(0);  // тач сдвиг

    const autoPlayTimeout = useRef(false);

    useEffect(() => {
        const delayTimeout = setTimeout( () => {
            autoPlayTimeout.current = autoPlay && setTimeout( ()=>goTo(1), autoPlay )
        }, delay || 0 );


        return ()=>{
            if (delayTimeout) clearTimeout( delayTimeout );
            if (autoPlayTimeout && autoPlayTimeout.current) clearTimeout( autoPlayTimeout.current );
        }
    },[]);

    useEffect(()=> {
        if (holdSlide) {
            if (autoPlayTimeout && autoPlayTimeout.current) clearTimeout( autoPlayTimeout.current );
        } else {
            autoPlayTimeout.current = autoPlay && setTimeout( ()=>goTo(slideIndex + 1), autoPlay )
        }
    }, [slideIndex, holdSlide]);

    // const ActiveSlide = () => viewComponent(data[slideIndex], slideIndex);

    const goTo = (index) => {
        if (slideIndex === index) return null;
        if (index < 0) index = loop ? data.length - 1 : 0;
        if (index > (data.length - 1)) index = loop ? 0 : data.length - 1;

        setSlideIndex( index );
    };

    const gestureControll = ( status, type ) => {
        console.log('gestureControll status',status);
        switch ( type ) {
            case 'swipe':
                switch ( status ) {
                    case 4:
                        goTo(slideIndex - 1);
                        break;
                    case 2:
                        goTo(slideIndex + 1);
                        break;
                }
                break;

            case 'pan':
                setMoveGesture(status.x);
                break;

            case 'panEnd':
                setMoveGesture(0);
                break;
        }
    };

    if (!height && !proportion) {
        console.log('В Carousel отсутствуют height и proportion',{height:height, proportion: proportion});
        return null;
    }

    return <Gesture onSwipe={( status ) => gestureControll(status.direction, 'swipe')}
                    onPan={ (status) => { gestureControll(status.moveStatus, 'pan') } }
                    onPanEnd={ (status) => { gestureControll(status, 'panEnd') } }
                    direction="horizontal" >
        <CarouselStyled height={height} proportion={proportion} onMouseEnter={()=>autoPlay && setHoldSlide(true)} onMouseLeave={()=>autoPlay && setHoldSlide(false)}>

        {/*Полоса слайдов*/}
        <SlideWrap viewComponent={viewComponent} slideIndex={slideIndex} move={moveGesture} data={data}/>


        {/*Пагинация*/}
        {dots && data.length > 1 && <Pagination data={data} activeSlide={slideIndex} onSelect={goTo}/>}

        {/*Кнопки*/}
        {arrows && data.length > 1 &&
        <>
                <ArrowBtn goTo={()=>goTo(slideIndex - 1)} slideIndex={slideIndex} disabled={!loop && slideIndex === 0}/>
                <ArrowBtn goTo={()=>goTo(slideIndex + 1)} slideIndex={slideIndex} disabled={!loop && slideIndex === data.length - 1} isRight/>
            </>
        }

        </CarouselStyled>
    </Gesture>
});

const ArrowBtn = ({goTo, isRight, disabled}) => <ArrowBtnStyled
    onClick={goTo}
    isRight={isRight}
    disabled={disabled}
>
    {isRight ? <IconChevronRight size={36} /> : <IconChevronLeft  size={36} />}
</ArrowBtnStyled>;

const Pagination = ({data, onSelect, activeSlide}) => <PaginationStyled>
    {data.length && data.map( ( _, index ) => (
        <div key={index}
             className={`item ${activeSlide === index ? 'active' : ''}`}
             onClick={()=>onSelect(index)}
        />
    ))}
</PaginationStyled>;

export default Carousel;