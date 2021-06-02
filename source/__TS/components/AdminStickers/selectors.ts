import { getAdminStickersAction, getCurrentStickerPackAction } from "__TS/actions/admin/adminStickers";
import { IadminStickersList, IcurrentStickerPack } from "__TS/interfaces/admin/adminStickers";


/**
 * AdminStickers
 */
export const adminStickersSelector = ( state: any ):IadminStickersList[] | boolean => {
    const stickersList: IadminStickersList[] | string  = state.admin.stickers.stickersPacksList;

    if ( stickersList === 'progress') {
        return false;
    } else if ( Array.isArray(stickersList) ) return stickersList;

    getAdminStickersAction();
    return false;
};

export const adminCurrentStickerPackSelector = ( state: any ):IcurrentStickerPack | null => {
    const id = adminCurrentStickerPackIdSelector( state );
    const current: IcurrentStickerPack = state.admin.stickers.stickersPacks[id];

    if (id && !current) getCurrentStickerPackAction(id);
    return current || null;
};

export const adminCurrentStickerPackIdSelector = ( state: any ):string => state.admin.stickers.currentStickerPackId;




export const windowIsMobileSelector = ( state: any ): boolean => state.global.windowIsMobile;