import React from 'react';
import { Button } from 'bp';
import { Link } from 'react-router-dom';

import { Wrapper } from 'components/Page';

import LINKS from "config/links";
import s from './index.scss'
import { START_CREATE } from 'const/metrics'
import sendMetric from 'libs/metrics'


const TopImage = props => {
    return (
        <Wrapper className={s.topImage}>
            <div className={s.topImageImg}/>
            <div className={s.topImageBlock}>
                <h1 className={s.topImageHeader}>
                    Создай фотокнигу
                </h1>
                <div className={s.topImageText}>
                    Быстро и просто
                </div>
                <Link to={LINKS.GALLERY} onClick={()=>sendMetric(START_CREATE)}>
                    <Button className={s.topImageBtn}>
                        Посмотреть темы
                    </Button>
                </Link>
            </div>
        </Wrapper>);
};
export default TopImage;