import s from './StartPage.scss';
import React from 'react';

import Carousel from 'components/Carousel';

const CarouselSlider = ( {images, startDelay} ) => (
    <div className={s.photobookTypeImageBlock}>
        <Carousel data={images} dots startDelay={startDelay} />
    </div>
);

export default CarouselSlider;
