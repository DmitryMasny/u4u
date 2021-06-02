export interface IUploadModalSelector {
    acceptFormats?: [string];
    packId?: string;
    themeId?: string;
    uploadCallback?: any;
    config?: any;
}

export const modalUploadStickersSelector = state => state.modals.modalUploadStickers;
export const modalCreateThemeSelector = state => state.modals.modalCreateTheme;
export const modalAdminThemePreviewSelector = ( state ): any => state.modals.adminThemePreview;
export const modalAdminThemeCopySelector = ( state ): any => state.modals.adminThemeCopy;
export const modalUploadBackgroundsSelector: ( state ) => IUploadModalSelector = state => state.modals.modalUploadBackgrounds;

export const modalAutoFillSelector = state => state.modals.autoFill;

export const windowIsMobileSelector = ( state: any ): boolean => state.global.windowIsMobile;
