import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom'

import { NAV } from 'const/help';
import LINKS_MAIN from 'config/links';
import { IMG_DIR } from 'config/dirs'
import { PageTitle } from 'components/Page';
import s from './HelpPage.scss';


const HelpEditor = ( { title } ) => {
    return (<Fragment>
        <PageTitle>{title}</PageTitle>

        <h2>Предпросмотр</h2>
        <div className={s.helpImgBlock}>
            <img src={IMG_DIR+'info/faq-layout-info.png'}/>
            <span className={s.helpImgBlockText}>Кнопка предпросмотра</span>
        </div>
        <p>
            Кнопка заказа доступна только из режима предпросмотра онлайн-редактора. Это сделано,
            чтобы перед заказом вы посмотрели на вашу будущую фотокнигу.
        </p>
        <p className={s.helpAttention}>
            Перед заказом просмотрите все страницы, обращая внимание на то как встали фотографии
            в блок, ничего ли не обрезалось, и на возможные ошибки в тексте. После оплаты происходит автоматическая отправка
            фотокниги на печать , в том виде, как он отображается в предпросмотре, и внести изменения уже будет нельзя.
        </p>
        <p>
            Если нельзя перейти к заказу из-за недостаточного количества страниц, можно ничего не меняя в фотокниге, выбрать другой переплёт,
            с другим возможным количеством страниц.
        </p>

        <h2>Выбор другого переплета</h2>
        <div className={s.helpImgBlock}>
            <img src={IMG_DIR+'info/faq-layout-info.png'}/>
            <span className={s.helpImgBlockText}>Блок информации о продукте</span>
        </div>
        <p>
            Чтобы выбрать тип переплёта фотокниги (на скрепке, книжный переплет, на пружине...), нажмите "Настроить" в блоке
            информации о продукте.
            В появившемся окне можно выбрать другой тип переплёта, а также узнать из чего формируется цена фотокниги.
        </p>
        <div className={`${s.helpImgBlock} ${s.small}`}>
            <img src={IMG_DIR+'info/faq-album-config.png'}/>
            <span className={s.helpImgBlockText}>Окно настроек продукта</span>
        </div>

    </Fragment>);
};

export default HelpEditor;