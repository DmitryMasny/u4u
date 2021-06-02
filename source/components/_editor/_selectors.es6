import {EDITOR_TABS} from "./_config";

export const currentTabSelector = ( state ) => state.editor.tab;
export const pagesPanelSelector = ( state ) => state.editor.pagesPanelExpand;

export const photosLibrarySelector = ( state ) => state.editor.photosLibrary;
export const themesLibrarySelector = ( state ) => state.editor.themesLibrary;
export const textLibrarySelector = ( state ) => state.editor.textLibrary;
export const framesLibrarySelector = ( state ) => state.editor.framesLibrary;
export const stickersLibrarySelector = ( state ) => state.editor.stickersLibrary;
export const templatesLibrarySelector = ( state ) => state.editor.templatesLibrary;

export const photosLibrarySelectionSelector = ( state ) => state.editor.photosLibrarySelection;
export const themesLibrarySelectionSelector = ( state ) => state.editor.themesLibrarySelection;
export const templatesLibrarySelectionSelector = ( state ) => state.editor.templatesLibrarySelection;

export const getLibrarySelector = (tab) => {
    switch (tab) {
        case EDITOR_TABS.PHOTOS:    return photosLibrarySelector;
        case EDITOR_TABS.THEMES:    return themesLibrarySelector;
        case EDITOR_TABS.TEXT:      return textLibrarySelector;
        case EDITOR_TABS.FRAMES:    return framesLibrarySelector;
        case EDITOR_TABS.STICKERS:  return stickersLibrarySelector;
        case EDITOR_TABS.TEMPLATES: return templatesLibrarySelector;

        default: return photosLibrarySelector;
    }
};

export const getLibrarySelectionSelector = (tab) => {
    switch (tab) {
        case EDITOR_TABS.PHOTOS:    return photosLibrarySelectionSelector;
        case EDITOR_TABS.THEMES:    return themesLibrarySelectionSelector;
        case EDITOR_TABS.TEMPLATES: return templatesLibrarySelectionSelector;

        default: return ()=>null;
    }
};

export const windowWidthSelector = ( state ) => state.global.windowWidth;
export const windowHeightSelector = ( state ) => state.global.windowHeight;
export const windowMediaSelector = ( state ) => state.global.windowMedia;
export const windowIsMobileSelector = ( state ) => state.global.windowIsMobile;
export const windowOrientationSelector = ( state ) => state.global.windowOrientation;
// export const windowScrollSelector = ( state ) => state.global.windowScroll;
