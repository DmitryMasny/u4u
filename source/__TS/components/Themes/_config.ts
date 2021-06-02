
// @ts-ignore
import { SLUGS, THEME_PRODUCT_GROUP } from 'const/productsTypes';
// @ts-ignore
import { productGetId } from "libs/helpers";


/** Constants */
export const ITEMS_BY_PAGE = 20;

/** Генерирование ключа для тем в reduxState */
export const createThemesKey = ({ productType = 0, format = 0, category = 0, page = 1, specProject = null }):string => {
    let key = 'productType:' + productType +
        '-category:' + category +
        '-format:' + format +
        '-page:' + page;

    if ( specProject ) key += '-spec:' + specProject;

    return key;
}


export const PRODUCT_TYPES_MAP = {
    [THEME_PRODUCT_GROUP.DECOR]: productGetId(SLUGS.POSTER_SIMPLE),
    [THEME_PRODUCT_GROUP.CALENDAR_WALL_SIMPLE]: productGetId(SLUGS.CALENDAR_WALL_SIMPLE),
    [THEME_PRODUCT_GROUP.CALENDAR_WALL_FLIP]: productGetId(SLUGS.CALENDAR_WALL_FLIP),
    [THEME_PRODUCT_GROUP.CALENDAR_TABLE_FLIP]: productGetId(SLUGS.CALENDAR_TABLE_FLIP),
    [THEME_PRODUCT_GROUP.PUZZLE]: productGetId(SLUGS.PUZZLE),
}
export const THEME_SLUG_TO_PRODUCT_SLUG_MAP = {
    [THEME_PRODUCT_GROUP.DECOR]: SLUGS.POSTER_SIMPLE,
    [THEME_PRODUCT_GROUP.CALENDAR_WALL_SIMPLE]: SLUGS.CALENDAR_WALL_SIMPLE,
    [THEME_PRODUCT_GROUP.CALENDAR_WALL_FLIP]: SLUGS.CALENDAR_WALL_FLIP,
    [THEME_PRODUCT_GROUP.CALENDAR_TABLE_FLIP]: SLUGS.CALENDAR_TABLE_FLIP,
    [THEME_PRODUCT_GROUP.PUZZLE]: SLUGS.PUZZLE,
}