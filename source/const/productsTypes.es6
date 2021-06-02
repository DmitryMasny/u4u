import TEXT_MY_PRODUCTS from 'texts/my_products';

export const PRODUCT_TYPE_PHOTOBOOK         = 'photoBook';
export const PRODUCT_TYPE_POSTER            = 'poster';
export const PRODUCT_TYPE_PHOTO             = 'photo';
export const PRODUCT_TYPE_CANVAS            = 'canvas';

export const PRODUCT_TYPES = {
    PHOTOBOOK:  'photobook',
    POSTER:     'poster',
    PHOTO:      'photo',
    PUZZLE:     'puzzle',
    CANVAS:     'canvas',
    CALENDAR:   'calendar',
    OTHER:      'other',
};

export const SLUGS = {
    PHOTO_SIMPLE:           'PHOTO_SIMPLE',
    PHOTO_PREMIUM:          'PHOTO_PREMIUM',
    POSTER_SIMPLE:          'POSTER_SIMPLE',
    POSTER_PREMIUM:         'POSTER_PREMIUM',
    POSTER_CANVAS:          'POSTER_CANVAS',
    CALENDAR_WALL_SIMPLE:   'CALENDAR_WALL_SIMPLE',
    CALENDAR_WALL_FLIP:     'CALENDAR_WALL_FLIP',
    CALENDAR_TABLE_FLIP:    'CALENDAR_TABLE_FLIP',
    PUZZLE:                 'PUZZLE_SIMPLE',
};

export const PRODUCT_SLUG = {
    [ PRODUCT_TYPES.POSTER ]:       { type: PRODUCT_TYPES.POSTER, prefix: 'P', name: TEXT_MY_PRODUCTS.POSTER  },
    [ PRODUCT_TYPES.PHOTO ]:        { type: PRODUCT_TYPES.PHOTO, prefix: 'F', name: TEXT_MY_PRODUCTS.PHOTO },
    [ PRODUCT_TYPES.CANVAS ]:       { type: PRODUCT_TYPES.CANVAS, prefix: 'H', name: TEXT_MY_PRODUCTS.CANVAS },
    [ PRODUCT_TYPES.PHOTOBOOK ]:    { type: PRODUCT_TYPES.PHOTOBOOK, prefix: 'A', name: '' },
    [ SLUGS.POSTER_SIMPLE ]:        { id: '4', type: PRODUCT_TYPES.POSTER, prefix: 'P', name: TEXT_MY_PRODUCTS.POSTER  },
    [ SLUGS.PHOTO_SIMPLE ]:         { id: '5', type: PRODUCT_TYPES.PHOTO, prefix: 'F', name: TEXT_MY_PRODUCTS.PHOTO },
    [ SLUGS.POSTER_PREMIUM ]:       { id: '6', type: PRODUCT_TYPES.POSTER, prefix: 'P', name: TEXT_MY_PRODUCTS.POSTER_P  },
    [ SLUGS.PHOTO_PREMIUM ]:        { id: '7', type: PRODUCT_TYPES.PHOTO, prefix: 'F', name: TEXT_MY_PRODUCTS.PHOTO_P },
    [ SLUGS.POSTER_CANVAS ]:        { id: '8', type: PRODUCT_TYPES.CANVAS, prefix: 'H', name: TEXT_MY_PRODUCTS.CANVAS  },
    [ SLUGS.CALENDAR_WALL_SIMPLE ]: { id: '9', type: PRODUCT_TYPES.CALENDAR, prefix: 'C', name: TEXT_MY_PRODUCTS.CALENDAR },
    [ SLUGS.CALENDAR_WALL_FLIP ]:   { id: '10', type: PRODUCT_TYPES.CALENDAR, prefix: 'C', name: TEXT_MY_PRODUCTS.CALENDAR },
    [ SLUGS.CALENDAR_TABLE_FLIP ]:  { id: '11', type: PRODUCT_TYPES.CALENDAR, prefix: 'C', name: TEXT_MY_PRODUCTS.CALENDAR },
    [ SLUGS.PUZZLE ]:               { id: '12', type: PRODUCT_TYPES.PUZZLE, prefix: 'Z', name: TEXT_MY_PRODUCTS.PUZZLE },
};

// маппинг для получения product_slug из id продукта
export const PRODUCT_ID_SLUG_MAP = {
    [PRODUCT_SLUG[SLUGS.POSTER_SIMPLE].id]: SLUGS.POSTER_SIMPLE,
    [PRODUCT_SLUG[SLUGS.PHOTO_SIMPLE].id]: SLUGS.PHOTO_SIMPLE,
    [PRODUCT_SLUG[SLUGS.POSTER_PREMIUM].id]: SLUGS.POSTER_PREMIUM,
    [PRODUCT_SLUG[SLUGS.PHOTO_PREMIUM].id]: SLUGS.PHOTO_PREMIUM,
    [PRODUCT_SLUG[SLUGS.POSTER_CANVAS].id]: SLUGS.POSTER_CANVAS,
    [PRODUCT_SLUG[SLUGS.CALENDAR_WALL_SIMPLE].id]: SLUGS.CALENDAR_WALL_SIMPLE,
    [PRODUCT_SLUG[SLUGS.CALENDAR_WALL_FLIP].id]: SLUGS.CALENDAR_WALL_FLIP,
    [PRODUCT_SLUG[SLUGS.CALENDAR_TABLE_FLIP].id]: SLUGS.CALENDAR_TABLE_FLIP,
    [PRODUCT_SLUG[SLUGS.PUZZLE].id]: SLUGS.PUZZLE,
}

// Группы тем продуктов
export const THEME_PRODUCT_GROUP = {
    DECOR:      'decor',
    CALENDAR_WALL_SIMPLE:       SLUGS.CALENDAR_WALL_SIMPLE,
    CALENDAR_WALL_FLIP:         SLUGS.CALENDAR_WALL_FLIP,
    CALENDAR_TABLE_FLIP:        SLUGS.CALENDAR_TABLE_FLIP,
    PUZZLE:                     SLUGS.PUZZLE,
};
export const DEFAULT_THEME_CUTS = {
    cuts: {
        left: 3, right: 3, top: 3, bottom: 3, outside: false
    },
    padding: {
        left: 0, right: 0, top: 0, bottom: 0
    }
};

export const THEME_CUTS_MAP = {
    [THEME_PRODUCT_GROUP.DECOR]: {
        cuts: {
            left: 3, right: 3, top: 3, bottom: 3, outside: false
        },
        padding: {
            left: 45, right: 45, top: 45, bottom: 45
        }
    },
    [THEME_PRODUCT_GROUP.CALENDAR_WALL_SIMPLE]: DEFAULT_THEME_CUTS,
    [THEME_PRODUCT_GROUP.CALENDAR_WALL_FLIP]: DEFAULT_THEME_CUTS,
    [THEME_PRODUCT_GROUP.CALENDAR_TABLE_FLIP]: DEFAULT_THEME_CUTS,
    [THEME_PRODUCT_GROUP.PUZZLE]: {
        cuts: {
            left: 6, right: 6, top: 6, bottom: 6
        }
    },
}