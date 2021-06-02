import React, {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from "react-redux";
import Navbar from 'components/Navbar';

import {EDITOR_TABS} from './_config'
import TEXT_EDITOR from 'texts/editor'
import { IconNavFrames,
    IconNavPhotos,
    IconNavStickers,
    IconNavTemplates,
    IconNavText,
    IconNavThemes } from 'components/Icons'


import {currentTabSelector, windowIsMobileSelector} from './_selectors';
import { setTabAction } from './_actions';

const EDITOR_NAVBAR_TABS = [
    { id: EDITOR_TABS.PHOTOS,       title: TEXT_EDITOR.PHOTO_,      icon: <IconNavPhotos/> },
    { id: EDITOR_TABS.THEMES,       title: TEXT_EDITOR.THEMES,      icon: <IconNavThemes/> },
    { id: EDITOR_TABS.TEXT,         title: TEXT_EDITOR.TEXT,        icon: <IconNavText/> },
    { id: EDITOR_TABS.FRAMES,       title: TEXT_EDITOR.FRAMES,      icon: <IconNavFrames/> },
    { id: EDITOR_TABS.STICKERS,     title: TEXT_EDITOR.STICKERS,    icon: <IconNavStickers/> },
    { id: EDITOR_TABS.TEMPLATES,    title: TEXT_EDITOR.TEMPLATES,   icon: <IconNavTemplates/> },
];

/**
 * Панель навигации по разделам Редактора
 */
const EditorNavbar = (props) => {
    const dispatch = useDispatch(),
          currentTab = useSelector( state => currentTabSelector( state ) ),
          isMobile = useSelector( state => windowIsMobileSelector( state ) );

    return <Navbar selectTabAction={(tab) => dispatch(setTabAction(tab))}
                   currentTab={currentTab}
                   isMobile={isMobile}
                   tabs={EDITOR_NAVBAR_TABS}
                   height={49}
                   disabled={false}
    />
};

export default EditorNavbar;