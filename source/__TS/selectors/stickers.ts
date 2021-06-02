// @ts-ignore
import { ISticker, IStickerConfig, IStickerPack } from '__TS/intefraces/stickers';
// @ts-ignore
import { getStickersByPacksIdAction, getStickersPacksAction } from '__TS/actions/stickers';
// @ts-ignore
import { productLayoutSelector } from '__TS/selectors/layout';


const emptyArray = [];
const emptyObj = {};

/**
 * селектор основных наборов стикеров
 * @param state
 */
export const stickersPacksSelector = ( state: any ): IStickerPack[] | [] => {

    const stickersPacks: IStickerPack[] | [] | string | null = state.stickers && state.stickers.stickersPacks;

    //если набор стикеров null, значит начальное состояние, запрашиваем данные
    if ( stickersPacks === null ) {
        getStickersPacksAction();
    }

    return !Array.isArray( stickersPacks ) ? emptyArray : stickersPacks;
}

/**
 * селектор id выбранного пака стикеров
 * @param state
 */
export const stickersPacksSelectedIdSelector = ( state: any ): string => {
// @ts-ignore
    return state.stickers && state.stickers.currentStickerPackId || "";
}

/**
 * селектор количества стикеров темы
 * @param state
 */
export const themeStickersCountSelector = ( state: any ): number => {
    // @ts-ignore
    return state.stickers && state.stickers.themeStickersCount || 0;
}

/**
 * селектор стикеров из выбранного пака
 * @param state
 */
export const stickersInSelectedPackSelector = ( state: any ): ISticker[] => {
    const selectedStickerPackId: string = stickersPacksSelectedIdSelector( state );
    const stickersByPackId = state.stickers.stickers[ selectedStickerPackId ];

    //если стикеры из набора не загружены запрашиваем данные
    if ( selectedStickerPackId.length && !stickersByPackId && selectedStickerPackId !== 'theme' ) {
        getStickersByPacksIdAction( selectedStickerPackId );
    }

    return !stickersByPackId || typeof stickersByPackId !== 'object' || !Object.keys( stickersByPackId ).length ? emptyObj : stickersByPackId;
}

/**
 * Получить стикер по id
 * @param state
 * @param id
 */
export const stickerByIdSelector = ( state: any, { stickerId, stickerSetId }: { stickerId: string, stickerSetId: string } ): ISticker => {

    const layout = productLayoutSelector( state );
    const themeId: string = layout.themeId || layout.theme && layout.theme.id;

    stickerSetId = stickerSetId === themeId ? 'theme' : stickerSetId;

    const stickersByPackId = state.stickers.stickers[ stickerSetId ];

    if ( !stickersByPackId ) return null;

    const sticker = stickersByPackId.filter( item => item.id === stickerId);

    return sticker[0];
}

/**
 * Получить конфиг стикеров
 */
export const stickerConfigSelector = ( state: any ): IStickerConfig | null => {
    const layout = productLayoutSelector( state );

    if ( layout && layout.config && layout.config.sticker ) {
        return layout.config.sticker;
    }

    return null;
}