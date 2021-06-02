import { getBackgroundsPacksAction, getBackgroundsByPacksIdAction } from "../actions/backgrounds";
import { productLayoutSelector } from "./layout";
import { IBackground } from "../interfaces/backgrounds";
// @ts-ignore
import { ICreateContentBackground } from '__TS/interaces/layout';
// @ts-ignore
import { IBackgroundPack } from '__TS/interaces/backgrounds';


const emptyArray = [];
const emptyObj = {};

/**
 * селектор наборов фонов
 * @param state
 */
export const backgroundsPacksSelector = ( state: any ): any => {
    let backgroundsPacks: IBackgroundPack[] | null = state.backgrounds && state.backgrounds.backgroundsPacks;
    let backgroundsThemePacks: IBackgroundPack[] | null = state.backgrounds && state.backgrounds.backgroundsThemePacks;

    //если набор стикеров null, значит начальное состояние, запрашиваем данные
    if ( backgroundsPacks === null ) {
        getBackgroundsPacksAction();
    }


    const bgs = !Array.isArray( backgroundsPacks ) ? emptyArray : backgroundsPacks;
    const themeBgs = !Array.isArray(backgroundsThemePacks) ? emptyArray : backgroundsThemePacks;

    return [ ...themeBgs, ...bgs ];
}

/**
 * селектор id выбранного пака фонов
 * @param state
 */
export const backgroundsPacksSelectedIdSelector = ( state: any ): string => {
    // @ts-ignore
    return state.backgrounds && state.backgrounds.currentBackgroundPackId || "";
}

/**
 * селектор фонов из выбранного пака
 * @param state
 * @param id
 */
export const backgroundsInSelectedPackSelector = ( state: any, id: string ): any => {

    const backgroundsByPackId = state.backgrounds.backgrounds[ id ];

    if ( backgroundsByPackId === 'progress' ) return emptyObj;

    //если стекеры из набора не загружен запрашиваем данные
    if ( id !== 'theme' && ( !backgroundsByPackId || !backgroundsByPackId.length ) ) {
        getBackgroundsByPacksIdAction( id );
    }

    return !backgroundsByPackId || typeof backgroundsByPackId !== 'object' || !Object.keys( backgroundsByPackId ).length ? emptyObj : backgroundsByPackId;
}

/**
 * Получить конфиг фонов
 */
export const backgroundConfigSelector = ( state: any ): null => {
    const layout = productLayoutSelector( state );
    if ( layout && layout.config && layout.config.background ) {
        return layout.config.background;
    }

    return null;
}

/**
 * Получить фон по id
 * @param state
 * @param id
 */
export const backgroundByIdSelector = ( state: any, { bgId, bgSetId }: { bgId: string, bgSetId: string } ): IBackground => {

    const bgPackObj = state.backgrounds && state.backgrounds.backgrounds[ bgSetId ];
    if ( !bgPackObj ) return null;

    const bgObjectsArray = bgPackObj.filter( item => item.id === bgId );

    return bgObjectsArray && bgObjectsArray[0] || null;
}

export const backgroundGetCurrentInLayout = ( state ): ICreateContentBackground | null=> {
    const editor = state.editor;

    if ( editor.controlElementType !== 'background' ) {
        return null;
    }

    const layout = productLayoutSelector( state );

    return layout.contents[ editor.controlElementId ] || null;
}