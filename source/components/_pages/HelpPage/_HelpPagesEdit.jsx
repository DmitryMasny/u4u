import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom'

import { NAV } from 'const/help';
import LINKS_MAIN from 'config/links';
import { PageTitle } from 'components/Page';
import s from './HelpPage.scss';
import { IMG_DIR } from 'config/dirs'

const HelpEditor = ( { title } ) => {
    return (<Fragment>
        <PageTitle>{title}</PageTitle>

        <h2>Фоны и шаблоны страниц фотокниги</h2>

        <p>Вы можете переключаться между библиотеками фотографий фонов и шаблонов, выбрав соответствующую вкладку.
            Чтобы поменять фон или шаблон в фотокниге, просто перетащите его на нужную страницу.</p>
        <div className={s.helpImgBlock}>
            <img src={IMG_DIR+'info/faq-tabs.png'}/>
            <span className={s.helpImgBlockText}>Вкладки библиотек фотографий, фонов и шаблонов</span>
        </div>

        <h2>Навигация по страницам</h2>

        <div className={s.helpImgBlock}>
            <img src={IMG_DIR+'info/faq-pages.png'}/>
            <span className={s.helpImgBlockText}>Блок страниц</span>
        </div>
        <p>
            Для перехода между разворотами (разворот - это две соседние страницы) можно использовать кнопки по краям от
            фотокниги, стрелки клавиатуры, клик на миниатюры разворотов в блоке страниц или двойным кликом по кнопке
            в навигации по страницам.
        </p>
        <div className={s.helpImgBlock}>
            <img src={IMG_DIR+'info/faq-pages-nav.png'}/>
            <span className={s.helpImgBlockText}>Навигация по страницам</span>
        </div>
        <p>
            Навигация по страницам позволяет быстро найти и открыть нужный разворот - просто кликните на него.
        </p>
        <h2>Добавление страниц</h2>
        <div className={s.helpImgWrap}>
            <div className={s.helpImgBlock}>
                <img src={IMG_DIR+'info/faq-add-pages.png'}/>
                <span className={s.helpImgBlockText}>Выпадающее меню добавления страниц</span>
            </div>
            <p>
                Чтобы добавить новые пустые страницы в фотокнигу, кликните на кнопку «Добавить страницы».
                Если вам надо сразу добавить много страниц или добавить их в определенное место, нажмите на правую часть
                кнопки, и выберите в выпадающем списке количество страниц и место вставки.
            </p>
        </div>

        <h2>Удаление страниц</h2>
        <p>
            Для удаления разворота наведите курсор на нужный разворот в блоке страниц, после чего на нём появится кнопка
            «Х» - удаление разворота.
        </p>

        <h2>Смена порядка страниц</h2>
        <p>
            К сожалению, пока нельзя поменять нужные страницы местами. Этот функционал будет реализован позже.
        </p>
    </Fragment>);
};

export default HelpEditor;