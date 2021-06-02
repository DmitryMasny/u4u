import s from './StartPage.scss';
import React from 'react';
import { Link } from 'react-router-dom';

import { Btn } from 'components/_forms';

import CarouselSlider from "./_CarouselSlider";
import { START_SHOW_MORE } from 'const/metrics'
import sendMetric from 'libs/metrics'

const PhotobookType = ( {images, header, text, link, isRight, startDelay } ) => {
    return (
        <div className={s.photobookType}>
            {!isRight && <CarouselSlider images={images} startDelay={startDelay} />}
            <div className={s.photobookTypeInfo}>
                <h2 className={s.photobookTypeHeader}>{header}</h2>
                <div className={s.photobookTypeText}>{text}</div>
                <Link to={link}>
                    <Btn intent="primary" className={s.photobookTypeBtn} onClick={()=>sendMetric(START_SHOW_MORE)}>Подробнее</Btn>
                </Link>
            </div>
            {isRight && <CarouselSlider images={images} startDelay={startDelay} />}
        </div>);
};

export default PhotobookType;
