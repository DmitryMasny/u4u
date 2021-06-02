// @ts-ignore
import React, { useEffect, useState, useMemo } from 'react';
// @ts-ignore
import { useSelector } from "react-redux";
// @ts-ignore
import { useHistory, useRouteMatch, NavLink } from "react-router-dom";
// @ts-ignore
import { generatePath } from 'react-router';
// @ts-ignore
import {generateThemesUrl} from "__TS/libs/tools";

// @ts-ignore
import LINKS_MAIN from 'config/links';
// @ts-ignore
import { THEME_PRODUCT_GROUP } from 'const/productsTypes';
import { ITEMS_BY_PAGE, PRODUCT_TYPES_MAP } from "./_config";

/** Components */
import ThemesFilters from './_ThemesFilters';
import ThemesGallery from './_ThemesGallery';
// import ThemesProductTypes from './_ThemesProductTypes';
// @ts-ignore
import Paginator from 'components/Paginator';
// @ts-ignore
import SideMenu from 'components/SideMenu';
// @ts-ignore
import { IconTune } from 'components/Icons';
// @ts-ignore
import { Btn } from 'components/_forms';
// @ts-ignore
import TEXT_THEMES from 'texts/themes'
// @ts-ignore
import Spinner from '__TS/components/_misc/Spinner';


/** Selectors */
import {
    themesTotalElementsSelector,
    themesDataSelector,
    windowIsMobileSelector,
    // @ts-ignore
} from "./_selectors";

/** Actions */
import {
    themePreviewAction,
    selectThemeAction,
    getThemeFormatPreviewAction,
    // @ts-ignore
} from "./_actions";

/** Styles */
import {
    ThemesWrapStyled
} from "./_styles";


/** Interfaces */

// @ts-ignore
import { IThemesPage, IThemesSelected } from "__TS/interfaces/themes";

const getNameOfThemeProductType = (type) => {
    const text = TEXT_THEMES[type];
    return text ? 'для ' + text : '';
}
const userThemesLink = generateThemesUrl({})

/**
 * Темы
 */
const Themes: React.FC<IThemesPage> = ( { isAdminPage = false } ) => {
    const themesLink = isAdminPage ? LINKS_MAIN.ADMIN_THEMES : LINKS_MAIN.THEMES;

    //получаем паратеры из URL
    const match: any = useRouteMatch({
        path: themesLink,
        strict: true,
        sensitive: false
    });

    const [themesSelected, setThemesSelected] = useState<IThemesSelected>({
        productType: '',
        format: 0,
        category: 0,
        page: 1,
        themeId: 0,
        init: false
    });
    const [themeProductTypeName, setThemeProductTypeName] = useState<string>('');


    const isMobile = useSelector( windowIsMobileSelector );
    const themesData = useSelector( ( state ) => themesDataSelector( state, themesSelected.init && { ...themesSelected, isAdmin: isAdminPage } ) );
    const totalElements = useSelector( (state) => themesTotalElementsSelector(state, themesSelected.init && themesSelected) );

    const history = useHistory();


    // Назначаем параметры из урла в локальный state
    useEffect( () => {
            if ( match && match.params) {
                if (match.params.page === undefined) {
                    setThemesUrl({page: 1})
                } else if (
                    themesSelected.productType !== match.params.productType ||
                    (themesSelected.format.toString()) !== match.params.format ||
                    (themesSelected.category.toString()) !== match.params.category ||
                    (themesSelected.page.toString()) !== match.params.page ||
                    (themesSelected.themeId.toString()) !== match.params.themeId
                ) {
                    setThemesSelected({
                        productType: match.params.productType || THEME_PRODUCT_GROUP.DECOR,
                        format: match.params.format !== '0' && match.params.format || 0,
                        category: match.params.category !== '0' && match.params.category || 0,
                        page: match.params.page !== '0' && parseInt(match.params.page) || 1,
                        themeId: match.params.themeId !== '0' && match.params.themeId || 0,
                        init: true
                    });
                }
            } else setThemesSelected({...themesSelected, init: true});
    }, [ match && match.params ] );

    // открываем превью темы
    useEffect( () => {
        if ( themesData && themesSelected.themeId ) {
            const openedTheme = themesData.find( ( theme ) => theme.id === themesSelected.themeId );
            if ( openedTheme ) themePreviewHandler( { data: openedTheme } );
        }
    }, [ themesSelected && themesSelected.themeId, themesData ] );

    // название группы продуктов, для которой показываются темы
    useEffect( () => {
        setThemeProductTypeName(getNameOfThemeProductType(themesSelected.productType))
    }, [ themesSelected && themesSelected.productType ] );

    // Меняем урл / выбираем параметры фильтра тем
    const setThemesUrl = ( {productType, format, category, page, themeId,  redirect}: IThemesSelected ) => {
        const path = generatePath( themesLink, {
                productType: productType || themesSelected.productType || match && match.params.productType || THEME_PRODUCT_GROUP.DECOR,
                format:  format || themesSelected.format || match && match.params.format || '0',
                category: category || themesSelected.category || match && match.params.category || '0',
                page: page || themesSelected.page || match && match.params.page || '1',
                themeId:  themeId || themesSelected.themeId || match && match.params.themeId || '0'
            }
        );
        if (redirect) {
            history.push(path);
        } else history.replace(path);
    };


    // Считаем сколько всего страниц в текущем разделе
    const totalPages: number = ( totalElements && typeof totalElements === 'number' ?
        Math.ceil( totalElements / ITEMS_BY_PAGE ) : 0 );

    // Мобильная кнопка фильтров
    const gallerySideMenuBtn = useMemo( () =>
            <Btn className="gallerySideMenuBtn">
                <IconTune/> Фильтры
            </Btn>, [] );



    // Выбор темы в просмотре и ее открытие
    const selectTheme = ( id ) => {
        selectThemeAction( id );
        history.push( LINKS_MAIN.PRODUCT.replace( ':productType?', PRODUCT_TYPES_MAP[themesSelected.productType] ).replace( ':format?', themesSelected.format ).replace( ':themeId?', id ) );
    };

    // Просмотреть тему
    const themePreviewHandler = ( { data } ) => {
        setThemesUrl({
            themeId: data.id,
            redirect: true
        });

        const formatArray = themesSelected.format ? themesSelected.format.toString().split('_') : [300,300];

        const previewData = {
            ...data,
            // @ts-ignore
            format: {w: parseInt(formatArray[0] || '0'), h: parseInt(formatArray[1] || '0')},
            themesSelected: {
                productType: themesSelected.productType,
                format: themesSelected.format,
                category: themesSelected.category,
                page: themesSelected.page,
                themeId: themesSelected.themeId,
            },
            actions: [
                { title: 'Выбрать', action: selectTheme, closeModal: true }
            ],
            onClose: ()=> {
                setThemesUrl({
                    themeId: '0',
                    redirect: true
                })
            }
        };

        if (!isAdminPage) {
            getThemeFormatPreviewAction( data.id, themesSelected.format.toString() ).then((r: any)=>{
                themePreviewAction( { ...previewData, preview: r.previewList }, isAdminPage );
            });
        }

        themePreviewAction( previewData, isAdminPage );
    };

    if ( !themesSelected.productType ) return <Spinner fill/>

    return <div>
        <ThemesWrapStyled isMobile={ isMobile }>

            <div className="themesHeader">
                {/*// @ts-ignore*/}
                <h1 className="themesHeaderText">Темы {themeProductTypeName}</h1>
                {/*// @ts-ignore*/}
                { isAdminPage && !isMobile && <NavLink className={ 'themesHeaderLinkToUserThemes' } to={userThemesLink}>Смотреть темы пользователя</NavLink> }
                {/*<ThemesProductTypes selectedProductType={themesSelected.productType}/>*/}
            </div>
            { isMobile && <div className="themesHeader">
                <SideMenu button={ gallerySideMenuBtn } title={ 'Filters' }>
                    <ThemesFilters setThemeFilter={setThemesUrl} themesSelected={themesSelected} isAdmin={ isAdminPage }/>
                </SideMenu>
            </div> }
            <div className="themesMainBlock">
                { !isMobile && <ThemesFilters setThemeFilter={setThemesUrl} themesSelected={themesSelected} isAdmin={ isAdminPage }/> }
                <div className="galleryWrap">
                    <ThemesGallery
                        themes={ themesData }
                        selectAction={ themePreviewHandler }
                        isAdminPage={isAdminPage}
                        formatSlug={themesSelected.format.toString()}
                    />
                    { totalPages && totalPages > 1 && <Paginator currentPage={ themesSelected.page }
                                                                 totalPages={ totalPages }
                                                                 onSelectPage={ ( page ) => setThemesUrl( {page: page} ) }
                                                                 portal
                    /> || null }
                </div>
            </div>

        </ThemesWrapStyled>
    </div>;
};

export default Themes;