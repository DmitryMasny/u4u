// @ts-ignore
import React, {useEffect, useMemo} from 'react';
// @ts-ignore
import { useSelector } from "react-redux";
// @ts-ignore
import Navbar from 'components/Navbar';

import { EDITOR_SIZES, EDITOR_TABS } from './_config'
// @ts-ignore
import TEXT_EDITOR from 'texts/editor'
import {
    IconNavFrames,
    IconNavPhotos,
    IconNavStickers,
    IconNavTemplates,
    IconNavText,
    IconImageCover,
// @ts-ignore    
    IconNavBackgrounds,
// @ts-ignore
} from 'components/Icons';

import { currentTabSelector, windowIsMobileSelector, selectedAreaSelector } from './_selectors';

// @ts-ignore
import { productLayoutThemeId } from '__TS/selectors/layout';
// @ts-ignore
// import { userRoleIsAdmin } from "selectors/user";
import { setNavBarTabAction } from './_actions';

/** Interfaces */
interface IProps {
    isMobile?: boolean; //мобильный режим или нет
}

/** массив вкладок */
const EDITOR_NAV_BAR_TABS = [
    { id: EDITOR_TABS.PHOTOS,       title: TEXT_EDITOR.PHOTO_,      icon: <IconNavPhotos/> },
    { id: EDITOR_TABS.TEXT,         title: TEXT_EDITOR.TEXT,        icon: <IconNavText/> },
    { id: EDITOR_TABS.STICKERS,     title: TEXT_EDITOR.STICKERS,    icon: <IconNavStickers/> },
    //{ id: EDITOR_TABS.FRAMES,       title: TEXT_EDITOR.FRAMES,      icon: <IconNavFrames/> },
    { id: EDITOR_TABS.BACKGROUNDS,  title: TEXT_EDITOR.BACKGROUNDS, icon: <IconNavBackgrounds/> },
    { id: EDITOR_TABS.TEMPLATES,    title: TEXT_EDITOR.TEMPLATES,   icon: <IconNavTemplates/>, showOnlyThemeLayout: true },
];

/**
 * Панель навигации по разделам Редактора
 */
const EditorNavBar: React.FC<IProps> = () => {
    // const isAdmin: boolean = useSelector( userRoleIsAdmin );
    const isMobile: boolean = useSelector( windowIsMobileSelector );
    const currentTab: string = useSelector( currentTabSelector );
    const selectedAreaNum: number = useSelector( selectedAreaSelector );
    const themeId: string = useSelector( productLayoutThemeId );

    useEffect( () => {
        setNavBarTabAction( currentTab );
    }, [ currentTab, selectedAreaNum ] );

    const tabs = useMemo( () => {
         return EDITOR_NAV_BAR_TABS.filter( ( item ) => {
             return !(!themeId && item.showOnlyThemeLayout)
         } );
    }, [ themeId ] )

    // @ts-ignore
    return <Navbar selectTabAction={ tab => setNavBarTabAction( tab ) }
                   currentTab={ currentTab }
                   isMobile={ isMobile }
                   tabs={tabs}
                   height={ isMobile ? EDITOR_SIZES.NAV_PANEL_HEIGHT_XS : EDITOR_SIZES.NAV_PANEL_HEIGHT }
                   disabled={ false }
                   size={'xs'}
    />
};

export default EditorNavBar;