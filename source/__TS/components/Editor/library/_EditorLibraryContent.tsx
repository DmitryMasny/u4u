// @ts-ignore
import React, {memo} from 'react';
// @ts-ignore
import { useSelector } from "react-redux";
import {
    currentTabSelector,
//    getLibrarySelectionSelector,
    getLibrarySelector
} from "../_selectors";

// @ts-ignore
//import Library from "components/Library";
import Spinner from '__TS/components/_misc/Spinner';

import PhotoLibrary from "./_PhotoLibrary";
import TextLibrary from "./_TextLibrary";
import BackgroundsLibrary from "./_BackgroundsLibrary";
import TemplatesLibrary from "./_TemplatesLibrary";


import { EDITOR_TABS } from '../_config'


//import TEXT_EDITOR from 'texts/editor'

// @ts-ignore
import {IMAGE_TYPES} from "const/imageTypes";
import StickersLibrary from "./_StickersLibrary";
import ShapesLibrary from "./_ShapesLibrary";

// @ts-ignore
//import {PHOTO_THUMB_SIZE} from "config/main";

/*
const getTypeByTab = (tab) => {
    switch (tab) {
        case EDITOR_TABS.PHOTOS: return IMAGE_TYPES.GPHOTO;
        case EDITOR_TABS.THEMES: return IMAGE_TYPES.THEME_BG;
        default: return null;
    }
};*/

const EditorLibraryContent: React.FC = () => {
    const contentBySelectedTab = useSelector( getLibrarySelector );

    // Текущий раздел в редакторе
    const tab = useSelector( currentTabSelector );

        switch ( tab ) {
            case EDITOR_TABS.PHOTOS:
                if ( contentBySelectedTab ) return <PhotoLibrary photosList={ contentBySelectedTab } />
                return <Spinner/>
            case EDITOR_TABS.TEXT:
                return <TextLibrary />
            case EDITOR_TABS.STICKERS:
                return <StickersLibrary />
            // case EDITOR_TABS.SHAPES:
            //     return <ShapesLibrary />
            case EDITOR_TABS.TEMPLATES:
                return <TemplatesLibrary />
            case EDITOR_TABS.BACKGROUNDS:
                return <BackgroundsLibrary />
        }
        return null;
};

export default memo( EditorLibraryContent );