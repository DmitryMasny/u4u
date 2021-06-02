import React from 'react';

import s from './GalleryPage.scss';
import Carousel, { cardDefault } from 'components/Carousel';

const data = [
    {
        src: 'http://www.iphones.ru/wp-content/uploads/2011/03/Penguins-e1301515537615.jpg',
    },
    {
        src: 'https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_960,f_auto/DCTM_Penguin_UK_DK_AL526630_wkmzns.jpg',

    },
    {
        src: 'http://www.iphones.ru/wp-content/uploads/2011/03/Penguins-e1301515537615.jpg',

    },
    {
        src: 'http://www.iphones.ru/wp-content/uploads/2011/03/Penguins-e1301515537615.jpg',

    },
    {
        src: 'http://www.iphones.ru/wp-content/uploads/2011/03/Penguins-e1301515537615.jpg',
    }
];

const ThemeSlider = ({pages}) => {

    return (
        <div className={s.themeInfoSlider}>
            <Carousel autoplay={4000} data={pages} type="pages" dots arrows>
            </Carousel>
        </div>);
};

export default ThemeSlider;
