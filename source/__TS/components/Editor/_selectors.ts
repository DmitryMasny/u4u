import { EDITOR_TABS } from "./_config";
// @ts-ignore
import { productPhotosSelector } from "__TS/selectors/photo";
// @ts-ignore
import { productLayoutAreasListSelector, backgroundIdBySelectedAreaNumber } from "__TS/selectors/layout";


export const currentControlElementIdSelector = ( state: any ): string => state.editor && state.editor.controlElementId || 0;
export const currentControlElementTypeSelector = ( state: any ): string => state.editor && state.editor.controlElementType || '';
export const currentControlWidthPxSelector = ( state: any ): string => state.editor && state.editor.controlWidthPx || 0;
export const ratioSelector = ( state: any ): number => state.editor && state.editor.ratio || 1;

export const windowIsMobileSelector = ( state: any ): boolean => state.global.windowIsMobile;
export const windowHeightSelector = ( state: any ): number => state.global.windowHeight;
// export const windowMediaSelector = ( state ) => state.global.windowMedia;
export const windowIsXsSelector = ( state: any ): boolean => state.global.windowMedia === 'xs';
export const currentTabSelector = ( state: any ): string => state.editor.tab;
export const isMagneticSelector = ( state: any ): boolean => state.editor.magnetic;

export const exitConfirmModalSelector = ( state: any ): boolean => state.editor.exitConfirmModal;

export const selectedAreaSelector = ( state: any ): number => state.editor.selectedArea;
export const selectedPageNumberSelector = ( state: any ): number => state.editor.selectedPage;

export const photoLibraryShowOnlyNotUsedSelector = ( state: any ): boolean => state.editor.photoLibraryShowOnlyNotUsed;

export const notGoodPhotosSelector = ( state: any ): any[] => {
    if ( typeof state.editor.notGoodPhotos === 'object' ) {
        return Object.keys( state.editor.notGoodPhotos ).map( k => state.editor.notGoodPhotos[k] );
    }
    return [];
}
export const notAcceptedPhotosSelector = ( state: any ): any[] => {
    if ( typeof state.editor.notAcceptedPhotos === 'object' ) {
        return Object.keys( state.editor.notAcceptedPhotos ).map( k => state.editor.notAcceptedPhotos[k] );
    }
    return [];
}

export const themesLibrarySelector = ( state ) => state.editor.themesLibrary;
export const textLibrarySelector = ( state ) => state.editor.textLibrary;
export const framesLibrarySelector = ( state ) => state.editor.framesLibrary;
export const stickersLibrarySelector = ( state ) => state.editor.stickersLibrary;
export const backgroundsLibrarySelector = ( state ) => state.editor.backgroundsLibrary;
export const templatesLibrarySelector = ( state ) => state.editor.templatesLibrary;
export const photosLibrarySelectionSelector = ( state ) => state.editor.photosLibrarySelection;
export const themesLibrarySelectionSelector = ( state ) => state.editor.themesLibrarySelection;
export const templatesLibrarySelectionSelector = ( state ) => state.editor.templatesLibrarySelection;

export const getLibrarySelector = ( state: any ): Array<any> | null => {
    switch ( currentTabSelector( state ) ) {
        case EDITOR_TABS.PHOTOS:      return productPhotosSelector( state );
        case EDITOR_TABS.BACKGROUNDS: return backgroundsLibrarySelector( state );
        // case EDITOR_TABS.THEMES:      return themesLibrarySelector( state );
        case EDITOR_TABS.TEXT:        return textLibrarySelector( state );
        case EDITOR_TABS.FRAMES:      return framesLibrarySelector( state );
        case EDITOR_TABS.STICKERS:    return stickersLibrarySelector( state );
        case EDITOR_TABS.TEMPLATES:   return templatesLibrarySelector( state );

        default: return productPhotosSelector( state );
    }
};

export const getLibrarySelectionSelector = ( state: any ): any => {
    switch ( currentTabSelector( state ) ) {
        case EDITOR_TABS.PHOTOS:    return photosLibrarySelectionSelector( state );
        // case EDITOR_TABS.THEMES:    return themesLibrarySelectionSelector( state );
        case EDITOR_TABS.TEMPLATES: return templatesLibrarySelectionSelector( state );
        default:
            return () => null;
    }
};

export const getBackgroundsPacksSelector = ( state: any ): any => {
    //TODO WTF?
}
export const themeIdSelector = ( state ) => state.editor.themeId;
export const themeFormatsSelector = ( state ) => state.editor.themeFormats;
export const themeNameSelector = ( state ) => state.editor.themeName;
export const themeCategorySelector = ( state ) => state.editor.themeCategory;
export const themeIsPublishedSelector = ( state ) => state.editor.themeIsPublished;

export const fullscreenLoaderSelector = ( state ) => state.editor.fullscreenLoader;

export const getSelectedAreaNumberSelector = ( state ) => state.editor.selectedArea;

export const selectedAreaIdSelector = ( state ) => {
    const areaList = productLayoutAreasListSelector( state );
    if ( areaList && Array.isArray( areaList ) ) {
        const areaSelected = getSelectedAreaNumberSelector( state );
        return areaList[ areaSelected - 1 ];
    }

    return null;
}

export const currentBgIdSelector = ( state ): string => {
    return backgroundIdBySelectedAreaNumber( state, getSelectedAreaNumberSelector( state ) );
}

//export const pagesPanelSelector = ( state ) => state.editor.pagesPanelExpand;
//export const photosLibrarySelector = ( state ) => state.editor.photosLibrary;

/*
export const windowWidthSelector = ( state ) => state.global.windowWidth;

export const windowMediaSelector = ( state ) => state.global.windowMedia;

export const windowOrientationSelector = ( state ) => state.global.windowOrientation;
export const windowScrollSelector = ( state ) => state.global.windowScroll;
*/

