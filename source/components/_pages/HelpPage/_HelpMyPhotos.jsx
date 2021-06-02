import React, { Fragment } from 'react';
import { NavLink } from 'react-router-dom'

import { NAV } from 'const/help';
import LINKS_MAIN from 'config/links';
import { PageTitle } from 'components/Page';
import s from './HelpPage.scss';
import { IMG_DIR } from 'config/dirs'
import { replaceTab } from "libs/helpers";
import { MY_PHOTOS_ALL } from "const/myPhotos";

const HelpEditor = ({title}) => {
    return (<Fragment>
        <PageTitle>{title}</PageTitle>

        <p>
            Все ваши фотографии находятся на странице <NavLink to={replaceTab(LINKS_MAIN.MY_PHOTOS, MY_PHOTOS_ALL)}>"Мои фотографии"</NavLink>.
            Их удобно просматривать, можно поворачивать, удалять, и сортировать по папкам.
            Перейти в "Мои фотографии" можно из главного меню.
        </p>
        <div className={s.helpImgBlock}>
            <img src={IMG_DIR+'info/faq-my-photos.png'} alt=""/>
            <span className={s.helpImgBlockText}>Страница "Мои фотографии"</span>
        </div>

        <h2>Загрузка фотографий</h2>

        <p>
            Чтобы загрузить фотографии в разделе <NavLink to={replaceTab(LINKS_MAIN.MY_PHOTOS, MY_PHOTOS_ALL)}>"Все фотографии" </NavLink>
            нажмите на кнопку "Загрузить фотографии". Откроется окно выбора способа загрузки.
        </p>
        <div className={s.helpImgBlock}>
            <img src={IMG_DIR+'info/faq-add-photos.png'} alt=""/>
            <span className={s.helpImgBlockText}>Выбор способа загрузки фотографий</span>
        </div>
        <p>
            Чтобы загрузить фотографии с устройства, нажмите на кнопку "Загрузить фотографии".
            Загружайте любое количество файлов, удерживая Ctrl.
            Также фотографии можно просто перетащить из папки на компьютере в окно загрузки.
            Размер одной фотографии - не более 50Мб. Доступные форматы - ".JPG", ".JPEG"
        </p>
        <p>
            Вы можете загрузить фотографии из ваших "Google фотографий", для этого выберите кнопку "Google photos".
            После успешной авторизации в сервисе, выберите все необходимые фотографии и нажмите "Загрузить".
        </p>

        <div className={s.helpImgBlock}>
            <img src={IMG_DIR+'info/faq-upload-folder.png'} alt=""/>
            <span className={s.helpImgBlockText}>Выбор файлов в windows</span>
        </div>

        <p className={s.helpAttention}>
            <b>Внимание!</b> Не рекомендуется загружать фотографии по мобильной сети, используйте Wi-fi или
            выделенное соединение.
        </p>


        <h2>Сортировка фотографий по папкам</h2>

        <div className={s.helpImgBlockWrap}>
            <div className={s.helpImgBlock}>
                <img src={IMG_DIR+'info/faq-my-photos-folders.png'} alt=""/>
                <span className={s.helpImgBlockText}>Вкладка "папки" в "Мои фотографии"</span>
            </div>

            <p>
                Если у вас много фотографий для разных альбомов, рекомендуем сортировать их по разным папкам.
                Есть два способа добавить фотографии в папку:
            </p>

            <ol className={s.helpHeaderList}>
                <li><span className={s.helpHeaderListHeader}>Скопировать из вкладки "все фотографии" или из другой папки</span>
                    <p className={s.helpHeaderListDesc}>
                        Для этого выберите нужные фотографии (Кнопка "выбрать" включает режим выделения) и нажмите "Скопировать в папку".
                        Далее выберите существующую папку, или создайте новую. После подтверждения фотографии будут скопированы.
                        Также можно скопировать фотографию в папку во время просмотра.
                    </p>
                </li>
                <li><span className={s.helpHeaderListHeader}>Выбрать нужную папку и нажать кнопку "добавить фотографии"</span>
                    <p className={s.helpHeaderListDesc}>
                        После этого откроется вкладка "Все фотографии", чтобы выбрать фотографии для добавления. Можно перейти в папки
                         и добавить фотографии из другой папки.
                    </p>
                </li>

            </ol>

            <p className={s.helpAttention}>
                После добавления фотографии в папку, она не изчезает со вкладки "все фотографии".
                При удалении фотографии из вкладки "все фотографии", она удалится также из папки.
            </p>

        </div>

        <h2>Добавление фотографий в альбом</h2>

        <div className={s.helpImgBlockWrap}>
            <p>
                Чтобы добавить фотографии в альбом, нужно открыть этот альбом в
                <NavLink to={LINKS_MAIN.HELP.replace( /:tab/, NAV.EDITOR )}> редакторе </NavLink>
                и нажать кнопку "Добавить" в библиотеке фотографий.
            </p>

            <div className={s.helpImgBlock}>
                <img src={IMG_DIR+'info/faq-my-photos-add.png'} alt=""/>
                <span className={s.helpImgBlockText}>Кнопка добавления фотографий<br/> в альбом</span>
            </div>
            <p>
                После нажатия на кнопку "Добавить" откроется окно "Мои фотографии".
                Выберите нужные фотографии и нажмите на кнопку "Добавить в альбом".
            </p>
        </div>

    </Fragment>);
};

export default HelpEditor;