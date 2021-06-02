import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom'

import { NAV } from 'const/help';
import { PageTitle } from 'components/Page';
import s from './HelpPage.scss';
import {IMG_DIR} from 'config/dirs'


const HelpEditor = ( { title } ) => {
    return (<Fragment>
        <PageTitle>{title}</PageTitle>

        <p>
            Если у вас есть промокод, его можно активировать в корзине на странице "Мои заказы".
        </p>

        <p>
            Для этого введите его в поле "Промокод" и нажмите на кнопку рядом <br/>
        </p>

        <div className={`${s.helpImgBlock} ${s.small}`}>
            <img src={`${IMG_DIR}common/promo-info.png`}/>
            <span className={s.helpImgBlockText}>Поле ввода промокода</span>
        </div>

        <p>
            Сервис проинформирует вас, если промокод верный и покажет скидку.
        </p>

        <p className={s.helpAttention}>
            <b>Внимание!</b> Некоторые промокоды одноразовые и сгорают при использовании после оплаты заказа. Также многие
            промокоды ограничены сроком действия.
        </p>

    </Fragment>);
};

export default HelpEditor;