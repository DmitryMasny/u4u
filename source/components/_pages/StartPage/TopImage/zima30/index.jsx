import React from 'react';

import { Btn } from 'components/_forms';

import { Link } from 'react-router-dom';

import LINKS from "config/links";
import s from './index.scss'

const TopImage = props => {
    return (
        <div className={s.topImage}>
            <div className={s.topImageBlock}>
                <div className={s.topImageHeader}>
                    Создай фотокнигу
                </div>
                <span className={s.topImageText1}>
                    Скидка 30%
                </span>
                <span className={s.topImageText2}>
                    Мягкая обложка на пружине 20x20
                </span>
                <span className={s.topImageText3}>
                    Промокод:
                </span>
                <span className={s.topImageText4}>
                    ZIMA30
                </span>
                <Link to={LINKS.GALLERY}>
                    <Btn className={s.topImageBtn}>
                        Посмотреть фотокниги
                    </Btn>
                </Link>
            </div>
        </div>);
};
export default TopImage;