import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom'

import { NAV } from 'const/help';
import LINKS_MAIN from 'config/links';
import { PageTitle } from 'components/Page';
import { IconBlur, IconRotateR, IconClose, IconDelete, IconDouble,IconPlusRound, IconTurnBack,IconHand  } from 'components/Icons';
import s from './HelpPage.scss';
import { IMG_DIR } from 'config/dirs'

const HelpEditor = ( { title } ) => {
    return (<Fragment>
        <PageTitle>{title}</PageTitle>

        <h2>Библиотека фотографий</h2>

        Это блок где расположены сами фотографии, а также:

        <ul>
            <li><b>Фильтры фотографий</b> - позволяют скрывать из библиотеки уже размещенные в фотокнигу фотографии,
                и размытые фотографии (см. "Метки фотографии")
            </li>
            <li><b>Кнопка "Свернуть/ Развернуть"</b> - переключение между компактной и расширенной библиотекой.
                В расширенной библиотеке можно редактировать фотографии (см. "Поворот и удаление фотографии")
            </li>
            <li><b>Кнопка "Доразместить автоматически"</b> - автоматически размещает фотографии в фотокниге.
                Пустые страницы, при этом, удаляются
            </li>
        </ul>
        <div className={s.helpImgBlockWrap}>
            <div className={s.helpImgBlock}>
                <img src={IMG_DIR+'info/faq-enlarge.png'}/>
                <span className={s.helpImgBlockText}>Кнопка "Свернуть/ Развернуть"</span>
            </div>
            <div className={s.helpImgBlock}>
                <img src={IMG_DIR+'info/faq-autoplace.png'}/>
                <span className={s.helpImgBlockText}>Кнопка "Доразместить автоматически"</span>
            </div>
        </div>

        <h2>Метки фотографии</h2>
        <div className={s.helpImgBlockWrap}>
            <div className={s.helpImgBlock}>
                <img src={IMG_DIR+'info/faq-photo-analize.png'}/>
                <span className={s.helpImgBlockText}>Метки фотографии</span>
            </div>
            <p>
                После загрузки фотографий происходит их анализ. Некачественные (размытые)
                фотографии помечаются специальными метками и не будут использоваться при автоматическом заполнении фотокниги.
            </p>
        </div>

        <p>
            <span className={`${s.helpMetka} ${s.helpMetkaRed}`}><IconBlur/></span> - фотографии плохого качества
            (размытые)
        </p>
       {/* <p>
            <span className={`${s.helpMetka} ${s.helpMetkaOrange}`}><IconDouble/></span> - фотографии у которых есть копия
            лучшего качества
        </p>*/}
        <p>
            <span className={`${s.helpMetka} ${s.helpMetkaBlue}`}>5</span> - метка с номером страницы, где размещена
            данная фотография. Если кликнуть по ней, вы перейдете на эту страницу фотокниги.
            Одна фотография может использоваться многократно на одной или нескольких страницах.
        </p>


        <h2>Размещение фотографии в блок фотокниги</h2>
        <div className={s.helpImgBlockWrap}>
            <div className={s.helpImgBlock}>
                <img src={IMG_DIR+'info/faq-photoblock.png'}/>
                <span className={s.helpImgBlockText}>Свободный блок фотографии</span>
            </div>
            <p>
                Чтобы разместить фотографию на странице фотокниги, просто перетащите ее из библиотеки в свободный блок для
                фотографии или на уже размещенную в блоке фотографию.
            </p>
        </div>

        <h2>Поворот и удаление фотографий в фотокниге</h2>
        <div className={s.helpImgBlockWrap}>
            <div className={s.helpImgBlock}>
                <img src={IMG_DIR+'info/faq-photo-edit.png'}/>
                <span className={s.helpImgBlockText}>Метки фотографии</span>
            </div>
            <div>
                <p>
                    В <b>расширенной</b> библиотеке, при наведении на фотографию, появляются кнопки:
                </p>
                <p>
                    <span className={`${s.helpMetka} ${s.helpMetkaRed}`}><IconDelete/></span>
                    - Удалить фотографию. Фотография полностью удалится из библиотеки редактора.
                </p>
                <p>
                    <span className={`${s.helpMetka} ${s.helpMetkaDark}`}><IconRotateR/></span>
                    - Редактировать (повернуть) фотографию. Откроется окно редактирования фотографии.
                </p>
            </div>
        </div>
        <p className={s.helpAttention}>
            Если фотография уже размещена в фотокниге, она будет повернута на всех страницах. Фотография может не разместиться
            после поворота в блоке фотоальбома, если не подойдет по размерам. В этом случае она удалится из блока,
            но останется в библиотеке фотографий.
        </p>


        <h2>Редактирование фотографии в блоке фотокниги</h2>
        <div className={s.helpImgBlockWrap}>
            <div className={s.helpImgBlock}>
                <img src={IMG_DIR+'info/faq-photoblock-full.png'}/>
                <span className={s.helpImgBlockText}>Блок с фотографией</span>
            </div>
            <div>
                <p>
                    При наведении на блок фотографии появляются следующие кнопки управления:
                </p>
                <p>
                    <span className={`${s.helpMetka} ${s.helpMetkaInfo}`}><IconHand/></span>
                    - Переместить фотографию в пределах разворота. Зажмите эту кнопку и просто перетяните фотографию
                    в другой блок. Если там есть фотография, они поменяются местами.
                </p>
                <p>
                    <span className={`${s.helpMetka} ${s.helpMetkaDark}`}><IconRotateR/></span>
                    - Редактировать (повернуть) фотографию. Откроется окно редактирования фотографии.
                </p>
                <p>
                    <span className={`${s.helpMetka} ${s.helpMetkaRed}`}><IconClose/></span>
                    - Очистить. Фотография удаляется из блока, но остается в библиотеке.
                </p>
                <p>
                    <span className={`${s.helpMetka} ${s.helpMetkaOrange}`}><IconTurnBack/></span>
                    - Вернуть по-умолчанию. Фотография заново разместится в блок сбросив данные о перемещении и масштабе.
                </p>
                <p>
                    <span className={`${s.helpMetka} ${s.helpMetkaGrey}`}><IconPlusRound/></span>
                    - Масштаб (Увеличить/Уменьшить).
                </p>
            </div>
        </div>
    </Fragment>);
};

export default HelpEditor;