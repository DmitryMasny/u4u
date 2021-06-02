import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom'

import { NAV } from 'const/help';
import { MY_PRODUCTS_NEW } from 'const/myProducts';
import LINKS_MAIN from 'config/links';
import TEXT from 'texts/main';
import { PageTitle } from 'components/Page';
import s from './HelpPage.scss';
import { IMG_DIR } from 'config/dirs'

const HelpEditor = ({title}) => {
    return (<Fragment>
        <PageTitle>{title}</PageTitle>

        <h2>Начало работы в редакторе</h2>
        <p>
            После выбора темы фотокниги, вы попадаете в Редактор. Он состоит из областей:
        </p>
        <ul>
            <li>Главное меню - здесь есть "Блок информации о продукте", кнопка режима предпросмотра, кнопка для заказа фотокниги</li>
            <li>Область работы со страницами</li>
            <li>Облать просмотра</li>
            <li>Библиотека фотографий, фонов и шаблонов</li>
        </ul>

        <p>
            При создании нового проекта, библиотека фотографий показана в раскрытом виде.
            Нажмите кнопку "Добавить", чтобы добавить фотографии из раздела&nbsp;
            <NavLink to={LINKS_MAIN.HELP.replace( /:tab/, NAV.MY_PHOTOS )}>"Мои фотографии"</NavLink>.
        </p>

        <h2>Все изменения сохраняются автоматически</h2>
        <p>
            Вы можете работать над одной фотокнигой с разных устройств, все изменения будут сохраняться в режиме реального
            времени.
        </p>
        <p>
            Чтобы продолжить редактирование начатой фотокниги, найдите его в разделе&nbsp;
            <NavLink to={LINKS_MAIN.MY_PRODUCTS.replace( /:tab/, MY_PRODUCTS_NEW )}>"{TEXT.MY_PRODUCTS}"</NavLink>.
        </p>

        <h2>Смена типа переплёта</h2>

        <div className={s.helpImgBlock}>
            <img src={IMG_DIR+'info/faq-layout-info.png'}/>
            <span className={s.helpImgBlockText}>Блок информации о продукте</span>
        </div>
        <p>
            Чтобы выбрать другой тип переплёта, нажмите на "Блок информации о продукте". Откроется окно настроек продукта.
        </p>
        <div className={`${s.helpImgBlock} ${s.small}`}>
            <img src={IMG_DIR+'info/faq-album-config.png'}/>
            <span className={s.helpImgBlockText}>Окно настроек продукта</span>
        </div>
    </Fragment>);
};

export default HelpEditor;