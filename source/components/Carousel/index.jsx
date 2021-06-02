import React, { Component } from 'react';
import TouchCarousel from 'react-touch-carousel'
// import data from '../data'
import touchWithMouseHOC from 'react-touch-carousel/lib/touchWithMouseHOC'
import s from './Carousel.scss'
import { IconChevronRight, IconChevronLeft } from 'components/Icons'

// Контейнер слайдера
const CarouselContainer = ( { cursor, data, dots, arrows, width, cardsCount, carouselPrev, carouselNext, carouselGoTo, carouselState, startDelay, ...rest } ) => {
    const carouselWidth = width;
    const cardSize = carouselWidth;
    const pages = data.length;

    let current = -Math.round( cursor ) % pages;

    //while ( current < 0 ) {
    //    current += pages
    //}

    // Текущий слайд в центр
    const translateX = (cursor - cardsCount) * cardSize + (carouselWidth - cardSize) / 2;

    return (
        <div className={s.carouselContainer}>

            {/*Лента слайдов*/}
            <div className={s.carouselTrack}
                 style={{ transform: `translate3d(${translateX}px, 0, 0)` }}
                 {...rest}
            />

            {/*Пагинация*/}
            {dots &&
            <div className={s.carouselPagination}>
                {data.map( ( _, index ) => (
                    <div key={index}
                         className={s.carouselPaginationItem + (current === index ? ` ${s.current}` : '')}
                         onClick={() => carouselGoTo( -1 * index )}
                    />
                ))}
            </div>}

            {/*Кнопки*/}
            {arrows &&
            <div className={s.carouselControl}>
                <div className={s.carouselControlBtn} onClick={carouselPrev}>
                    <IconChevronLeft  size={36} />
                </div>
                <div className={s.carouselControlBtn} onClick={carouselNext}>
                    <IconChevronRight size={36} />
                </div>
            </div>}

        </div>
    )
};

export default class Carousel extends Component {
    constructor ( props ) {
        super( props );
        this.autoPlay = this.props.autoPlay || 3000;
        this.state = {
            width: null,
            cardsCount: 3,
            autoPlay: this.props.startDelay ? 0 : (this.props.autoPlay || 0),
            type: this.props.type ,
            dots: this.props.dots || false,
            arrows: this.props.arrows || false,
        };
    }

    componentDidMount () {
        if (this.props.startDelay) {
            setTimeout(()=>{
                this.setState({autoPlay: this.autoPlay});
            }, this.props.startDelay);
        }

        // Определение ширины слайдера при инициализации и изменении размера окна
        this.updateWidth();
        window.addEventListener( "resize", this.updateWidth, true );
    }
    componentWillUnmount() {
        window.removeEventListener( "resize", this.updateWidth, true );
    }
    // Компонент слайда
    renderCard = ( index, modIndex ) => {
        if ( !this.props.data ) return null;
        const item = this.props.data[modIndex];
        const cardStyle = { width: this.state.width };

        switch (this.state.type){
            case 'pages':
                return (
                    <div className={s.carouselCard} key={index} style={cardStyle}>
                        <img className={s.carouselCardPage} src={item.left}/>
                        <img className={s.carouselCardPage} src={item.right}/>
                    </div>
                );
            default:
                return (
                    <div className={s.carouselCard} key={index} style={cardStyle}>
                        <img className={s.carouselCardImg} src={item.src}/>
                    </div>
                )
        }
    };
    updateWidth  = () => this.setState( { width: this.fw.offsetWidth } );
    carouselPrev = () => this.touchCarousel.prev();
    carouselNext = () => this.touchCarousel.next();
    carouselGoTo = (index) => this.touchCarousel.go(index);

    render () {
        return <div ref={r => (this.fw = r)} >
                    <TouchCarousel
                        ref={r => (this.touchCarousel = r)}
                        component={touchWithMouseHOC( CarouselContainer )} // Обертка для управления мышью
                        {...this.props}
                        {...this.state}
                        width={this.state.width}
                        cardSize={this.state.width}
                        cardCount={this.props.data.length}
                        cardPadCount={this.state.cardsCount}
                        loop={true}
                        arrows={true}
                        autoplay={this.state.autoPlay}
                        renderCard={this.renderCard}
                        onRest={index => console.log( `rest at index ${index}` )}
                        onDragStart={() => console.log( 'dragStart' )}
                        onDragEnd={() => console.log( 'dragEnd' )}
                        onDragCancel={() => console.log( 'dragCancel' )}
                        carouselPrev={this.carouselPrev}
                        carouselNext={this.carouselNext}
                        carouselGoTo={this.carouselGoTo}
                    />
                </div>
    }
}

