/** Libs */
// @ts-ignore
import React, {useEffect, memo, useState, useCallback} from 'react';
// @ts-ignore
import {useSelector} from "react-redux";
// @ts-ignore
import { useHistory, useLocation } from "react-router-dom";
// @ts-ignore
import { generatePath } from 'react-router';
// @ts-ignore
import styled from 'styled-components';

// @ts-ignore
import {COLORS} from 'const/styles';
// @ts-ignore
import LINKS from "config/links";
// @ts-ignore
import {IconClose} from 'components/Icons';
// @ts-ignore
import { Btn, Input, Select } from 'components/_forms';
// @ts-ignore
import Spinner from '__TS/components/_misc/Spinner';

// @ts-ignore
import { toast } from '__TS/libs/tools';

// @ts-ignore
import {useKeyPress} from "libs/hooks";

// @ts-ignore
import {urlParamsToString} from "__TS/libs/tools";

// @ts-ignore
import {userIdSelector} from 'selectors/user';
// @ts-ignore
import { generateAllProductPreview } from "components/LayoutConstructor/preview.js";

import ThemeFormats from './_AdminThemeFormats';

/** Selectors */
import { modalAdminThemePreviewSelector } from // @ts-ignore
    '__TS/selectors/modals';

import {themesAdminCategoriesSelector, themesAdminDataSelector} from  // @ts-ignore
    '__TS/components/Themes/_selectors';

/** Actions */
import {
    modalAdminThemePreviewAction,
    modalAdminThemeCopyAction
    // @ts-ignore
} from '__TS/actions/modals';

import {
    getThemeDataAction,
    getThemeFormatsAction,
    updateThemeAction,
    changeThemeStatusAction,
    deleteThemeAction,
    clearThemeDataAction,
    createThemeLayoutAction,
    // @ts-ignore
} from './_actions';
import {createLayoutTS} from "../../../libs/layout";
// @ts-ignore
import { modalSimplePreviewAction } from '__TS/actions/modals';
import { THEME_SLUG_TO_PRODUCT_SLUG_MAP } from "../../Themes/_config";
import { getThemeFormatPreviewAction } from "../../Themes/_actions";


/** Interfaces */
interface IModalAdminThemePreview {

}
interface ImodalData {
    id: string;
}
interface IthemeData {
    productGroup: number;
    themeId: string;
    themeCategory: string;
    themeFormats: any;
    themeIsPublished: boolean;
    themeName:  string;
    onClose?: any;
}
interface ImodalBtn {
    action: any;
    title?: string;
    closeModal?: boolean;
}

interface IthemeFormatsItem {
    data?: any;
}
interface Iinformation {
    total: number;
    completed: number;
    isFull: boolean;
}
interface IThemeModalWrap {
    isPublished?: boolean;
    isFull?: boolean;
}

/** Styles */
const ThemeModalWrap = styled('div')`
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: ${({isPublished, isFull}: IThemeModalWrap) => isPublished ? '#c4deea' : isFull ? '#e5ead7' : COLORS.LAVENDERMIST };
    z-index: 1;
    .themeHeader {
        display: flex;
        align-items: center;
        padding: 5px 20px;
        top: 0;
        right: 0;
        left:0;
        height: 70px;
        font-size: 21px;
        color: ${COLORS.TEXT_MUTE};
        .closeBtn {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: -20px;
            margin-left: 20px;
            fill: ${COLORS.TEXT};
            height: 70px;
            width: 70px;
            background-color: transparent;
            transition: background-color .2s ease-out;
            cursor: pointer;
            &:hover {
              background-color: ${COLORS.LINE};
            }
        }
    }
    .themeHeaderActions{
      flex-grow: 1;
      display: flex;
      justify-content: flex-end;
        & > * {
          margin-left: 10px;
        } 
    }
    .themeHeaderBlock {
      display: flex;
      align-items: center;
      height: 80px;
      padding: 10px;
      background-color: ${COLORS.ATHENSGRAY};
      border-bottom: 1px solid ${COLORS.LAVENDERMIST};
      .themeHeaderItem {
          margin: 0 10px;
          &.name {
            min-width: 250px;
          }
          &.actions {
            flex-grow: 1;
            display: flex;
            justify-content: flex-end;
          }
      }
          .themeHeaderBtn {
          margin-left: 10px;
          }
    }
    .themeHeaderFormatsInfo {
      font-size: 14px;
      color: ${COLORS.TEXT_WARNING};
      &.published {
        color: ${COLORS.TEXT_PRIMARY};
      }
      &.completed {
        color: ${COLORS.TEXT_SUCCESS};
      }
    }
    .themeFormatsBlock {
      //width: 100%;
      height: calc(100% - 150px);
      padding: 10px 20px;
      overflow-y: auto;
      .themeFormatRow  {
        display: flex;
      }
    }
    .spinnerWrap {
      height: 100%;
      display: flex;
      align-items: center;
    }
`;

/**
 * Модалка администрирования темы
 */
const ModalAdminThemePreview: React.FC<IModalAdminThemePreview> = () => {

    const modalAdminThemePreviewData = useSelector(modalAdminThemePreviewSelector);
    const themeData:IthemeData|null = useSelector(themesAdminDataSelector);
    const themesCategories = useSelector(themesAdminCategoriesSelector);
    const userId = useSelector(userIdSelector);

    const escapePress = useKeyPress(27);

    const  themeFormats = themeData && themeData.themeFormats;
    const  themeCategory = themeData && themeData.themeCategory;
    const  themeIsPublished = themeData && themeData.themeIsPublished;
    const  themeName = themeData && themeData.themeName;

    const [isDeletingTheme, setIsDeletingTheme] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const [stateLocation, setStateLocation] = useState('');
    const history = useHistory();
    const location = useLocation();

    const themeId = modalAdminThemePreviewData && modalAdminThemePreviewData.id;
    const themesSelected = modalAdminThemePreviewData && modalAdminThemePreviewData.themesSelected;

    // ESC - закрываем модалку
    useEffect( () => {
        if ( escapePress && closeModal ) closeModal();
    }, [ escapePress ] );

    const closeModal = () => {
        if (modalAdminThemePreviewData && modalAdminThemePreviewData.onClose) modalAdminThemePreviewData.onClose();
        clearThemeDataAction();
        modalAdminThemePreviewAction();
    };

    // закрываем модалку при изменении url
    useEffect(() => {
        if (stateLocation) {
            if (location && location.pathname !== stateLocation) closeModal();
        } else if (location && location.pathname) setStateLocation(location.pathname );
    },[location && location.pathname]);

    // Открываем модалку копирования темы
    const showThemeCopyModalHandler = () => {
        // console.log('themeData', themeData)
        modalAdminThemeCopyAction({ themeId, productGroup: themeData.productGroup, themeName: themeData.themeName, onClose: () => toast.success('Тема успешно скопирована') })
    }

    // Кликаем на формат - открываем его в редакторе
    const onSelectFormatHandler = useCallback((themeLayout) => {
        // Если есть id - сразу лейаут
        if ( themeLayout.id ) {
            // Если опубликована - открываем превью
            if (themeIsPublished) {
                const previewData = {
                    name: themeLayout.name,
                    id: themeLayout.id,
                    svgPreview: themeLayout.preview,
                    format: {
                        w: parseInt(themeLayout.width),
                        h: parseInt(themeLayout.height),
                    },
                    productSlug: THEME_SLUG_TO_PRODUCT_SLUG_MAP[themeData.productGroup || 'decor'],
                    isNew: true
                };
                // Просмотр
                modalSimplePreviewAction(previewData);
                // Получаем превью остальных страниц
                getThemeFormatPreviewAction( themeId, themeLayout.formatSlug ).then((r: any)=>{
                    modalSimplePreviewAction( { ...previewData, svgPreview: r.previewList } );
                });
            } else {
                // Если не опубликована - открываем в редакторе
                closeModal();
                history.push( generatePath( LINKS.EDIT, {
                        productId: themeLayout.id,
                        themeParams: urlParamsToString({
                            productType: themesSelected.productType,
                            themeId: themesSelected.themeId,
                            category: themesSelected.category,
                            format: themesSelected.format,
                            page: themesSelected.page,
                        })
                    }
                ) );
            }
            return null;
        }

        setInProgress(true);


        // Если нет id - создаем лейаут
        const layout = createLayoutTS({
            isCreateThemeFormat: true,
            format: {
                name: themeLayout.name,
                dpi: 200, //TODO временно захаркорен
                width: parseInt( themeLayout.width ),
                height: parseInt( themeLayout.height ),
                formatSlug: themeLayout.formatSlug,
            },
            productGroupSlug: themeData.productGroup,
            userId: userId,
        });

        const state = {
            productData: {
                layout
            }
        };

        // Шлем на сервер созданный layout
        createThemeLayoutAction( layout, generateAllProductPreview(state), themeData.themeId ).catch( err => {
            console.error( 'Ошибка получения layout:', err );
            setInProgress(false);
        } ).then( (result: any) => {
            closeModal();
            if ( result && result.layout ) history.push( generatePath( LINKS.EDIT, {
                productId: result.layout.id,
                themeParams: urlParamsToString(themesSelected)
            } ) );
        });
    }, [themeData, themesSelected]);

    // Если данные темы не загружены - загружаем
    useEffect(() => {
        if (themeId && !themeData) getThemeDataAction(themeId);
    },[themeId, themeData]);

    // Если форматы темы не загружены - загружаем
    useEffect(() => {
        if (themeData && !themeFormats) getThemeFormatsAction(themeId);
    },[themeData, themeFormats]);

    // Удалить тему
    const deleteThemeHandler = useCallback(() => {
        deleteThemeAction(themeId);
        history.push( LINKS.ADMIN_THEMES_MAIN );
    }, []);

    // Условие когда показываем лоадер
    if (!themeId || !themeFormats || inProgress) return <ThemeModalWrap>
                                                            <div className="spinnerWrap">
                                                                <Spinner fill delay={0}/>
                                                            </div>
                                                        </ThemeModalWrap>;

    // Информационный блок
    const information: Iinformation = {
        total: themeFormats && themeFormats.length || 0,
        completed: themeFormats && themeFormats.filter((f)=>f.preview).length || 0,
        isFull: false
    };
    information.isFull = information.total && information.total === information.completed;

    return <ThemeModalWrap isPublished={themeIsPublished} isFull={information.isFull}>
        <div className="themeHeader">
            <h3 className="themeName">{themeName}</h3>
                {isDeletingTheme ?
                    <div className="themeHeaderActions">
                        <Btn onClick={() => setIsDeletingTheme(false)}>Отмена</Btn>
                        <Btn intent={'danger'} onClick={deleteThemeHandler}>Удалить тему навсегда!</Btn>
                    </div>
                    :
                    <div className="themeHeaderActions">
                        <Btn
                            disabled={!themeIsPublished && !information.isFull}
                            onClick={() => changeThemeStatusAction(themeId, !themeIsPublished)}>
                            {themeIsPublished ? 'Снять с публикации' : 'Опубликовать'}
                        </Btn>
                        <Btn
                            intent="info"
                            onClick={ showThemeCopyModalHandler }>
                            Создать копию темы
                        </Btn>
                        {!themeIsPublished &&
                        <Btn intent={'danger'} onClick={() => setIsDeletingTheme(true)}>Удалить тему</Btn>}
                    </div>
                }
            <div className={"closeBtn"} onClick={closeModal}>
                <IconClose size={48}/>
            </div>
        </div>
        <div className="themeHeaderBlock">
            <div className="themeHeaderItem name">
                <Input latent
                       value={themeName || ''}
                       onChange={(x)=>updateThemeAction(themeId, {name: x})}
                       disabled={themeIsPublished}
                />
            </div>
            {themeCategory && <div className="themeHeaderItem category">
                <Select list={themesCategories}
                        selectedId={themeCategory}
                        onSelect={(x)=>updateThemeAction(themeId, {category: x})}
                        disabled={themeIsPublished}
                />
            </div>}
            <div className="themeHeaderItem actions">
                <div className={`themeHeaderFormatsInfo ${ themeIsPublished ? 'published' : information.isFull ? 'completed' : ''}`}>
                    {themeIsPublished ?
                        <span>Тема опубликована</span> :
                        <span>Заполнено форматов: {information.completed} из {information.total}</span>
                    }
                </div>
            </div>
        </div>
        <ThemeFormats information={information} themeId={themeId} onSelect={onSelectFormatHandler} formatsList={themeFormats} disabled={themeIsPublished}/>

    </ThemeModalWrap>;

};

export default memo(ModalAdminThemePreview);