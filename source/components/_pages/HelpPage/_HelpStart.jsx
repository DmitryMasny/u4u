import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom'

import { NAV } from 'const/help';
import { MY_PRODUCTS_NEW } from 'const/myProducts';
import LINKS_MAIN from 'config/links';
import TEXT from 'texts/main';
import TEXT_HELP from 'texts/help';
import { PageTitle } from 'components/Page';
import s from './HelpPage.scss';


const HelpStart = ({title}) => {

    return (<Fragment>
        <PageTitle>{title}</PageTitle>

        <p>
            U4U (Ю ФО Ю) - это автоматический веб-сервис для создания фотопродукции. Вы можете заказать у нас фотокниги и постеры с вашими фотографиями.
        </p>
        <h3>Как заказать фотокнигу</h3>
        <ol className={s.helpHeaderList}>
            <li><span className={s.helpHeaderListHeader}>Выбрать тип переплета и формат фотокниги</span>
                <p className={s.helpHeaderListDesc}>
                    Перейдите на страницу
                    <NavLink to={LINKS_MAIN.PHOTOBOOKS.replace(':coverType-:bindingType', 'hard-glue')}> "{TEXT.PHOTOBOOKS}"</NavLink>.
                    Выберите "тип переплета", который вам больше подходит. Обратите внимание на стоимость и особенности выбранного типа переплета.
                    После выбора нажмите кнопку "Продолжить".
                </p>
            </li>

            <li>
                <span className={s.helpHeaderListHeader}>Выбрать тему фотокниги</span>
                <p className={s.helpHeaderListDesc}>
                    На странице <NavLink to={LINKS_MAIN.GALLERY}> "{TEXT.GALLERY}"</NavLink> выберите тему с понравившимся дизайном.
                </p>
                <p className={s.helpHeaderListDesc}>
                    Вы можете задать фильтр по категориям, поменять формат отображаемых тем, или посмотреть подробнее, как выглядит
                    тема фотокниги, нажав на нее. Можно сначала выбрать тему фотокниги, а затем формат, тип переплёта и качество обложки фотокниги.
                </p>
                <p className={s.helpHeaderListDesc}>
                    После выбора темы и формата, вы попадаете в
                    <NavLink to={LINKS_MAIN.HELP.replace( /:tab/, NAV.EDITOR )}> "Онлайн редактор"</NavLink>.
                </p>
            </li>

            <li>
                <span className={s.helpHeaderListHeader}>Загрузить и разместить фотографии</span>
                <p className={s.helpHeaderListDesc}>
                    Подробнее о загрузке фотографий можно ознакомиться в разделе
                    <NavLink to={LINKS_MAIN.HELP.replace( /:tab/, NAV.MY_PHOTOS )}> "{TEXT_HELP.MY_PHOTOS}"</NavLink>.
                </p>
                <p className={s.helpHeaderListDesc}>
                    Также вы можете внести изменения в дизайн фотокниги, поменяв
                    <NavLink to={LINKS_MAIN.HELP.replace( /:tab/, NAV.PAGES_EDIT )}> фоны и шаблоны страниц</NavLink>,
                     или добавить <NavLink to={LINKS_MAIN.HELP.replace( /:tab/, NAV.TEXT_EDIT )}>текст</NavLink>.
                </p>
            </li>

            <li>
                <span className={s.helpHeaderListHeader}>Заказать фотокнигу</span>
                <p className={s.helpHeaderListDesc}>
                    Для заказа необходимо заполнить все страницы фотокниги, чтобы в ней было достаточно страниц и не осталось пустых
                    блоков для фотографий. Если вы не хотите размещать фотографию на странице, выберите шаблон страницы с текстом.
                    Текстовое поле при этом заполнять не обязательно.
                </p>
                <p className={s.helpHeaderListDesc}>
                    Далее вы попадаете в "Корзину", подробнее можно ознакомиться в разделе
                    <NavLink to={LINKS_MAIN.HELP.replace( /:tab/, NAV.ORDER )}> "{TEXT_HELP.ORDER}"</NavLink>.
                </p>
            </li>

        </ol>

        <h3>Как заказать постер</h3>
        <ol className={s.helpHeaderList}>
            <li><span className={s.helpHeaderListHeader}>Выбрать формат постера</span>
                <p className={s.helpHeaderListDesc}>
                    Перейдите на страницу
                    <NavLink to={LINKS_MAIN.POSTERS}> "{TEXT.POSTERS}"</NavLink>.
                    Выберите подходящий формат постера. Также вы можете выбрать дополнительные опции (ламинация, закругление углов) и бумагу.
                    Эти настройки можно будет поменять позже, при редактировании постера.
                </p>
            </li>
            <li>
                <span className={s.helpHeaderListHeader}>Выбрать фотографию</span>
                <p className={s.helpHeaderListDesc}>
                    Нажмите кнопку "Выбрать фотографию" и выберите одну фотографии в открывшемся окне. После выбора вы попадете в
                    <NavLink to={LINKS_MAIN.HELP.replace( /:tab/, NAV.POSTER_EDITOR )}> "Редактор постера"</NavLink>.
                    А на странице <NavLink to={LINKS_MAIN.MY_PRODUCTS.replace( /:tab/, MY_PRODUCTS_NEW )}>"{TEXT.MY_PRODUCTS}"</NavLink>
                    появится новый постер.
                </p>
            </li>

            <li>
                <span className={s.helpHeaderListHeader}>Настроить постер</span>
                <p className={s.helpHeaderListDesc}>
                    Возможно, что выбранная для постера фотография обрежется, или окажется недостаточного качества.
                    Вы можете поменять фотографию, изменить ее размер и позицию, или выбрать другой формат.
                </p>
                <p className={s.helpHeaderListDesc}>
                    Подробнее о редактировании постера можно ознакомиться в разделе
                    <NavLink to={LINKS_MAIN.HELP.replace( /:tab/, NAV.POSTER_EDITOR )}> "{TEXT_HELP.POSTER_EDITOR}"</NavLink>.
                </p>
            </li>

            <li>
                <span className={s.helpHeaderListHeader}>Заказать постер</span>
                <p className={s.helpHeaderListDesc}>
                    Если вы закончили редактирование постера, нажмите на кнопку "Заказать".
                </p>
                <p className={s.helpHeaderListDesc}>
                    Далее вы попадаете в "Корзину", подробнее можно ознакомиться в разделе
                    <NavLink to={LINKS_MAIN.HELP.replace( /:tab/, NAV.ORDER )}> "{TEXT_HELP.ORDER}"</NavLink>.
                </p>
            </li>

        </ol>

    </Fragment>);
};

export default HelpStart;