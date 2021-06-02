import { getAdminBackgroundsAction, getCurrentBackgroundPackAction } from "__TS/actions/admin/adminBackgrounds";
import { IadminBackgroundsList, IcurrentBackgroundPack } from "__TS/interfaces/admin/adminBackgrounds";


/**
 * AdminBackgrounds
 */
export const adminBackgroundsSelector = ( state: any ):IadminBackgroundsList[] | boolean => {
    const backgroundsList: IadminBackgroundsList[] | string  = state.admin.backgrounds.backgroundPacksList;

    if ( backgroundsList === 'progress') {
        return false;
    } else if ( Array.isArray(backgroundsList) ) return backgroundsList;
    getAdminBackgroundsAction();
    return false;
};

export const adminCurrentBackgroundPackSelector = ( state: any ):IcurrentBackgroundPack | null => {
    const id = adminCurrentBackgroundPackIdSelector( state );
    const current: IcurrentBackgroundPack = state.admin.backgrounds.backgroundPacks[id];
    if (id && !current) getCurrentBackgroundPackAction(id);
    return current || null;
};

export const adminCurrentBackgroundPackIdSelector = ( state: any ):string => state.admin.backgrounds.currentBackgroundPackId;
export const adminBackgroundsConfigSelector = ( state: any ):any => state.admin.backgrounds.config;




export const windowIsMobileSelector = ( state: any ): boolean => state.global.windowIsMobile;