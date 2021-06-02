/**
 * Константы и настройка магазина
 */
// @ts-ignore
import {PRODUCT_TYPES} from 'const/productsTypes';

/**
 * Константы Статусов
 */
export const STATUSES = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    DELETED: 'deleted',
};

/**
 * Текст
 */
export const SHOP_TEXT = {
    STATUS_DRAFT:           'Черновик',
    STATUS_DRAFT_S:         'Черновики',
    STATUS_PUBLISHED:       'На витрине',
    STATUS_PUBLISHED_S:     'На витрине',
    STATUS_DELETED:         'Удален',
    STATUS_DELETED_S:       'Удалены',
};

/**
 * Табы статусов
 */
export const MY_SHOP_STATUSES = [
    { id: STATUSES.DRAFT,           title: SHOP_TEXT.STATUS_DRAFT_S },
    { id: STATUSES.PUBLISHED,       title: SHOP_TEXT.STATUS_PUBLISHED_S },
    { id: STATUSES.DELETED,         title: SHOP_TEXT.STATUS_DELETED_S },
];
