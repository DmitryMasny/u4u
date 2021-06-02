import React from 'react';

import { Btn } from 'components/_forms';

import { Link } from 'react-router-dom';

import LINKS from "config/links";
import s from './index.scss'
import { START_CREATE } from 'const/metrics'
import sendMetric from 'libs/metrics'


const TopImage = props => (
        <div className={s.topImage}>
            <div className={s.topImageBlock}>
                <h1 className={s.topImageHeader}>
                    Создай фотокнигу
                </h1>
                <Link to={LINKS.GALLERY} onClick={()=>sendMetric(START_CREATE)}>
                    <Btn className={s.topImageBtn}>
                        Посмотреть фотокниги
                    </Btn>
                </Link>
                <div className={s.topImagePoligraphic}>
                    * Полиграфическая печать
                </div>
            </div>
        </div>
);
export default TopImage;