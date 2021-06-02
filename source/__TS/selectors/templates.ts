//получаем шаблоны
import { getTemplatesAction } from "../actions/templates";
import { ILayout } from "../interfaces/layout";
import { productLayoutSelector } from "./layout";

const emptyObj = {};
let x= 0

/**
 * селектор основных наборов стикеров
 * @param state
 */
export const templatesSelector = ( state: any ): any => {

    const areaTemplates = state.templates.svg;
    const templatesLayoutId: string = state.templates.layoutId;
    const layoutId = productLayoutSelector( state ).id;

    //если набор стикеров null, значит начальное состояние, запрашиваем данные
    if ( areaTemplates === null || templatesLayoutId !== null && templatesLayoutId !== layoutId ) {
            getTemplatesAction();
    }

    return !areaTemplates || !Array.isArray( areaTemplates.areas ) ? emptyObj : areaTemplates;
}

export const productLayoutTemplatesSelector = ( state: any ): ILayout | null => {
    return state.templates && state.templates.layout || null;
}