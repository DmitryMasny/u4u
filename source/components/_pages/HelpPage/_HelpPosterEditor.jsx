import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom'

import { NAV } from 'const/help';
import { MY_PRODUCTS_NEW } from 'const/myProducts';
import LINKS_MAIN from 'config/links';
import TEXT from 'texts/main';
import { PageTitle } from 'components/Page';
import s from './HelpPage.scss';
import { IMG_DIR } from 'config/dirs'

const HelpPosterEditor = ({title}) => {
    return (<Fragment>
        <PageTitle>{title}</PageTitle>

        <p>
            После выбора формата, параметров постера и фотографии, открывается онлайн-редактор.
            Теперь видно, как смотрится ваша фотография в выбранном формате.
            При желании, можно изменить позицию фотографии, саму фотографию, либо формат.
        </p>


        <h2>Позиционирование фотографии</h2>

        <div className={s.helpImgBlock}>
            <img src={IMG_DIR+'info/faq-poster-edit.png'}/>
            <span className={s.helpImgBlockText}>Позиционирование фотографии</span>
        </div>
        <p>
            Чтобы изменить размер или координаты фотографии, для начала необходимо выбрать её. Для этого просто нажмите (кликните) на неё,
            после чего у фотографии появится рамка трансформации.
        </p>
        <p>
            При повторном нажатии на фотографию, можно ее спозиционировать на листе. Чтобы изменить размер - потяните за вершины рамки трансформации.
            Чтобы снять выделение с фотографии, нажмите на область за пределами рамки трансформации.
        </p>

        <h2>Предупреждение о плохом качестве</h2>

        <div className={s.helpImgBlock}>
            <img src={IMG_DIR+'info/faq-bad-quality.jpg'}/>
            <span className={s.helpImgBlockText}>Предупреждение о плохом качестве фотографии</span>
        </div>
        <p>
            Если фотография недостаточно высокого разрешения для выбранного формата или слишком увеличена, то всплывает предупреждение
            "Фотография слишком растянута, возможно плохое качество при печати!". В этом случае мы не можем гарантировать качественную печать!
        </p>
        <p>
            Попробуйте выбрать другой формат, или использовать фотографию более высокого разрешения.
        </p>

        <h2>Смена фотографии</h2>

        <p>
            Если вы решили поменять фотографию, нажмите кнопку "Выбрать фотографию" и выберите другую.
        </p>

        <h2>Изменение формата</h2>

        <div className={s.helpImgBlock}>
            <img src={IMG_DIR+'info/faq-poster-config.png'}/>
            <span className={s.helpImgBlockText}>Окно настроек постера</span>
        </div>
        <p>
            Чтобы выбрать другой формат или бумагу, нажмите на "Настройка формата". Чтобы применить новые настройки, нажмите "Сохранить"
        </p>

        <h2>Все изменения сохраняются автоматически</h2>
        <p>
            Вы можете работать над постером с разных устройств, все изменения будут сохраняться в режиме реального
            времени.
        </p>
        <p>
            Чтобы продолжить редактирование начатого продукта, найдите его в разделе&nbsp;
            <NavLink to={LINKS_MAIN.MY_PRODUCTS.replace( /:tab/, MY_PRODUCTS_NEW )}>"{TEXT.MY_PRODUCTS}"</NavLink>.
        </p>
    </Fragment>);
};

export default HelpPosterEditor;