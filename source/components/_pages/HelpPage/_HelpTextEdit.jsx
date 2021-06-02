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
        <h2>Добавление надписей</h2>

        <div className={s.helpImgBlock}>
            <img src={IMG_DIR+'info/faq-empty-text.png'}/>
            <span className={s.helpImgBlockText}>Пустое текстовое поле</span>
        </div>
        <p>Текст можно добавлять только в специальные поля. При нажании на текстовое поле откроется редактор
            текста. Если такое поле отсутствует, выберите другой&nbsp;
            <NavLink to={LINKS_MAIN.HELP.replace( /:tab/, NAV.PAGES_EDIT )}>шаблон</NavLink>
            , где есть текстовое поле (оно выделено зеленым на превью шаблонов)</p>

        <h2>Редактор текста</h2>

        <div className={s.helpImgWrap}>
            <div className={s.helpImgBlock}>
                <img src={IMG_DIR+'info/faq-text-editor.png'}/>
                <span className={s.helpImgBlockText}>Редактор текста</span>
            </div>
            <p>
                В поле <b>"Текст"</b> можно писать текст для выбранной области. Он будет отображаться в фотокниге,
                согласно выбранному шрифту.
            </p>
            <p>
                Для шрифта можно настраивать начертание (жирный, курсив), цвет, размер,
                и положение надписи в текстовом блоке.
            </p>
            <p>
                В конце редактирования каждой надписи, нажимайте "Сохранить", чтобы применить изменения.
            </p>
        </div>

        <h2>Скрытие пустых текстовых полей</h2>
        <div className={s.helpImgBlock}>
            <img src={IMG_DIR+'info/faq-text-editor.png'}/>
            <span className={s.helpImgBlockText}>Редактор текста</span>
        </div>

        <p>Чтобы текстовые поля не мешали работать с фотокнигой, их можно скрыть кнопкой в правом верхнем углу окна с
            фотокнигой</p><img src={IMG_DIR+'info/faq-hide-text.png'}/>

    </Fragment>);
};

export default HelpEditor;